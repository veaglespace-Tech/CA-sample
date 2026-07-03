import "./config/env.js";
process.env.TZ = "Asia/Kolkata";
import { app } from "./app.js";
import { prisma } from "./config/db.js";
import { runMigrations } from "./migrate.js";
import { startDocumentReminders } from "./cron/documentReminder.js";
import { startMessageCleanup } from "./cron/messageCleanup.js";

const getEnv = (key, fallback = "") => (process.env[key] || fallback).trim();
const PORT = Number(getEnv("PORT", "5003"));

export const startServer = async () => {
  console.log("mysql/prisma connecting...");
  await prisma.$connect();
  console.log("mysql/prisma connected");

  // Run safe column migrations (idempotent - safe to run on every startup)
  await runMigrations();

  // Start background services
  startDocumentReminders();
  startMessageCleanup();

  const server = app.listen(PORT, () => {
    console.log(`Veagle Space API running on http://localhost:${PORT}`);
  });

  const shutdown = async () => {
    await prisma.$disconnect().catch(() => {});
    server.close(() => process.exit(0));
  };

  process.once("SIGINT", shutdown);
  process.once("SIGTERM", shutdown);

  return server;
};

if (process.env.NODE_ENV !== "test") {
  startServer().catch(async (error) => {
    if (error?.code === "EADDRINUSE") {
      console.error(`Failed to start server: port ${PORT} is already in use. Stop the existing process or set PORT to a free port.`);
    } else {
      console.error("Failed to start server:", error.message);
    }

    await prisma.$disconnect().catch(() => {});
    process.exit(1);
  });
}

// End of index.js
// trigger update
// restart
// again

