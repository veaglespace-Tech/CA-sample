/**
 * Safe database migration runner
 * Runs before the server starts to ensure all required columns exist.
 * Uses raw SQL with information_schema checks — safe to run multiple times.
 */

import { prisma } from "./config/db.js";

export async function runMigrations() {
  try {
    console.log("[MIGRATE] Checking Review table columns...");

    // Check and add serviceSlug
    const hasServiceSlug = await prisma.$queryRaw`
      SELECT COUNT(*) as cnt FROM information_schema.COLUMNS
      WHERE TABLE_SCHEMA = DATABASE()
        AND TABLE_NAME = 'Review'
        AND COLUMN_NAME = 'serviceSlug'
    `;
    if (Number(hasServiceSlug[0]?.cnt) === 0) {
      await prisma.$executeRaw`ALTER TABLE \`Review\` ADD COLUMN \`serviceSlug\` VARCHAR(191) NULL`;
      console.log("[MIGRATE] ✓ Added serviceSlug to Review");
    }

    // Check and add isGeneral
    const hasIsGeneral = await prisma.$queryRaw`
      SELECT COUNT(*) as cnt FROM information_schema.COLUMNS
      WHERE TABLE_SCHEMA = DATABASE()
        AND TABLE_NAME = 'Review'
        AND COLUMN_NAME = 'isGeneral'
    `;
    if (Number(hasIsGeneral[0]?.cnt) === 0) {
      await prisma.$executeRaw`ALTER TABLE \`Review\` ADD COLUMN \`isGeneral\` BOOLEAN NOT NULL DEFAULT TRUE`;
      console.log("[MIGRATE] ✓ Added isGeneral to Review");
    }

    // Check and add location
    const hasLocation = await prisma.$queryRaw`
      SELECT COUNT(*) as cnt FROM information_schema.COLUMNS
      WHERE TABLE_SCHEMA = DATABASE()
        AND TABLE_NAME = 'Review'
        AND COLUMN_NAME = 'location'
    `;
    if (Number(hasLocation[0]?.cnt) === 0) {
      await prisma.$executeRaw`ALTER TABLE \`Review\` ADD COLUMN \`location\` VARCHAR(191) NULL`;
      console.log("[MIGRATE] ✓ Added location to Review");
    }

    // Check and add index
    const hasIndex = await prisma.$queryRaw`
      SELECT COUNT(*) as cnt FROM information_schema.STATISTICS
      WHERE TABLE_SCHEMA = DATABASE()
        AND TABLE_NAME = 'Review'
        AND INDEX_NAME = 'Review_serviceSlug_idx'
    `;
    if (Number(hasIndex[0]?.cnt) === 0) {
      await prisma.$executeRaw`ALTER TABLE \`Review\` ADD INDEX \`Review_serviceSlug_idx\` (\`serviceSlug\`)`;
      console.log("[MIGRATE] ✓ Added serviceSlug index to Review");
    }

    console.log("[MIGRATE] ✓ Review table migration complete.");
  } catch (err) {
    console.error("[MIGRATE] Migration error (non-fatal):", err.message);
    // Don't crash server if migration fails — columns may already exist
  }
}
