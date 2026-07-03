import "./config/env.js";
import { prisma } from "./config/db.js";

async function run() {
  const msgs = await prisma.message.findMany({
    where: { content: { contains: "send docusment bro!!" } },
    orderBy: { createdAt: 'desc' }
  });
  console.log("Last 5 messages:");
  msgs.slice(0, 5).forEach(m => console.log(m.createdAt.toISOString()));
}
run().catch(console.error).finally(() => process.exit(0));
