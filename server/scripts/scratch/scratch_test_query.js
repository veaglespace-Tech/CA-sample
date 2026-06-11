import "./src/config/env.js";
import { prisma } from "./src/config/db.js";

async function run() {
  console.log("Testing queryRaw...");
  const res = await prisma.$queryRaw`SELECT 1`;
  console.log("queryRaw succeeded:", res);

  console.log("Testing findMany...");
  const msg = await prisma.message.findFirst();
  console.log("findMany succeeded:", msg?.id);
}
run().catch(console.error).finally(() => process.exit(0));
