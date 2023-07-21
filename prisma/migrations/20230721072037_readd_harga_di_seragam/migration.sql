/*
  Warnings:

  - Added the required column `harga` to the `Seragam` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `seragam` ADD COLUMN `harga` INTEGER NOT NULL;
