import "dotenv/config";
import { prisma } from '../src/db.js';



async function main() {
  console.log('Checking Lead table for Lawyer related entries...');
  const leads = await prisma.lead.findMany({
    where: {
      OR: [
        { serviceName: { contains: 'Lawyer' } },
        { message: { contains: 'Lawyer' } },
        { pagePath: { contains: 'lawyer' } }
      ]
    },
    orderBy: { createdAt: 'desc' },
    take: 10
  });

  console.log(`Found ${leads.length} lawyer related leads in Lead table.`);
  leads.forEach(lead => {
    console.log(`- ID: ${lead.id}, Name: ${lead.fullName}, Phone: ${lead.phone}, Service: ${lead.serviceName}, Created: ${lead.createdAt}`);
  });

  console.log('\nChecking RegistrationLead table for Lawyer related entries...');
  const regLeads = await prisma.registrationLead.findMany({
    where: {
      OR: [
        { businessName: { contains: 'Lawyer' } },
        { message: { contains: 'Lawyer' } }
      ]
    },
    orderBy: { createdAt: 'desc' },
    take: 10
  });

  console.log(`Found ${regLeads.length} lawyer related leads in RegistrationLead table.`);
  regLeads.forEach(lead => {
    console.log(`- ID: ${lead.id}, Name: ${lead.fullName}, Phone: ${lead.phone}, Created: ${lead.createdAt}`);
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
