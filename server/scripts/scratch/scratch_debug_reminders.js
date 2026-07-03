import "./config/env.js";
import { prisma } from "./config/db.js";

function getISTDate() {
  const IST_OFFSET = 5.5 * 60 * 60 * 1000;
  return new Date(Date.now() + IST_OFFSET);
}

async function run() {
  const REMINDER_INTERVAL_MS = 60 * 1000;
  
  const pendingDocRequests = await prisma.message.findMany({
    where: {
      isDocRequest: true,
      createdAt: {
        lte: new Date(getISTDate().getTime() - REMINDER_INTERVAL_MS)
      }
    },
    include: { receiver: true }
  });

  console.log(`Found ${pendingDocRequests.length} pending document requests.`);

  for (const request of pendingDocRequests) {
    if (request.requestedDocName !== "send docusment bro!!") continue;
    console.log(`\nEvaluating request ID ${request.id} for doc "${request.requestedDocName}"...`);
    
    const uploadedDoc = await prisma.userDocument.findFirst({
      where: {
        userId: request.receiverId,
        documentType: request.requestedDocName,
      }
    });

    if (uploadedDoc) {
      console.log(`  -> SKIP: Document already uploaded`);
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
      },
      orderBy: { createdAt: 'desc' }
    });

    if (recentReminder) {
      console.log(`  -> SKIP: Recent reminder already sent at ${recentReminder.createdAt}`);
      continue;
    }

    console.log(`  -> WOULD SEND REMINDER!`);
  }
}

run().catch(console.error).finally(() => process.exit(0));
