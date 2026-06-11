import { PrismaClient } from "@prisma/client";
import fs from "fs";

const prisma = new PrismaClient();

async function exportPlans() {
  const plans = await prisma.purchasePlan.findMany();
  
  const seedScript = `
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const plans = ${JSON.stringify(plans, null, 2)};

async function seedPlans() {
  console.log("Seeding Purchase Plans...");
  for (const plan of plans) {
    // Remove the original ID so a new one is generated on the VPS
    const { id, ...planData } = plan; 
    
    await prisma.purchasePlan.upsert({
      where: { id: plan.id }, // We can't easily upsert without a unique field besides ID
      update: {},
      create: planData
    }).catch(async (e) => {
        // If upsert fails because of no unique constraint, just create
        await prisma.purchasePlan.create({ data: planData });
    });
  }
  console.log("Plans successfully seeded!");
  await prisma.$disconnect();
}

seedPlans().catch(e => {
  console.error(e);
  prisma.$disconnect();
  process.exit(1);
});
  `;
  
  fs.writeFileSync("seed_plans.js", seedScript);
  console.log("Exported plans to seed_plans.js");
}

exportPlans().catch(e => {
  console.error(e);
}).finally(() => {
  prisma.$disconnect();
});
