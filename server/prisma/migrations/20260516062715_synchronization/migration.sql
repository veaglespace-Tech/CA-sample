-- AlterTable
ALTER TABLE `Article` ADD COLUMN `videoUrl` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `Lead` ADD COLUMN `userId` VARCHAR(191) NULL,
    MODIFY `formType` ENUM('CONTACT', 'CALLBACK', 'CONSULTATION', 'LOGIN', 'REFERRAL', 'SUPPORT', 'REGISTRATION', 'OTHER') NOT NULL DEFAULT 'CONTACT';

-- AlterTable
ALTER TABLE `RegistrationLead` ADD COLUMN `address` VARCHAR(191) NULL,
    ADD COLUMN `formType` ENUM('CONTACT', 'CALLBACK', 'CONSULTATION', 'LOGIN', 'REFERRAL', 'SUPPORT', 'REGISTRATION', 'OTHER') NOT NULL DEFAULT 'REGISTRATION',
    ADD COLUMN `ipAddress` VARCHAR(191) NULL,
    ADD COLUMN `mainCategory` VARCHAR(191) NULL,
    ADD COLUMN `metadata` JSON NULL,
    ADD COLUMN `natureOfBusiness` VARCHAR(191) NULL,
    ADD COLUMN `pinCode` VARCHAR(191) NULL,
    ADD COLUMN `source` ENUM('WEBSITE', 'HOME_PAGE', 'SERVICE_PAGE', 'CONTACT_PAGE', 'TALK_TO_EXPERT_PAGE', 'FLOATING_WIDGET', 'LOGIN_MODAL', 'REFERRAL_PAGE', 'API', 'OTHER') NOT NULL DEFAULT 'WEBSITE',
    ADD COLUMN `state` VARCHAR(191) NULL,
    ADD COLUMN `userAgent` VARCHAR(191) NULL,
    ADD COLUMN `userId` VARCHAR(191) NULL,
    MODIFY `registrationType` ENUM('COMPANY_REGISTRATION', 'GST_REGISTRATION', 'TRADEMARK_REGISTRATION', 'FSSAI_REGISTRATION', 'MSME_REGISTRATION', 'LLP_REGISTRATION', 'OTHER') NOT NULL DEFAULT 'OTHER';

