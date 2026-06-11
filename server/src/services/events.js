import { prisma } from "../config/db.js";
import { alertEventRegistration } from "./adminAlerts.js";

export async function fetchPublishedEvents() {
  return prisma.event.findMany({
    where: { status: { in: ["PUBLISHED", "UPCOMING", "PAST"] } },
    orderBy: { date: "asc" },
  });
}

export async function fetchEventBySlug(slug) {
  return prisma.event.findUnique({ where: { slug } });
}

export async function registerForEventService(eventId, data) {
  const registration = await prisma.eventRegistration.create({
    data: {
      eventId,
      name: data.name,
      email: data.email,
      phone: data.phone,
      city: data.city,
    }
  });

  // Send admin notification
  try {
    const event = await prisma.event.findUnique({ where: { id: eventId } });
    if (event) {
      await alertEventRegistration(event, data);
    }
  } catch (err) {
    console.error("Non-fatal: failed to send admin notification", err);
  }

  return registration;
}
