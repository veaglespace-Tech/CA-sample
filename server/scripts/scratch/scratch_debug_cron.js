import "./src/config/env.js";
import { prisma } from "./src/config/db.js";

// Helper to get current time in IST (UTC + 5:30) for database storage
function getISTDate() {
  const IST_OFFSET = 5.5 * 60 * 60 * 1000;
  return new Date(Date.now() + IST_OFFSET);
}

async function run() {
  const envVal = parseInt(process.env.DOCUMENT_REMINDER_INTERVAL_MINUTES, 10);
  const intervalMinutes = isNaN(envVal) ? 5 : envVal;
  const REMINDER_INTERVAL_MS = intervalMinutes * 60 * 1000;
  
  console.log(`Interval minutes: ${intervalMinutes}, MS: ${REMINDER_INTERVAL_MS}`);
  const cutoffTime = new Date(getISTDate().getTime() - REMINDER_INTERVAL_MS);
  console.log("Current IST time:", getISTDate());
  console.log("Looking for messages older than:", cutoffTime);

  const pendingDocRequests = await prisma.message.findMany({
    where: {
      isDocRequest: true,
      createdAt: {
        lte: cutoffTime
      }
    },
    include: {
      receiver: true
    }
  });

  console.log(`Found ${pendingDocRequests.length} pending document requests older than ${intervalMinutes} minutes.`);

  for (const request of pendingDocRequests) {
    console.log(`\nEvaluating request ID ${request.id} for doc "${request.requestedDocName}"...`);
    
    const uploadedDoc = await prisma.userDocument.findFirst({
      where: {
        userId: request.receiverId,
        documentType: request.requestedDocName,
        ...(request.leadId ? { leadId: request.leadId } : {}),
        ...(request.registrationId ? { registrationId: request.registrationId } : {})
      }
    });

    if (uploadedDoc) {
      console.log(`  -> SKIP: Document already uploaded (ID: ${uploadedDoc.id})`);
      continue;
    }
    
    const recentReminderTime = new Date(getISTDate().getTime() - REMINDER_INTERVAL_MS + 1000);
    console.log(`  -> Checking for reminders sent after: ${recentReminderTime}`);
    const recentReminder = await prisma.message.findFirst({
      where: {
        receiverId: request.receiverId,
        senderId: request.senderId,
        content: { contains: `REMINDER: Please upload your pending document: ${request.requestedDocName}` },
        createdAt: {
          gte: recentReminderTime
        }
      }
    });

    if (recentReminder) {
      console.log(`  -> SKIP: Recent reminder already sent (ID: ${recentReminder.id}) at ${recentReminder.createdAt}`);
      continue;
    }

    console.log(`  -> WOULD SEND REMINDER!`);
  }
}

run().catch(console.error).finally(() => process.exit(0));
