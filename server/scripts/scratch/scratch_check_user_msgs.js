import "./config/env.js";
import { prisma } from "./config/db.js";

async function run() {
  const messages = await prisma.message.findMany({
    where: { content: { contains: "send docusment bro!!" } },
    orderBy: { createdAt: 'desc' }
  });
  console.log(`Found ${messages.length} messages.`);
  if (messages.length > 0) {
    console.log("Latest:", messages[0].createdAt, messages[0].receiverId);
    console.log("Oldest:", messages[messages.length-1].createdAt, messages[messages.length-1].receiverId);
  }
}
run().catch(console.error).finally(() => process.exit(0));
