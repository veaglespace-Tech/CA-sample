import { prisma } from "../config/db.js";
import { normalizePhone, optionalString, requireString, slugify } from "../utils/core.js";
import { alertNewLead } from "./adminAlerts.js";

export async function resolveServiceId(serviceName, serviceSlug) {
  const slug = optionalString(serviceSlug) || slugify(serviceName);
  if (!slug) return null;

  const service = await prisma.service.findFirst({
    where: {
      OR: [
        { slug },
        { name: { equals: serviceName || "" } },
      ],
    },
    select: { id: true },
  });

  return service?.id || null;
}

export async function insertLead(data, meta, options) {
  const fullName = requireString(data, ["fullName", "name"], "Full name");
  const phone = normalizePhone(requireString(data, ["phone", "mobile", "mobileNumber"], "Phone"));
  const serviceName = optionalString(data.serviceName) || optionalString(data.service) || optionalString(data.serviceInterestedIn);
  const serviceId = await resolveServiceId(serviceName, data.serviceSlug);

  const lead = await prisma.lead.create({
    data: {
      fullName,
      phone,
      email: optionalString(data.email),
      city: optionalString(data.city) || optionalString(data.pincode),
      serviceName,
      businessName: optionalString(data.businessName),
      preferredTime: optionalString(data.preferredTime),
      message: optionalString(data.message),
      sourcePageSlug: optionalString(data.sourcePageSlug) || optionalString(data.slug),
      pagePath: optionalString(data.pagePath),
      source: options.source || "WEBSITE",
      formType: options.formType || "CONTACT",
      utmSource: optionalString(data.utmSource),
      utmMedium: optionalString(data.utmMedium),
      utmCampaign: optionalString(data.utmCampaign),
      ipAddress: meta.ipAddress,
      userAgent: meta.userAgent,
      metadata: data.metadata && typeof data.metadata === "object" ? JSON.stringify(data.metadata) : undefined,
      serviceId,
      userId: options.userId || undefined,
    },
    include: {
      service: { select: { name: true, slug: true } },
    },
  });

  if (data.metadata?.selectedPlanName === "Custom Plan") {
    try {
      await prisma.paymentRecord.create({
        data: {
          leadId: lead.id,
          userId: options.userId || undefined,
          serviceName: serviceName || "Custom Service Request",
          amount: "Custom Quote",
          status: "UNPAID (Custom Plan)",
          customerName: fullName,
          customerEmail: optionalString(data.email),
          customerPhone: phone,
        }
      });
    } catch (err) {
      console.error("Failed to create custom plan payment record:", err);
    }
  }

  // Send admin notification
  await alertNewLead(lead);

  return lead;
}

export async function fetchAllLeads() {
  return prisma.lead.findMany({
    orderBy: { createdAt: "desc" },
    take: 100,
    include: {
      service: { select: { name: true, slug: true } },
      assignedTo: { select: { id: true, name: true, email: true } },
    },
  });
}

export async function updateLeadStatus(id, status) {
  const allowedStatuses = ["NEW", "IN_PROGRESS", "QUALIFIED", "CONVERTED", "CLOSED", "REJECTED"];
  if (!allowedStatuses.includes(status)) throw new Error("Invalid status");
  return prisma.lead.update({
    where: { id },
    data: { status },
  });
}

export async function addLeadNote(id, userId, note) {
  console.log(`[addLeadNote] called for id: ${id}, userId: ${userId}, note: ${note}`);
  
  const lead = await prisma.lead.findUnique({ where: { id } });
  if (lead) {
    console.log(`[addLeadNote] Found in Lead table. Inserting with leadId: ${id}`);
    try {
      return await prisma.leadNote.create({
        data: {
          leadId: id,
          userId,
          note,
        },
        include: {
          user: { select: { name: true } },
        },
      });
    } catch (err) {
      console.error(`[addLeadNote] Error inserting for Lead:`, err);
      throw err;
    }
  }

  const reg = await prisma.registrationLead.findUnique({ where: { id } });
  if (reg) {
    console.log(`[addLeadNote] Found in RegistrationLead table. Inserting with registrationId: ${id}`);
    try {
      return await prisma.leadNote.create({
        data: {
          registrationId: id,
          userId,
          note,
        },
        include: {
          user: { select: { name: true } },
        },
      });
    } catch (err) {
      console.error(`[addLeadNote] Error inserting for RegistrationLead:`, err);
      throw err;
    }
  }

  throw new Error("Lead or Registration Lead not found");
}

export async function fetchUserServices(userId, email, phone) {
  const searchConditions = [
    { userId },
    email ? { email } : null,
    phone ? { phone: { contains: phone.slice(-10) } } : null,
  ].filter(Boolean);

  const [leads, registrations] = await Promise.all([
    prisma.lead.findMany({
      where: { OR: searchConditions },
      orderBy: { createdAt: "desc" },
      include: { service: { select: { name: true, slug: true } } },
    }),
    prisma.registrationLead.findMany({
      where: { OR: searchConditions },
      orderBy: { createdAt: "desc" },
      include: { 
        service: { select: { name: true, slug: true } },
        documents: true 
      },
    }),
  ]);

  return { leads, registrations };
}
