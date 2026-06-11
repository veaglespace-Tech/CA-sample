-- AlterTable
ALTER TABLE `Referral`
    ADD COLUMN `referrerUserId` VARCHAR(191) NULL,
    ADD COLUMN `friendUserId` VARCHAR(191) NULL;

-- Backfill direct user links from referral code and friend email/phone where possible.
UPDATE `Referral` r
JOIN `User` friend
  ON (r.`friendEmail` IS NOT NULL AND LOWER(r.`friendEmail`) = LOWER(friend.`email`))
  OR (r.`friendPhone` IS NOT NULL AND r.`friendPhone` <> '' AND r.`friendPhone` = friend.`phone`)
LEFT JOIN `User` referrer
  ON referrer.`referralCode` = friend.`referredByCode`
SET r.`friendUserId` = friend.`id`,
    r.`referrerUserId` = referrer.`id`
WHERE friend.`referredByCode` IS NOT NULL
  AND friend.`referredByCode` <> '';

UPDATE `Referral` r
JOIN `User` referrer
  ON (r.`referrerEmail` IS NOT NULL AND LOWER(r.`referrerEmail`) = LOWER(referrer.`email`))
  OR (r.`referrerPhone` IS NOT NULL AND r.`referrerPhone` <> '' AND r.`referrerPhone` = referrer.`phone`)
SET r.`referrerUserId` = referrer.`id`
WHERE r.`referrerUserId` IS NULL;

-- CreateIndex
CREATE INDEX `Referral_referrerUserId_idx` ON `Referral`(`referrerUserId`);

-- CreateIndex
CREATE INDEX `Referral_friendUserId_idx` ON `Referral`(`friendUserId`);

-- AddForeignKey
ALTER TABLE `Referral` ADD CONSTRAINT `Referral_referrerUserId_fkey` FOREIGN KEY (`referrerUserId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Referral` ADD CONSTRAINT `Referral_friendUserId_fkey` FOREIGN KEY (`friendUserId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
