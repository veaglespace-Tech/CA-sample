import { prisma } from "../config/db.js";

export async function fetchDashboardSummary() {
  const [
    totalLeadsCount,
    totalRegistrationsCount,
    
    newLeadsCount,
    newRegistrationsCount,
    
    convertedLeadsCount,
    convertedRegistrationsCount,
    
    inProgressLeadsCount,
    inProgressRegistrationsCount,
    
    totalServices,
    totalSearches,
    totalReferrals,
    
    totalContactsCount,
    unreadContactsCount,
    
    leadsList,
    registrationsList,
    contactsList,
  ] = await Promise.all([
    prisma.lead.count(),
    prisma.registrationLead.count(),
    
    prisma.lead.count({ where: { status: "NEW" } }),
    prisma.registrationLead.count({ where: { status: "NEW" } }),
    
    prisma.lead.count({ where: { status: "CONVERTED" } }),
    prisma.registrationLead.count({ where: { status: "CONVERTED" } }),
    
    prisma.lead.count({ where: { status: { in: ["IN_PROGRESS", "QUALIFIED"] } } }),
    prisma.registrationLead.count({ where: { status: { in: ["IN_PROGRESS", "QUALIFIED"] } } }),
    
    prisma.service.count({ where: { isActive: true } }),
    prisma.searchQuery.count(),
    prisma.referral.count(),
    
    prisma.contactQuery.count(),
    prisma.contactQuery.count({ where: { isRead: false } }),
    
    prisma.lead.findMany({
      orderBy: { createdAt: "desc" },
      take: 10,
      select: {
        id: true,
        fullName: true,
        phone: true,
        serviceName: true,
        formType: true,
        status: true,
        createdAt: true,
      },
    }),
    prisma.registrationLead.findMany({
      orderBy: { createdAt: "desc" },
      take: 10,
      select: {
        id: true,
        fullName: true,
        phone: true,
        businessName: true,
        registrationType: true,
        status: true,
        createdAt: true,
      },
    }),
    prisma.contactQuery.findMany({
      orderBy: { createdAt: "desc" },
      take: 10,
      select: {
        id: true,
        name: true,
        phone: true,
        email: true,
        subject: true,
        isRead: true,
        createdAt: true,
      },
    }),
  ]);

  const latestLeads = [
    ...leadsList.map(l => ({ ...l, type: "lead" })),
    ...registrationsList.map(r => ({
      ...r,
      type: "registration",
      serviceName: r.businessName ? `${r.registrationType.replace(/_/g, " ")} (${r.businessName})` : r.registrationType.replace(/_/g, " "),
      formType: "REGISTRATION",
    })),
    ...contactsList.map(c => ({
      id: c.id,
      fullName: c.name,
      phone: c.phone,
      serviceName: c.subject || "General Inquiry",
      formType: "CONTACT",
      status: c.isRead ? "CONVERTED" : "NEW",
      createdAt: c.createdAt,
      type: "contact",
    })),
  ]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 15);

  return {
    totalLeads: totalLeadsCount + totalRegistrationsCount + totalContactsCount,
    newLeads: newLeadsCount + newRegistrationsCount + unreadContactsCount,
    convertedLeads: convertedLeadsCount + convertedRegistrationsCount + (totalContactsCount - unreadContactsCount),
    inProgressLeads: inProgressLeadsCount + inProgressRegistrationsCount,
    serviceFilings: totalRegistrationsCount + leadsList.filter(l => l.formType === "REGISTRATION").length,
    totalServices,
    totalSearches,
    totalReferrals,
    latestLeads,
    totalContacts: totalContactsCount,
  };
}
