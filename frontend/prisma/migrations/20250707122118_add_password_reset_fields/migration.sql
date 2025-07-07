/*
  Warnings:

  - A unique constraint covering the columns `[passwordResetToken]` on the table `Admin` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `Admin` ADD COLUMN `passwordResetExpires` DATETIME(3) NULL,
    ADD COLUMN `passwordResetToken` VARCHAR(191) NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Admin_passwordResetToken_key` ON `Admin`(`passwordResetToken`);
