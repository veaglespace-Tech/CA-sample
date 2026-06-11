-- CreateTable
ALTER TABLE `Referral` MODIFY `status` ENUM('NEW', 'CONTACTED', 'CONVERTED', 'COMPLETED', 'REJECTED') NOT NULL DEFAULT 'NEW';

CREATE TABLE `ReferralRewardSetting` (
    `id` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `requiredReferrals` INTEGER NOT NULL DEFAULT 5,
    `discountPercent` INTEGER NOT NULL DEFAULT 20,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `ReferralRewardSetting_isActive_idx`(`isActive`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ReferralRewardRedemption` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `rewardSettingId` VARCHAR(191) NOT NULL,
    `paymentRecordId` VARCHAR(191) NULL,
    `discountPercent` INTEGER NOT NULL,
    `discountAmount` VARCHAR(191) NOT NULL,
    `originalAmount` VARCHAR(191) NOT NULL,
    `finalAmount` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `ReferralRewardRedemption_paymentRecordId_key`(`paymentRecordId`),
    INDEX `ReferralRewardRedemption_userId_idx`(`userId`),
    INDEX `ReferralRewardRedemption_rewardSettingId_idx`(`rewardSettingId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- SeedDefaultActiveReward
INSERT INTO `ReferralRewardSetting` (`id`, `title`, `requiredReferrals`, `discountPercent`, `isActive`, `createdAt`, `updatedAt`)
SELECT CONCAT('cl', REPLACE(UUID(), '-', '')), 'Refer 5 friends, get 20% off any one service', 5, 20, true, CURRENT_TIMESTAMP(3), CURRENT_TIMESTAMP(3)
WHERE NOT EXISTS (SELECT 1 FROM `ReferralRewardSetting`);

-- AddForeignKey
ALTER TABLE `ReferralRewardRedemption` ADD CONSTRAINT `ReferralRewardRedemption_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ReferralRewardRedemption` ADD CONSTRAINT `ReferralRewardRedemption_rewardSettingId_fkey` FOREIGN KEY (`rewardSettingId`) REFERENCES `ReferralRewardSetting`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ReferralRewardRedemption` ADD CONSTRAINT `ReferralRewardRedemption_paymentRecordId_fkey` FOREIGN KEY (`paymentRecordId`) REFERENCES `PaymentRecord`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
