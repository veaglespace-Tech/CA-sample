import "dotenv/config";
import prismaClientPkg from "@prisma/client";
import { seedServicePlans } from "./seed_service_plans.js";

const { PrismaClient } = prismaClientPkg;

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is missing. Add it to server/.env before seeding.");
}

const prisma = new PrismaClient();

async function main() {
  console.log("Starting service-wise plan reseed...");
  await seedServicePlans(prisma, { logPrefix: "[seed_pricing_plans]" });
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
