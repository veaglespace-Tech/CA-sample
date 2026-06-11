import "dotenv/config";
import { prisma } from "../src/db.js";

async function test() {
  try {
    console.log("Testing users fetch...");
    const users = await prisma.user.findMany({
      select: { id: true, name: true, email: true, role: true, createdAt: true, documents: true },
    });
    console.log("Users fetched:", users.length);

    console.log("Testing leads fetch...");
    const leads = await prisma.lead.findMany({
      include: { 
        notes: { include: { user: { select: { name: true } } } },
        documents: true,
        user: { select: { id: true, name: true, email: true, documents: true } }
      }
    });
    console.log("Leads fetched:", leads.length);
  } catch (err) {
    console.error("Prisma Fetch Error:", err);
  } finally {
    await prisma.$disconnect();
  }
}

test();
