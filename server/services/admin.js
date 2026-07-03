import { prisma } from "../config/db.js";
import * as usersModule from "./users.js";
import * as leadsModule from "./leads.js";
import * as regsModule from "./registrations.js";
import * as eventsModule from "./events.js";

/**
 * Aggregates all platform data for the admin dashboard.
 */
export async function fetchAllPlatformData(actor) {
  const [users, leads, registrations, referrals, referrers, referralRewardSettings, events, services, serviceCategories, paymentRecords] = await Promise.all([
    usersModule.fetchAllUsers(actor),
    prisma.lead.findMany({ 
      orderBy: { createdAt: "desc" },
      include: { 
        notes: { include: { user: { select: { name: true } } }, orderBy: { createdAt: "desc" } },
        documents: true,
        messages: { where: { isDocRequest: true }, orderBy: { createdAt: "desc" } },
        user: { select: { id: true, name: true, email: true, documents: true } },
        service: { include: { category: true } }
      }
    }),
    prisma.registrationLead.findMany({ 
      orderBy: { createdAt: "desc" },
      include: { 
        notes: { include: { user: { select: { name: true } } }, orderBy: { createdAt: "desc" } },
        documents: true,
        messages: { where: { isDocRequest: true }, orderBy: { createdAt: "desc" } },
        user: { select: { id: true, name: true, email: true, documents: true } },
        service: { include: { category: true } }
      }
    }),
    prisma.referral.findMany({ orderBy: { createdAt: "desc" } }),
    prisma.referrer.findMany({ orderBy: { totalReferred: "desc" }, include: { referrals: true } }),
    prisma.referralRewardSetting.findMany({ orderBy: [{ isActive: "desc" }, { updatedAt: "desc" }] }),
    prisma.event.findMany({ 
      orderBy: { date: "desc" },
      include: { registrations: { orderBy: { createdAt: "desc" } } }
    }),
    prisma.service.findMany({
      include: { category: { select: { name: true } } },
      orderBy: { name: "asc" }
    }),
    prisma.serviceCategory.findMany({
      include: { 
        subcategories: {
          include: { services: { orderBy: { name: "asc" } } },
          orderBy: { sortOrder: "asc" }
        },
        services: { where: { subcategoryId: null }, orderBy: { name: "asc" } }
      },
      orderBy: { sortOrder: "asc" }
    }),
    prisma.paymentRecord.findMany({
      include: { 
        user: { select: { name: true, email: true, phone: true } },
        lead: { select: { metadata: true } },
        registrationLead: { select: { metadata: true } }
      },
      orderBy: { createdAt: "desc" }
    })
  ]);

  // Auto-link users by email for leads/registrations where userId is missing
  const userMap = new Map(users.map(u => [u.email?.toLowerCase().trim(), u]));
  
  const enrich = (item) => {
    const emailToMatch = (item.email || item.customerEmail)?.toLowerCase().trim();
    if (!item.user && emailToMatch) {
      const matchedUser = userMap.get(emailToMatch);
      if (matchedUser) return { ...item, user: matchedUser, userId: matchedUser.id };
    }
    return item;
  };

  return { 
    users, 
    leads: leads.map(enrich), 
    registrations: registrations.map(enrich), 
    referrals, 
    referrers,
    referralRewardSettings,
    events, 
    services,
    serviceCategories,
    paymentRecords: paymentRecords.map(enrich)
  };
}

// Re-export user management functions
export const insertUser = usersModule.insertUser;
export const modifyUser = usersModule.modifyUser;
export const removeUser = usersModule.removeUser;
export const findUsers = usersModule.findUsers;

// Event management
export async function insertEvent(data) {
  return prisma.event.create({
    data: { ...data, date: new Date(data.date) },
  });
}

export async function modifyEvent(id, data) {
  return prisma.event.update({
    where: { id },
    data: { ...data, date: data.date ? new Date(data.date) : undefined },
  });
}

export async function removeEvent(id) {
  return prisma.event.delete({ where: { id } });
}

/**
 * Unified search for leads and registrations.
 */
export async function findLeads(query, actor) {
  const upperQuery = query.toUpperCase();
  const regTypes = ["COMPANY_REGISTRATION", "GST_REGISTRATION", "TRADEMARK_REGISTRATION", "FSSAI_REGISTRATION", "MSME_REGISTRATION", "LLP_REGISTRATION", "OTHER"];
  const matchingRegTypes = regTypes.filter(t => t.includes(upperQuery.replace(" ", "_")));

  const [leads, registrations, users] = await Promise.all([
    prisma.lead.findMany({
      where: {
        OR: [
          { fullName: { contains: query } },
          { email: { contains: query } },
          { serviceName: { contains: query } }
        ]
      },
      include: { 
        notes: { include: { user: { select: { name: true } } }, orderBy: { createdAt: "desc" } },
        documents: true,
        messages: { where: { isDocRequest: true }, orderBy: { createdAt: "desc" } },
        user: { select: { id: true, name: true, email: true, documents: true } },
        service: { include: { category: true } }
      },
      take: 50
    }),
    prisma.registrationLead.findMany({
      where: {
        OR: [
          { fullName: { contains: query } },
          { email: { contains: query } },
          { businessName: { contains: query } },
          { registrationType: { in: matchingRegTypes } }
        ]
      },
      include: { 
        notes: { include: { user: { select: { name: true } } }, orderBy: { createdAt: "desc" } },
        documents: true,
        messages: { where: { isDocRequest: true }, orderBy: { createdAt: "desc" } },
        user: { select: { id: true, name: true, email: true, documents: true } },
        service: { include: { category: true } }
      },
      take: 50
    }),
    usersModule.findUsers(query, actor)
  ]);

  const userMap = new Map(users.map(u => [u.email, u]));
  const enrich = (item) => {
    if (!item.user && item.email) {
      const matchedUser = userMap.get(item.email);
      if (matchedUser) return { ...item, user: matchedUser, userId: matchedUser.id };
    }
    return item;
  };

  return { 
    leads: leads.map(enrich), 
    registrations: registrations.map(enrich) 
  };
}

export async function verifyUserDocument(id, status, reason, adminId) {
  const document = await prisma.userDocument.findUnique({
    where: { id },
    include: { user: true }
  });

  if (!document) {
    throw new Error("Document record not found");
  }

  const updated = await prisma.userDocument.update({
    where: { id },
    data: { 
      status: status || "VERIFIED",
      updatedAt: new Date()
    }
  });

  if (status === "REJECTED" && adminId && document.userId) {
    await prisma.message.create({
      data: {
        senderId: adminId,
        receiverId: document.userId,
        content: `Your document "${document.fileName}" (${document.documentType}) was not accepted. Reason: ${reason || "Incorrect file or low quality"}. Please re-upload it.`,
        isDocRequest: true,
        requestedDocName: document.documentType,
        registrationId: document.registrationId,
        leadId: document.leadId,
      }
    });
  }

  return updated;
}
