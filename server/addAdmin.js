import "./src/config/env.js";
import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function addSuperAdmin() {
  try {
    const email = "veaglespaceritesh@gmail.com";
    const plainPassword = "Veagle@123";
    const name = "Ritesh";

    const passwordHash = await bcrypt.hash(plainPassword, 10);

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      await prisma.user.update({
        where: { email },
        data: {
          passwordHash,
          role: "SUPER_ADMIN",
          name,
        },
      });
      console.log(`Updated existing user ${email} to SUPER_ADMIN.`);
    } else {
      await prisma.user.create({
        data: {
          email,
          passwordHash,
          role: "SUPER_ADMIN",
          name,
          phone: "9999999999", // Providing a dummy phone if required
        },
      });
      console.log(`Created new SUPER_ADMIN user: ${email}`);
    }
  } catch (error) {
    console.error("Error adding admin:", error);
  } finally {
    await prisma.$disconnect();
  }
}

addSuperAdmin();
