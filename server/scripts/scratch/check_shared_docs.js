import { prisma } from "../src/db.js";

async function check() {
  try {
    const docs = await prisma.userDocument.findMany({
      where: { documentType: "ADMIN_UPLOAD" },
      orderBy: { createdAt: "desc" },
      take: 5
    });
    console.log("Recent Admin Uploads to Users:", JSON.stringify(docs, null, 2));
  } catch (err) {
    console.error("Error checking docs:", err);
  } finally {
    process.exit(0);
  }
}

check();
