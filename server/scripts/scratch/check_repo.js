import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function check() {
  const docs = await prisma.adminRepositoryDocument.findMany();
  console.log("Admin Repository Documents:", JSON.stringify(docs, null, 2));
  process.exit(0);
}

check();
