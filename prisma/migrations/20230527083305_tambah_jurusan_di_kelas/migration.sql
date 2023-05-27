/*
  Warnings:

  - You are about to drop the column `jurusanId` on the `datasiswa` table. All the data in the column will be lost.
  - Added the required column `jurusanId` to the `Kelas` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `datasiswa` DROP FOREIGN KEY `DataSiswa_jurusanId_fkey`;

-- AlterTable
ALTER TABLE `datasiswa` DROP COLUMN `jurusanId`;

-- AlterTable
ALTER TABLE `kelas` ADD COLUMN `jurusanId` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `Kelas` ADD CONSTRAINT `Kelas_jurusanId_fkey` FOREIGN KEY (`jurusanId`) REFERENCES `Jurusan`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
