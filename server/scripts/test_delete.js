import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";

dotenv.config();

const prisma = new PrismaClient();

async function run() {
  const secret = process.env.JWT_SECRET;
  
  const user = await prisma.user.findUnique({ where: { email: "shyamsingare67@gmail.com" } });
  if (!user) {
    console.log("User not found");
    return;
  }
  
  const token = jwt.sign({ sub: user.id, role: user.role, email: user.email }, secret, { expiresIn: "1h" });
  
  // Now let's try to fetch all data to get a registration ID
  const headers = { "Authorization": `Bearer ${token}` };
  
  const res = await fetch("http://localhost:5003/api/admin/all-data", { headers });
  const data = await res.json();
  
  const registrations = data.data?.registrations || [];
  if (registrations.length === 0) {
    console.log("No registrations found");
    return;
  }
  
  console.log("Found registrations:", registrations.length);
  const targetId = registrations[0].id;
  
  console.log("Trying to delete registration:", targetId);
  const delRes = await fetch(`http://localhost:5003/api/admin/registrations/${targetId}`, {
    method: "DELETE",
    headers
  });
  
  const delData = await delRes.json();
  console.log("Delete response status:", delRes.status);
  console.log("Delete response data:", delData);
}

run().catch(console.error).finally(() => prisma.$disconnect());
