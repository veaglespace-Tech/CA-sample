import "dotenv/config";
import { prisma } from "../src/db.js";

async function listServices() {
  const services = await prisma.service.findMany({
    select: { name: true, slug: true }
  });
  console.log(`Total services: ${services.length}`);
  console.log(JSON.stringify(services, null, 2));
}

listServices()
  .finally(async () => {
    await prisma.$disconnect();
  });
