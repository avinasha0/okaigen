-- AlterTable
ALTER TABLE `User` ADD COLUMN `isSuperadmin` BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE `SmtpConfig` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(50) NOT NULL,
    `host` VARCHAR(255) NOT NULL,
    `port` INTEGER NOT NULL,
    `secure` BOOLEAN NOT NULL DEFAULT false,
    `username` VARCHAR(255) NULL,
    `passwordEnc` LONGTEXT NULL,
    `fromEmail` VARCHAR(255) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `SmtpConfig_name_key`(`name`),
    INDEX `SmtpConfig_name_idx`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Optional bootstrap: promote a known email to superadmin (safe if user doesn't exist yet)
UPDATE `User`
SET `isSuperadmin` = true
WHERE `email` = 'bss20206@gmail.com';

