/*
  Warnings:

  - Added the required column `harga` to the `Seragam` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `historypembayaranseragam` ADD COLUMN `sudahDibayar` BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE `historypembayaranspp` MODIFY `tanggalPembayaran` DATETIME(3) NULL;

-- AlterTable
ALTER TABLE `seragam` ADD COLUMN `harga` INTEGER NOT NULL;
