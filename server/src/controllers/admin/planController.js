import { prisma } from "../../config/db.js";
import {
  buildPlanWhereClause,
  formatPlanRecord,
  parsePlanListQuery,
  resolveAllowedServiceIds,
} from "../../services/plans.js";

// Get plans for a specific service by its slug
export const getPlansByService = async (req, res) => {
  const { slug } = req.params;
  const formattedSlug = String(slug || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  try {
    const plans = await prisma.servicePricingPlan.findMany({
      where: {
        service: {
          slug: { in: [formattedSlug, slug] }
        }
      },
      orderBy: {
        sortOrder: "asc",
      },
      include: {
        service: {
          select: {
            slug: true,
            name: true,
            category: { select: { name: true } },
            subcategory: { select: { name: true } },
          },
        },
      }
    });

    res.status(200).json({ ok: true, data: plans.map(formatPlanRecord) });
  } catch (error) {
    console.error("[planController] Error fetching plans:", error);
    res.status(500).json({ ok: false, error: "Internal server error" });
  }
};

// Get all plans for admin dashboard
export const getAllPlans = async (req, res) => {
  try {
    const { page, limit, search, categoryId, subcategoryId, serviceSlug } = parsePlanListQuery(req.query);
    const allowedServiceIds = await resolveAllowedServiceIds(prisma, {
      categoryId,
      subcategoryId,
      serviceSlug,
    });

    if (allowedServiceIds && allowedServiceIds.length === 0) {
      return res.status(200).json({
        ok: true,
        data: [],
        meta: {
          page,
          limit,
          total: 0,
          totalPages: 0,
          hasNextPage: false,
          hasPrevPage: page > 1,
        },
      });
    }

    const where = buildPlanWhereClause({ allowedServiceIds, search });

    const [plans, total] = await Promise.all([
      prisma.servicePricingPlan.findMany({
        where,
        orderBy: [
          { createdAt: "desc" },
          { sortOrder: "asc" },
        ],
        skip: (page - 1) * limit,
        take: limit,
        include: {
          service: {
            select: {
              slug: true,
              name: true,
              category: { select: { name: true } },
              subcategory: { select: { name: true } },
            },
          },
        },
      }),
      prisma.servicePricingPlan.count({ where }),
    ]);

    res.status(200).json({
      ok: true,
      data: plans.map(formatPlanRecord),
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNextPage: page * limit < total,
        hasPrevPage: page > 1,
      },
    });
  } catch (error) {
    console.error("[planController] Error fetching all plans:", error);
    res.status(500).json({ ok: false, error: "Internal server error" });
  }
};

// Create a new plan (Admin only)
export const createPlan = async (req, res) => {
  const { serviceSlug, name, description, price, oldPrice, tag, isHighlighted, features, sortOrder } = req.body;

  // Split by comma and clean up slugs
  const slugs = serviceSlug
    .split(",")
    .map((s) => normalizeSlug(s.trim()))
    .filter(Boolean);

  if (slugs.length === 0) {
    return res.status(400).json({ ok: false, error: "Valid service slugs are required" });
  }

  try {
    const matchingServices = await prisma.service.findMany({
      where: { slug: { in: slugs } },
      select: { id: true, slug: true },
    });
    const serviceIdBySlug = new Map(matchingServices.map((service) => [service.slug, service.id]));

    const plansToCreate = slugs.map((slug) => ({
      serviceId: serviceIdBySlug.get(slug),
      name,
      description,
      price,
      oldPrice,
      tag,
      isHighlighted: isHighlighted === true || isHighlighted === "true",
      features: Array.isArray(features) ? features : [],
      sortOrder: Number(sortOrder) || 0,
    })).filter(p => p.serviceId);

    if (plansToCreate.length === 0) {
      return res.status(400).json({ ok: false, error: "No matching services found for the provided slugs" });
    }

    await prisma.servicePricingPlan.createMany({
      data: plansToCreate,
    });

    res.status(201).json({ ok: true, message: `${plansToCreate.length} plan(s) created successfully` });
  } catch (error) {
    console.error("[CRITICAL] Error creating plan:", error);
    res.status(500).json({ ok: false, error: error.message || "Internal server error" });
  }
};

