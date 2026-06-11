import 'dotenv/config';
import { prisma } from './src/db.js';

async function main() {
  console.log("Checking all leads in database...");
  try {
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
  } catch (err) {
    console.error("Query Error:", err.message);
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
