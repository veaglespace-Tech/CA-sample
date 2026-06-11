import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const plans = await prisma.purchasePlan.findMany();
  console.log('--- Purchase Plans ---');
  console.log(JSON.stringify(plans, null, 2));

  const services = await prisma.service.findMany({
    select: { id: true, name: true, slug: true }
  });
  console.log('--- Services ---');
  console.log(JSON.stringify(services, null, 2));
}

main()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
