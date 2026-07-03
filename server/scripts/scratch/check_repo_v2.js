import { prisma } from "../db.js";

async function check() {
  try {
    const docs = await prisma.adminRepositoryDocument.findMany();
    console.log("Admin Repository Documents:", JSON.stringify(docs, null, 2));
  } catch (err) {
    console.error("Error checking repo:", err);
  } finally {
    process.exit(0);
  }
}

check();
