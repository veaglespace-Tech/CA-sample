import "./src/config/env.js";
import { prisma } from "./src/config/db.js";

async function run() {
  const currentUTC = new Date();
  
  // Find messages in the future
  const futureMessages = await prisma.message.findMany({
    where: {
      createdAt: {
        gt: currentUTC
      }
    }
  });

  console.log(`Found ${futureMessages.length} messages in the future. Fixing...`);

  let count = 0;
  for (const msg of futureMessages) {
    const fixedDate = new Date(msg.createdAt.getTime() - (5.5 * 60 * 60 * 1000));
    await prisma.$executeRaw`UPDATE Message SET createdAt = ${fixedDate} WHERE id = ${msg.id}`;
    count++;
  }

  console.log(`Fixed ${count} messages.`);
}
run().catch(console.error).finally(() => process.exit(0));
