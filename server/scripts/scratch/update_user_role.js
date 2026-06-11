import pkg from "@prisma/client";
const { PrismaClient } = pkg;
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import dotenv from 'dotenv';
dotenv.config();

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL is missing.");
}

const adapter = new PrismaMariaDb(connectionString);
const prisma = new PrismaClient({ adapter });

async function updateRole() {
  try {
    const user = await prisma.user.update({
      where: { id: 'cmotqfhmx0000bqq6gcnzgo8i' },
      data: { role: 'ADMIN' },
    });
    console.log('SUCCESS: User role updated to ADMIN');
    console.log(`ID: ${user.id}, Name: ${user.name}, Email: ${user.email}, New Role: ${user.role}`);
  } catch (error) {
    console.error('ERROR updating user role:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

updateRole();
