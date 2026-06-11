import "dotenv/config";
import { prisma } from "./src/config/db.js";

async function check() {
  const users = await prisma.user.findMany({ select: { id: true, email: true } });
  console.log("Users:", users);

  const payments = await prisma.paymentRecord.findMany({ select: { customerEmail: true, user: true, userId: true } });
  console.log("Payments:", payments.slice(0, 3));
}
check().catch(console.error).finally(() => prisma.$disconnect());
