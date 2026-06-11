import { prisma } from "./src/config/db.js";
async function check() {
  const registrations = await prisma.registrationLead.findMany({ select: { id: true, status: true } });
  console.log(registrations);
}
check();
