import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function test() {
  const REMINDER_INTERVAL_MS = 5 * 60 * 1000;
  const pendingDocRequests = await prisma.message.findMany({
    where: {estarting 'src/index.js'
◇ injected env (15) from .env // tip: ⌁ auth for agents [www.vestauth.com]
mysql/prisma connecting...
Failed to start server: Cannot read properties of undefined (reading 'bind')
Failed running 'src/index.js'. Waiting for file changes before restarting...





      isDocRequest: true,
      createdAt: {
        lte: new Date(Date.now() - REMINDER_INTERVAL_MS)
      }
    },
    include: { receiver: true }
  });
  console.log("Pending older than 5 mins:", pendingDocRequests.length);
  for (const r of pendingDocRequests) {
    const uploadedDoc = await prisma.userDocument.findFirst({
          where: {
            userId: r.receiverId,
            documentType: r.requestedDocName,
            ...(r.leadId ? { leadId: r.leadId } : {}),
            ...(r.registrationId ? { registrationId: r.registrationId } : {})
          }
        });
    console.log("Req ID:", r.id, "Requested:", r.requestedDocName, "Uploaded:", !!uploadedDoc);

    if (!uploadedDoc) {
      const recentReminder = await prisma.message.findFirst({
          where: {
            receiverId: r.receiverId,
            senderId: r.senderId,
            content: { contains: r.requestedDocName },
            isDocRequest: false,
            createdAt: {
              gte: new Date(Date.now() - REMINDER_INTERVAL_MS + 1000)
            }
          }
        });
      console.log("Recent reminder sent:", !!recentReminder);
    }
  }
}
test().catch(console.error).finally(() => prisma.$disconnect());
