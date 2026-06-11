import "./src/config/env.js";
import { prisma } from "./src/config/db.js";

async function run() {
  const msg = await prisma.message.findFirst({
    where: { content: { contains: "send docusment bro!!" } },
    orderBy: { createdAt: 'desc' }
  });
  console.log("Latest msg in DB:", msg.createdAt.toISOString());
}
run().catch(console.error).finally(() => process.exit(0));
