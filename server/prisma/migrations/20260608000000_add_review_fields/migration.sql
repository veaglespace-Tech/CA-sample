-- Review table: add serviceSlug, isGeneral, location columns
-- This migration is safe to run - it uses a separate approach for each column

-- Step 1: Add serviceSlug column
ALTER TABLE `Review` ADD COLUMN `serviceSlug` VARCHAR(191) NULL;

-- Step 2: Add isGeneral column  
ALTER TABLE `Review` ADD COLUMN `isGeneral` BOOLEAN NOT NULL DEFAULT TRUE;

-- Step 3: Add location column
ALTER TABLE `Review` ADD COLUMN `location` VARCHAR(191) NULL;

-- Step 4: Add index on serviceSlug for fast lookup
ALTER TABLE `Review` ADD INDEX `Review_serviceSlug_idx` (`serviceSlug`);
