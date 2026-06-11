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

async function seedEvent() {
  try {
    const event = await prisma.event.upsert({
      where: { slug: 'startup-legal-masterclass' },
      update: {},
      create: {
        title: 'Startup Legal Masterclass 2026',
        slug: 'startup-legal-masterclass',
        description: 'Join our legal experts for an exclusive session on business registration, IP protection, and compliance for early-stage startups.',
        date: new Date('2026-06-15T11:00:00Z'),
        time: '11:00 AM - 1:00 PM IST',
        location: 'Online (Zoom)',
        imageUrl: 'https://images.unsplash.com/photo-1591115765373-520b7a1f7bb6?q=80&w=1000',
        regLink: 'https://example.com/register-event',
        speakers: [
          { name: 'Adv. Rajesh Kumar', role: 'IP Specialist', imageUrl: 'https://i.pravatar.cc/150?u=rajesh' },
          { name: 'Priya Sharma', role: 'Compliance Expert', imageUrl: 'https://i.pravatar.cc/150?u=priya' }
        ],
        status: 'PUBLISHED',
      },
    });
    console.log('SUCCESS: Demo event created:', event.title);
  } catch (error) {
    console.error('ERROR seeding event:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

seedEvent();
