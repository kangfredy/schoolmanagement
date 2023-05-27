/*
  Warnings:

  - You are about to drop the column `kelas` on the `datasiswa` table. All the data in the column will be lost.
  - Added the required column `kelasId` to the `DataSiswa` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `datasiswa` DROP COLUMN `kelas`,
    ADD COLUMN `kelasId` INTEGER NOT NULL;

-- CreateTable
CREATE TABLE `Kelas` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `namaKelas` VARCHAR(32) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `DataSiswa` ADD CONSTRAINT `DataSiswa_kelasId_fkey` FOREIGN KEY (`kelasId`) REFERENCES `Kelas`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
