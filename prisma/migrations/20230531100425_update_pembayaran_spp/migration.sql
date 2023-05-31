/*
  Warnings:

  - You are about to drop the column `TotalBayar` on the `pembayaranseragam` table. All the data in the column will be lost.
  - You are about to drop the column `Tunggakan` on the `pembayaranseragam` table. All the data in the column will be lost.
  - You are about to drop the column `TotalBayar` on the `pembayaranspp` table. All the data in the column will be lost.
  - Added the required column `totalBayar` to the `PembayaranSeragam` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tunggakan` to the `PembayaranSeragam` table without a default value. This is not possible if the table is not empty.
  - Added the required column `totalBayar` to the `PembayaranSpp` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `pembayaranseragam` DROP COLUMN `TotalBayar`,
    DROP COLUMN `Tunggakan`,
    ADD COLUMN `totalBayar` INTEGER NOT NULL,
    ADD COLUMN `tunggakan` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `pembayaranspp` DROP COLUMN `TotalBayar`,
    ADD COLUMN `totalBayar` INTEGER NOT NULL;
