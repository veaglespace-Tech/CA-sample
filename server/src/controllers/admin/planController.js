import { prisma } from "../../config/db.js";

const normalizeSlug = (value = "") =>
  String(value)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

// Get plans for a specific service by its slug
export const getPlansByService = async (req, res) => {
  const { slug } = req.params;
  const formattedSlug = normalizeSlug(slug);

  try {
    const plans = await prisma.purchasePlan.findMany({
      where: {
        OR: [
          { serviceSlug: formattedSlug },
          { serviceSlug: slug }, // Fallback for existing legacy entries
        ],
        isActive: true,
      },
      orderBy: {
        sortOrder: "asc",
      },
    });

    res.status(200).json({ ok: true, data: plans });
  } catch (error) {
    console.error("[planController] Error fetching plans:", error);
    res.status(500).json({ ok: false, error: "Internal server error" });
  }
};

// Get all plans for admin dashboard
export const getAllPlans = async (req, res) => {
  try {
    const page = Math.max(Number(req.query.page || 1), 1);
    const limit = Math.min(Math.max(Number(req.query.limit || 10), 1), 50);
    const search = String(req.query.search || "").trim();
    const categoryId = String(req.query.categoryId || "").trim();
    const subcategoryId = String(req.query.subcategoryId || "").trim();
    const serviceSlug = normalizeSlug(String(req.query.serviceSlug || "").trim());

    const serviceWhere = {};
    if (serviceSlug) {
      serviceWhere.slug = serviceSlug;
    } else {
      if (subcategoryId) serviceWhere.subcategoryId = subcategoryId;
      if (categoryId) serviceWhere.categoryId = categoryId;
    }

    let allowedServiceSlugs = null;
    let allowedServiceIds = null;
    if (serviceSlug || categoryId || subcategoryId) {
      const matchingServices = await prisma.service.findMany({
        where: serviceWhere,
        select: { id: true, slug: true },
      });

      allowedServiceSlugs = matchingServices.map((service) => service.slug);
      allowedServiceIds = matchingServices.map((service) => service.id);

      if (allowedServiceSlugs.length === 0 && allowedServiceIds.length === 0) {
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
    }

    const andConditions = [];
    if (allowedServiceSlugs || allowedServiceIds) {
      const serviceClauses = [];
      if (allowedServiceSlugs?.length) {
        serviceClauses.push({ serviceSlug: { in: allowedServiceSlugs } });
      }
      if (allowedServiceIds?.length) {
        serviceClauses.push({ serviceId: { in: allowedServiceIds } });
      }
      if (serviceClauses.length) {
        andConditions.push({ OR: serviceClauses });
      }
    }

    if (search) {
      andConditions.push({
        OR: [
          { name: { contains: search } },
          { serviceSlug: { contains: search } },
          { tag: { contains: search } },
          { description: { contains: search } },
          { price: { contains: search } },
        ],
      });
    }

    const where = andConditions.length ? { AND: andConditions } : {};

    const [plans, total] = await Promise.all([
      prisma.purchasePlan.findMany({
        where,
        orderBy: [
          { createdAt: "desc" },
          { sortOrder: "asc" },
        ],
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.purchasePlan.count({ where }),
    ]);

    res.status(200).json({
      ok: true,
      data: plans,
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
      serviceSlug: slug,
      serviceId: serviceIdBySlug.get(slug) || null,
      name,
      description,
      price,
      oldPrice,
      tag,
      isHighlighted: isHighlighted === true || isHighlighted === "true",
      features: Array.isArray(features) ? features : [],
      sortOrder: Number(sortOrder) || 0,
    }));

    await prisma.purchasePlan.createMany({
      data: plansToCreate,
    });

    res.status(201).json({ ok: true, message: `${slugs.length} plan(s) created successfully` });
  } catch (error) {
    console.error("[CRITICAL] Error creating plan:", error);
    res.status(500).json({ ok: false, error: error.message || "Internal server error" });
  }
};

// Update a plan (Admin only)
export const updatePlan = async (req, res) => {
  const { id } = req.params;
  const updateData = { ...req.body };

  if (updateData.serviceSlug) {
    updateData.serviceSlug = normalizeSlug(updateData.serviceSlug);
  }

  try {
    const { features, sortOrder, isHighlighted, ...rest } = updateData;

    const finalData = { ...rest };
    if (features) finalData.features = Array.isArray(features) ? features : [];
    if (sortOrder !== undefined) finalData.sortOrder = Number(sortOrder);
    if (isHighlighted !== undefined) finalData.isHighlighted = isHighlighted === true || isHighlighted === "true";
    if (updateData.serviceSlug) {
      const service = await prisma.service.findUnique({
        where: { slug: updateData.serviceSlug },
        select: { id: true },
      });
      finalData.serviceId = service?.id || null;
    }

    const plan = await prisma.purchasePlan.update({
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
      prisma.purchasePlan.findUnique({
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

    const linkedService = plan.service || await prisma.service.findUnique({
      where: { slug: plan.serviceSlug },
      select: { id: true, name: true, slug: true },
    });
    const serviceName = linkedService?.name || plan.serviceSlug;
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
      serviceSlug: linkedService?.slug || plan.serviceSlug,
      adminNote: typeof note === "string" ? note.trim() : "",
    });

    const result = await prisma.$transaction(async (tx) => {
      const lead = await tx.lead.create({
        data: {
          fullName: user.name,
          email: user.email,
          phone: user.phone || "Not Provided",
          serviceName,
          sourcePageSlug: linkedService?.slug || plan.serviceSlug,
          source: "OTHER",
          formType: "REGISTRATION",
          status: "IN_PROGRESS",
          metadata,
          serviceId: plan.serviceId || linkedService?.id || null,
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
    await prisma.purchasePlan.delete({
      where: { id }
    });

    res.status(200).json({ ok: true, message: "Plan deleted successfully" });
  } catch (error) {
    console.error("[planController] Error deleting plan:", error);
    res.status(500).json({ ok: false, error: "Internal server error" });
  }
};