// Update a plan (Admin only)
export const updatePlan = async (req, res) => {
  const { id } = req.params;
  const updateData = { ...req.body };

  try {
    const { features, sortOrder, isHighlighted, serviceSlug, ...rest } = updateData;

    const finalData = { ...rest };
    if (features) finalData.features = Array.isArray(features) ? features : [];
    if (sortOrder !== undefined) finalData.sortOrder = Number(sortOrder);
    if (isHighlighted !== undefined) finalData.isHighlighted = isHighlighted === true || isHighlighted === "true";
    if (serviceSlug) {
      const slug = normalizeSlug(serviceSlug);
      const service = await prisma.service.findUnique({
        where: { slug },
        select: { id: true },
      });
      if (service?.id) {
        finalData.serviceId = service.id;
      }
    }

    const plan = await prisma.servicePricingPlan.update({
      where: { id },
      data: finalData,
    });

    res.status(200).json({ ok: true, data: plan });
  } catch (error) {
    console.error("[CRITICAL] Error updating plan:", error);
    res.status(500).json({ ok: false, error: error.message || "Internal server error" });
  }
};

// Assign an existing purchase plan to a client account and open the payment flow.
export const assignPlanToUser = async (req, res) => {
  const { id } = req.params;
  const { userId, note } = req.body || {};

  if (!userId) {
    return res.status(400).json({ ok: false, error: "Client user is required." });
  }

  try {
    const [plan, user] = await Promise.all([
      prisma.servicePricingPlan.findUnique({
        where: { id },
        include: { service: { select: { id: true, name: true, slug: true } } },
      }),
      prisma.user.findUnique({
        where: { id: userId },
        select: { id: true, name: true, email: true, phone: true, role: true },
      }),
    ]);

    if (!plan) {
      return res.status(404).json({ ok: false, error: "Plan not found." });
    }
    if (!user) {
      return res.status(404).json({ ok: false, error: "Client user not found." });
    }
    if (user.role !== "USER") {
      return res.status(400).json({ ok: false, error: "Plans can only be assigned to client users." });
    }

    const payableAmount = String(plan.price || "").replace(/[^0-9.]/g, "");
    if (!payableAmount || Number.isNaN(Number.parseFloat(payableAmount))) {
      return res.status(400).json({
        ok: false,
        error: "Only fixed-price plans can be assigned for direct payment.",
      });
    }

    const serviceName = plan.service?.name || "Unknown Service";
    const paymentServiceName = `${serviceName} - ${plan.name}`;
    const existingPendingPayment = await prisma.paymentRecord.findFirst({
      where: {
        userId: user.id,
        serviceName: paymentServiceName,
        amount: plan.price,
        status: "UNPAID (Assigned Plan)",
      },
      select: { id: true, leadId: true },
    });

    if (existingPendingPayment) {
      return res.status(409).json({
        ok: false,
        error: "This plan is already assigned to the selected user and is still unpaid.",
        data: existingPendingPayment,
      });
    }

    const metadata = JSON.stringify({
      source: "ADMIN_ASSIGNED_PLAN",
      assignedByAdminId: req.user.id,
      assignedAt: new Date().toISOString(),
      selectedPlanId: plan.id,
      selectedPlanName: plan.name,
      selectedPlanPrice: plan.price,
      serviceSlug: plan.service?.slug || "",
      adminNote: typeof note === "string" ? note.trim() : "",
    });

    const result = await prisma.$transaction(async (tx) => {
      const lead = await tx.lead.create({
        data: {
          fullName: user.name,
          email: user.email,
          phone: user.phone || "Not Provided",
          serviceName,
          sourcePageSlug: plan.service?.slug || "",
          source: "OTHER",
          formType: "REGISTRATION",
          status: "IN_PROGRESS",
          metadata,
          serviceId: plan.serviceId,
          userId: user.id,
          message: typeof note === "string" && note.trim() ? note.trim() : undefined,
        },
      });

      const payment = await tx.paymentRecord.create({
        data: {
          userId: user.id,
          leadId: lead.id,
          customerName: user.name,
          customerEmail: user.email,
          customerPhone: user.phone,
          serviceName: paymentServiceName,
          amount: plan.price,
          status: "UNPAID (Assigned Plan)",
        },
      });

      await tx.message.create({
        data: {
          senderId: req.user.id,
          receiverId: user.id,
          leadId: lead.id,
          content: `A service plan has been assigned to your account: ${paymentServiceName}. Please open your dashboard to review and complete the payment.`,
        },
      });

      return { lead, payment };
    });

    return res.status(201).json({
      ok: true,
      message: "Plan assigned to client successfully.",
      data: result,
    });
  } catch (error) {
    console.error("[planController] Error assigning plan to user:", error);
    return res.status(500).json({ ok: false, error: error.message || "Failed to assign plan." });
  }
};

// Delete a plan (Admin only)
export const deletePlan = async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.servicePricingPlan.delete({
      where: { id }
    });

    res.status(200).json({ ok: true, message: "Plan deleted successfully" });
  } catch (error) {
    console.error("[planController] Error deleting plan:", error);
    res.status(500).json({ ok: false, error: "Internal server error" });
  }
};
