import "./config/env.js";
import { prisma } from "./config/db.js";

async function run() {
  const reminders = await prisma.message.findMany({
    where: {
      content: { contains: `REMINDER: Please upload your pending document: send docusment bro!!` }
    },
    orderBy: { createdAt: 'desc' }
  });
  console.log(`Found ${reminders.length} reminders!`);
  reminders.forEach(r => console.log(r.createdAt));
}
run().catch(console.error).finally(() => process.exit(0));
