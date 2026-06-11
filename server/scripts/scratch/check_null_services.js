import "dotenv/config";
import { prisma } from "../src/db.js";

async function checkFailedResolutions() {
  console.log("Checking for leads where serviceId could not be resolved...");

  const leadsWithNullService = await prisma.lead.findMany({
    where: { serviceId: null },
    orderBy: { createdAt: 'desc' },
    take: 20
  });

  console.log(`Found ${leadsWithNullService.length} leads with null serviceId.`);
  leadsWithNullService.forEach(lead => {
    console.log(`- ID: ${lead.id}, Name: ${lead.fullName}, Provided Service Name: ${lead.serviceName}, Created: ${lead.createdAt}`);
  });
}

checkFailedResolutions()
  .finally(async () => {
    await prisma.$disconnect();
  });
