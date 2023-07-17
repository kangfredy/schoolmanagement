/*
  Warnings:

  - You are about to drop the column `seragamId` on the `historypembayaranseragam` table. All the data in the column will be lost.
  - You are about to drop the column `sudahDibayar` on the `historypembayaranseragam` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `historypembayaranseragam` DROP FOREIGN KEY `HistoryPembayaranSeragam_seragamId_fkey`;

-- AlterTable
ALTER TABLE `historypembayaranseragam` DROP COLUMN `seragamId`,
    DROP COLUMN `sudahDibayar`,
    ADD COLUMN `jumlahDiBayar` INTEGER NULL;

-- CreateTable
CREATE TABLE `DetailHistoryPembayaranSeragam` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `pembayaranSeragamId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `updatedBy` INTEGER NOT NULL,
    `isDeleted` BOOLEAN NOT NULL DEFAULT false,
    `seragamId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `DetailHistoryPembayaranSeragam` ADD CONSTRAINT `DetailHistoryPembayaranSeragam_pembayaranSeragamId_fkey` FOREIGN KEY (`pembayaranSeragamId`) REFERENCES `PembayaranSeragam`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DetailHistoryPembayaranSeragam` ADD CONSTRAINT `DetailHistoryPembayaranSeragam_updatedBy_fkey` FOREIGN KEY (`updatedBy`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DetailHistoryPembayaranSeragam` ADD CONSTRAINT `DetailHistoryPembayaranSeragam_seragamId_fkey` FOREIGN KEY (`seragamId`) REFERENCES `Seragam`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
