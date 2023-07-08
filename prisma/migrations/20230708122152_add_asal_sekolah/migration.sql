/*
  Warnings:

  - Added the required column `asalSekolah` to the `DataSiswa` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `datasiswa` ADD COLUMN `asalSekolah` VARCHAR(191) NOT NULL;
