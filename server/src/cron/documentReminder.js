import { prisma } from "../config/db.js";

import "../config/env.js";

// Read from .env, default to 5 minutes if not set
const getIntervalMinutes = () => {
  const envVal = parseInt(process.env.DOCUMENT_REMINDER_INTERVAL_MINUTES, 10);
  return isNaN(envVal) ? 5 : envVal;
};

function getISTDate() {
  return new Date();
}

export function startDocumentReminders() {
  const intervalMinutes = getIntervalMinutes();
  const REMINDER_INTERVAL_MS = intervalMinutes * 60 * 1000;
  
  console.log(`Document Reminder Service started... checking every ${intervalMinutes} minutes.`);
  
  const runReminders = async () => {
    try {
      // Find all messages that are document requests, are not read, and were created between 5 mins ago and 30 days ago
      const thirtyDaysAgo = new Date(getISTDate().getTime() - 30 * 24 * 60 * 60 * 1000);
      const pendingDocRequests = await prisma.message.findMany({
        where: {
          isDocRequest: true,
          createdAt: {
            gte: thirtyDaysAgo,
            lte: new Date(getISTDate().getTime() - REMINDER_INTERVAL_MS)
          }
        },
        include: {
          receiver: true
        }
      });

      if (pendingDocRequests.length === 0) return;

      for (const request of pendingDocRequests) {
        // Ensure requestedDocName is valid to prevent Prisma null argument errors
        if (!request.requestedDocName) {
          continue;
        }

        try {
          // 1. Check if the document was actually uploaded by the user
          const uploadedDoc = await prisma.userDocument.findFirst({
            where: {
              userId: request.receiverId,
              documentType: request.requestedDocName,
              ...(request.leadId ? { leadId: request.leadId } : {}),
              ...(request.registrationId ? { registrationId: request.registrationId } : {})
            }
          });

          // If the document has already been uploaded, we don't need to remind them.
          if (uploadedDoc) {
            // Performance enhancement: Mark as fulfilled so we don't keep checking it every 5 minutes
            await prisma.message.update({
              where: { id: request.id },
              data: { isDocRequest: false }
            });
            continue;
          }

          // 2. Check if we already sent a reminder for this document in the last 5 minutes
          const recentReminder = await prisma.message.findFirst({
            where: {
              receiverId: request.receiverId,
              senderId: request.senderId,
              content: { contains: `REMINDER: Please upload your pending document: ${request.requestedDocName}` },
              createdAt: {
                gte: new Date(Date.now() - REMINDER_INTERVAL_MS - 120000) // Added 2 minute buffer to ensure we catch slightly delayed cron executions
              }
            }
          });

          // If we recently sent a reminder, skip to avoid spam
          if (recentReminder) continue;

          // 3. Send a new platform Message as a reminder
          await prisma.message.create({
            data: {
              senderId: request.senderId,
              receiverId: request.receiverId,
              content: `⏳ REMINDER: Please upload your pending document: ${request.requestedDocName}. It is required to proceed with your service.`,
              registrationId: request.registrationId,
              leadId: request.leadId,
              isDocRequest: false // Not a new request, just a text reminder
            }
          });

          console.log(`[SYSTEM] Sent document reminder to ${request.receiver?.email || request.receiverId} for ${request.requestedDocName}`);
        } catch (innerError) {
          console.error(`Error processing document reminder for request ${request.id}:`, innerError);
        }
      }
    } catch (error) {
      console.error("Error in document reminder cron:", error);
    }
  };

  // Run immediately on startup
  runReminders();

  // Then schedule to run every interval
  setInterval(runReminders, REMINDER_INTERVAL_MS);
}
