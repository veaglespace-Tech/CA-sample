import { prisma } from "../config/db.js";
import { alertContactQuery } from "./adminAlerts.js";

export async function insertContactQuery(data) {
  const { name, fullName, email, phone, message, subject, serviceName } = data;
  const query = await prisma.contactQuery.create({
    data: {
      name: name || fullName || "Anonymous",
      email: email || null,
      phone: phone || "0000000000",
      message: message || "No message",
      subject: subject || serviceName || "General Inquiry",
    },
  });
  
  // Send notification to admin
  await alertContactQuery(query);
  
  return query;
}

export async function fetchUnreadContacts() {
  return prisma.contactQuery.findMany({
    where: { isRead: false },
    orderBy: { createdAt: "desc" },
  });
}

export async function fetchAllContacts() {
  return prisma.contactQuery.findMany({
    orderBy: { createdAt: "desc" },
  });
}

export async function updateContactReadStatus(id, isRead = true) {
  return prisma.contactQuery.update({
    where: { id },
    data: { isRead },
  });
}

export async function updateContactStatus(id, status) {
  return prisma.contactQuery.update({
    where: { id },
    data: { status },
  });
}

export async function removeContact(id) {
  return prisma.contactQuery.delete({
    where: { id },
  });
}