-- CreateTable
CREATE TABLE `Message` (
    `id` VARCHAR(191) NOT NULL,
    `senderId` VARCHAR(191) NOT NULL,
    `receiverId` VARCHAR(191) NOT NULL,
    `registrationId` VARCHAR(191) NULL,
    `leadId` VARCHAR(191) NULL,
    `content` TEXT NOT NULL,
    `isRead` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `isDocRequest` BOOLEAN NOT NULL DEFAULT false,
    `requestedDocName` VARCHAR(191) NULL,

    INDEX `Message_senderId_idx`(`senderId`),
    INDEX `Message_receiverId_idx`(`receiverId`),
    INDEX `Message_isRead_idx`(`isRead`),
    INDEX `Message_leadId_fkey`(`leadId`),
    INDEX `Message_registrationId_fkey`(`registrationId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ServicePricingPlan` (
    `id` VARCHAR(191) NOT NULL,
    `serviceId` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `description` TEXT NULL,
    `price` VARCHAR(191) NOT NULL,
    `oldPrice` VARCHAR(191) NULL,
    `tag` VARCHAR(191) NULL,
    `isHighlighted` BOOLEAN NOT NULL DEFAULT false,
    `features` JSON NOT NULL,
    `sortOrder` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `ServicePricingPlan_serviceId_idx`(`serviceId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ContactQuery` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NULL,
    `phone` VARCHAR(191) NOT NULL,
    `subject` VARCHAR(191) NULL,
    `message` TEXT NOT NULL,
    `isRead` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `ContactQuery_isRead_idx`(`isRead`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PurchasePlan` (
    `id` VARCHAR(191) NOT NULL,
    `serviceId` VARCHAR(191) NULL,
    `serviceSlug` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `description` TEXT NULL,
    `price` VARCHAR(191) NOT NULL,
    `oldPrice` VARCHAR(191) NULL,
    `tag` VARCHAR(191) NULL,
    `isHighlighted` BOOLEAN NOT NULL DEFAULT false,
    `features` JSON NOT NULL,
    `sortOrder` INTEGER NOT NULL DEFAULT 0,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `PurchasePlan_serviceSlug_idx`(`serviceSlug`),
    INDEX `PurchasePlan_serviceId_idx`(`serviceId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `UserDocument` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `registrationId` VARCHAR(191) NULL,
    `documentType` VARCHAR(191) NOT NULL,
    `fileUrl` VARCHAR(191) NOT NULL,
    `fileName` VARCHAR(191) NOT NULL,
    `status` ENUM('PENDING', 'VERIFIED', 'REJECTED') NOT NULL DEFAULT 'PENDING',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `leadId` VARCHAR(191) NULL,
    `messageId` VARCHAR(191) NULL,
    `isSentByAdmin` BOOLEAN NOT NULL DEFAULT false,

    INDEX `UserDocument_userId_idx`(`userId`),
    INDEX `UserDocument_registrationId_idx`(`registrationId`),
    INDEX `UserDocument_leadId_idx`(`leadId`),
    INDEX `UserDocument_messageId_idx`(`messageId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `AdminRepositoryDocument` (
    `id` VARCHAR(191) NOT NULL,
    `fileName` VARCHAR(191) NOT NULL,
    `fileUrl` VARCHAR(191) NOT NULL,
    `description` TEXT NULL,
    `category` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Event` (
    `id` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `slug` VARCHAR(191) NOT NULL,
    `description` TEXT NULL,
    `date` DATETIME(3) NOT NULL,
    `time` VARCHAR(191) NULL,
    `location` VARCHAR(191) NULL,
    `imageUrl` VARCHAR(191) NULL,
    `regLink` VARCHAR(191) NULL,
    `speakers` JSON NULL,
    `status` ENUM('DRAFT', 'PUBLISHED', 'ARCHIVED') NOT NULL DEFAULT 'PUBLISHED',
    `sortOrder` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Event_slug_key`(`slug`),
    INDEX `Event_status_date_idx`(`status`, `date`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE INDEX `Lead_userId_fkey` ON `Lead`(`userId`);

-- CreateIndex
CREATE INDEX `RegistrationLead_userId_fkey` ON `RegistrationLead`(`userId`);

-- CreateIndex
CREATE INDEX `User_email_idx` ON `User`(`email`);

-- AddForeignKey
ALTER TABLE `Message` ADD CONSTRAINT `Message_leadId_fkey` FOREIGN KEY (`leadId`) REFERENCES `Lead`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Message` ADD CONSTRAINT `Message_receiverId_fkey` FOREIGN KEY (`receiverId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Message` ADD CONSTRAINT `Message_registrationId_fkey` FOREIGN KEY (`registrationId`) REFERENCES `RegistrationLead`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Message` ADD CONSTRAINT `Message_senderId_fkey` FOREIGN KEY (`senderId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ServicePricingPlan` ADD CONSTRAINT `ServicePricingPlan_serviceId_fkey` FOREIGN KEY (`serviceId`) REFERENCES `Service`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Lead` ADD CONSTRAINT `Lead_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PurchasePlan` ADD CONSTRAINT `PurchasePlan_serviceId_fkey` FOREIGN KEY (`serviceId`) REFERENCES `Service`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RegistrationLead` ADD CONSTRAINT `RegistrationLead_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserDocument` ADD CONSTRAINT `UserDocument_leadId_fkey` FOREIGN KEY (`leadId`) REFERENCES `Lead`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserDocument` ADD CONSTRAINT `UserDocument_messageId_fkey` FOREIGN KEY (`messageId`) REFERENCES `Message`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserDocument` ADD CONSTRAINT `UserDocument_registrationId_fkey` FOREIGN KEY (`registrationId`) REFERENCES `RegistrationLead`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserDocument` ADD CONSTRAINT `UserDocument_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- CreateTable
CREATE TABLE `PaymentRecord` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NULL,
    `leadId` VARCHAR(191) NULL,
    `registrationId` VARCHAR(191) NULL,
    `serviceName` VARCHAR(191) NOT NULL,
    `amount` VARCHAR(191) NOT NULL,
    `status` VARCHAR(191) NOT NULL DEFAULT 'SUCCESS',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `customerEmail` VARCHAR(191) NULL,
    `customerName` VARCHAR(191) NULL,
    `customerPhone` VARCHAR(191) NULL,

    INDEX `PaymentRecord_userId_idx`(`userId`),
    INDEX `PaymentRecord_leadId_idx`(`leadId`),
    INDEX `PaymentRecord_registrationId_idx`(`registrationId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `PaymentRecord` ADD CONSTRAINT `PaymentRecord_leadId_fkey` FOREIGN KEY (`leadId`) REFERENCES `Lead`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PaymentRecord` ADD CONSTRAINT `PaymentRecord_registrationId_fkey` FOREIGN KEY (`registrationId`) REFERENCES `RegistrationLead`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PaymentRecord` ADD CONSTRAINT `PaymentRecord_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
