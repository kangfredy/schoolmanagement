/*
  Warnings:

  - Added the required column `nim` to the `DataSiswa` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tanggalLahir` to the `DataSiswa` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `datasiswa` ADD COLUMN `nim` VARCHAR(100) NOT NULL,
    ADD COLUMN `tanggalLahir` DATETIME(3) NOT NULL;
