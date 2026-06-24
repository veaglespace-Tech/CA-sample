import "dotenv/config";
import prismaClientPkg from "@prisma/client";
import { seedServicePlans } from "./seed_service_plans.js";
import { seedServiceCatalog } from "./seed_service_catalog.js";

const { PrismaClient } = prismaClientPkg;

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is missing. Add it to server/.env before seeding.");
}

const prisma = new PrismaClient();

async function main() {
  await seedServiceCatalog(prisma);

  await seedServicePlans(prisma, { logPrefix: "[seed.js]" });

  await prisma.siteSetting.upsert({
    where: { key: "site_contact" },
    update: {
      value: {
        phone: "+91 82379 99101",
        email: "info@veaglespace.com",
      },
    },
    create: {
      key: "site_contact",
      value: {
        phone: "+91 82379 99101",
        email: "info@veaglespace.com",
      },
    },
  });
}

main()
  .then(async () => {
    console.log("Database seeded");
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
