import "dotenv/config";
import { prisma } from "./config/db.js";

async function check() {
  const user = await prisma.user.findUnique({ where: { email: "superadmin@caproject.com" } });
  console.log("Admin User:", user);
}
check().catch(console.error).finally(() => prisma.$disconnect());
