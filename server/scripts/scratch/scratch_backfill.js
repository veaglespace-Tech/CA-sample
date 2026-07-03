import "dotenv/config";
import { prisma } from "./config/db.js";

async function backfill() {
  const convertedLeads = await prisma.lead.findMany({
    where: { status: "CONVERTED" },
    include: { service: true, user: true }
  });
  console.log("Converted Leads:", convertedLeads.length);

  const convertedRegs = await prisma.registrationLead.findMany({
    where: { status: "CONVERTED" },
    include: { service: true, user: true }
  });
  console.log("Converted Regs:", convertedRegs.length);

  for (const lead of convertedLeads) {
    const existing = await prisma.paymentRecord.findFirst({ where: { leadId: lead.id } });
    if (!existing) {
      const data = {
        customerName: lead.user?.name || lead.fullName,
        customerEmail: lead.user?.email || lead.email,
        customerPhone: lead.user?.phone || lead.phone,
        serviceName: lead.service?.name || lead.serviceName || "Professional Service",
        amount: "1769.00",
        createdAt: lead.updatedAt,
        lead: { connect: { id: lead.id } }
      };
      if (lead.userId) data.user = { connect: { id: lead.userId } };

      await prisma.paymentRecord.create({ data });
    }
  }

  for (const lead of convertedRegs) {
    const existing = await prisma.paymentRecord.findFirst({ where: { registrationId: lead.id } });
    if (!existing) {
      const data = {
        customerName: lead.user?.name || lead.fullName,
        customerEmail: lead.user?.email || lead.email,
        customerPhone: lead.user?.phone || lead.phone,
        serviceName: lead.service?.name || "Professional Service",
        amount: "1769.00",
        createdAt: lead.updatedAt,
        registrationLead: { connect: { id: lead.id } }
      };
      if (lead.userId) data.user = { connect: { id: lead.userId } };

      await prisma.paymentRecord.create({ data });
    }
  }
  console.log("Backfill complete");
}

backfill().catch(console.error).finally(() => prisma.$disconnect());
