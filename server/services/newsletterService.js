import { prisma } from "../config/db.js";

export async function insertSubscriber(email) {
  if (!email) {
    throw new Error("Email is required");
  }
  // Try to find if it already exists, if so return it or handle gracefully
  const existing = await prisma.newsletterSubscriber.findUnique({
    where: { email },
  });
  if (existing) {
    return existing;
  }
  return prisma.newsletterSubscriber.create({
    data: { email },
  });
}

export async function fetchAllSubscribers() {
  return prisma.newsletterSubscriber.findMany({
    orderBy: { createdAt: "desc" },
  });
}
