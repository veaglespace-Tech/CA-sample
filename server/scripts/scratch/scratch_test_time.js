import "./src/config/env.js";
import { prisma } from "./src/config/db.js";

async function run() {
  const user = await prisma.user.findFirst();
  const d = new Date();
  console.log("Current Node Date (UTC):", d.toISOString());
  
  const newMsg = await prisma.message.create({
    data: {
      senderId: user.id,
      receiverId: user.id,
      content: "TEST TIME MSG",
      isDocRequest: false
    }
  });

  console.log("Saved to DB as:", newMsg.createdAt);
  console.log("DB Date ISO:", newMsg.createdAt.toISOString());
}
run().catch(console.error).finally(() => process.exit(0));
