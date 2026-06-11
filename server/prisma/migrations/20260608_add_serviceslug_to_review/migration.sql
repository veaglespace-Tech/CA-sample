-- AddColumn serviceSlug to Review
ALTER TABLE `Review` ADD COLUMN `serviceSlug` VARCHAR(191);

-- AddColumn isGeneral
ALTER TABLE `Review` ADD COLUMN `isGeneral` BOOLEAN NOT NULL DEFAULT TRUE;

-- AddColumn location
ALTER TABLE `Review` ADD COLUMN `location` VARCHAR(191);

-- AddIndex
ALTER TABLE `Review` ADD INDEX `Review_serviceSlug_idx` (`serviceSlug`);
