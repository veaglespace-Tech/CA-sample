import { prisma } from "../config/db.js";
import "../config/env.js";

import fs from "fs";
import path from "path";
import dotenv from "dotenv";

// Retrieve retention hours dynamically from .env to allow changes without restarting server
const getRetentionHours = () => {
  try {
    const envPath = path.resolve(process.cwd(), ".env");
    if (fs.existsSync(envPath)) {
      const parsed = dotenv.parse(fs.readFileSync(envPath, "utf8"));
      if (parsed.ADMIN_MESSAGE_RETENTION_HOURS) {
        const envVal = parseInt(parsed.ADMIN_MESSAGE_RETENTION_HOURS, 10);
        return isNaN(envVal) ? 0 : envVal;
      }
    }
  } catch (err) {
    // ignore parsing errors and fallback to process.env
  }
  const envVal = parseInt(process.env.ADMIN_MESSAGE_RETENTION_HOURS, 10);
  return isNaN(envVal) ? 0 : envVal;
};

export function startMessageCleanup() {
  console.log("Message Cleanup Service started... will read retention hours dynamically.");
  
  const runCleanup = async () => {
    try {
      const retentionHours = getRetentionHours();
      if (retentionHours <= 0) return; // disabled
      
      const cutoffDate = new Date(Date.now() - retentionHours * 60 * 60 * 1000);
      
      // Find all admins
      const admins = await prisma.user.findMany({
        where: { role: { in: ["ADMIN", "SUPER_ADMIN"] } },
        select: { id: true }
      });
      const adminIds = admins.map(a => a.id);
      
      if (adminIds.length === 0) return;

      // Find old messages sent by admins to users
      const oldMessages = await prisma.message.findMany({
        where: {
          senderId: { in: adminIds },
          createdAt: { lt: cutoffDate }
        },
        select: { 
          id: true, 
          documents: { select: { id: true } },
          receiver: { select: { role: true } }
        }
      });
      
      // Filter out messages where receiver is also an admin (optional, but good practice to only delete client messages)
      const messagesToDelete = oldMessages.filter(msg => msg.receiver?.role === "USER");
      
      if (messagesToDelete.length === 0) return;
      
      let deletedCount = 0;
      
      for (const msg of messagesToDelete) {
        try {
          // If message is linked to any documents, unlink them first to avoid Prisma foreign key constraint errors
          if (msg.documents && msg.documents.length > 0) {
            await prisma.userDocument.updateMany({
              where: { messageId: msg.id },
              data: { messageId: null }
            });
          }
          
          await prisma.message.delete({
            where: { id: msg.id }
          });
          deletedCount++;
        } catch (err) {
          console.error(`Failed to delete old message ${msg.id}:`, err.message);
        }
      }
      
      if (deletedCount > 0) {
        console.log(`[SYSTEM] Auto-deleted ${deletedCount} old admin-to-client messages (older than ${retentionHours}h).`);
      }
      
    } catch (error) {
      console.error("Error in message cleanup cron:", error);
    }
  };

  // Run cleanup every 5 minutes (so it regularly prunes expired messages accurately)
  const CLEANUP_INTERVAL_MS = 5 * 60 * 1000; 
  
  // Run on startup (after 10s delay to not block boot)
  setTimeout(runCleanup, 10000);
  
  // Then schedule periodically
  setInterval(runCleanup, CLEANUP_INTERVAL_MS);
}
