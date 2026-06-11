const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log("Checking all leads in database...");
  const leads = await prisma.lead.findMany({
    take: 10,
    orderBy: { createdAt: 'desc' }
  });
  console.log("LEADS FOUND:", leads.length);
  leads.forEach(l => {
    console.log(`ID: ${l.id}, Name: ${l.fullName}, Email: ${l.email}, Phone: ${l.phone}, Status: ${l.status}`);
  });

  const regs = await prisma.registrationLead.findMany({
    take: 10,
    orderBy: { createdAt: 'desc' }
  });
  console.log("REGISTRATIONS FOUND:", regs.length);
  regs.forEach(r => {
    console.log(`ID: ${r.id}, Name: ${r.fullName}, Email: ${r.email}, Phone: ${r.phone}, Status: ${r.status}`);
  });
}

main().catch(console.error).finally(() => prisma.$disconnect());
