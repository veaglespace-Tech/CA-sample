import "dotenv/config";
import { prisma } from "./src/config/db.js";

async function main() {
  try {
    const events = await prisma.event.findMany();
    console.log("Current Database Events:", JSON.stringify(events, null, 2));
  } catch (err) {
    console.error("Database query failed:", err);
  } finally {
    await prisma.$disconnect();
  }
}

main();
