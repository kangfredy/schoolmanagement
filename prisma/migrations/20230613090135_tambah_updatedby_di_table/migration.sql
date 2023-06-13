/*
  Warnings:

  - You are about to drop the column `jumlahDiBayar` on the `historypembayaranseragam` table. All the data in the column will be lost.
  - Added the required column `updatedBy` to the `DataSiswa` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedBy` to the `HistoryPembayaranSeragam` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedBy` to the `HistoryPembayaranSpp` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Jurusan` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedBy` to the `Jurusan` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Kelas` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedBy` to the `Kelas` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedBy` to the `PembayaranSeragam` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedBy` to the `PembayaranSpp` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Seragam` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedBy` to the `Seragam` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `datasiswa` ADD COLUMN `updatedBy` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `historypembayaranseragam` DROP COLUMN `jumlahDiBayar`,
    ADD COLUMN `updatedBy` INTEGER NOT NULL,
    MODIFY `tanggalPembayaran` DATETIME(3) NULL;

-- AlterTable
ALTER TABLE `historypembayaranspp` ADD COLUMN `updatedBy` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `jurusan` ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL,
    ADD COLUMN `updatedBy` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `kelas` ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL,
    ADD COLUMN `updatedBy` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `pembayaranseragam` ADD COLUMN `updatedBy` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `pembayaranspp` ADD COLUMN `updatedBy` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `seragam` ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL,
    ADD COLUMN `updatedBy` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `Jurusan` ADD CONSTRAINT `Jurusan_updatedBy_fkey` FOREIGN KEY (`updatedBy`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Kelas` ADD CONSTRAINT `Kelas_updatedBy_fkey` FOREIGN KEY (`updatedBy`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DataSiswa` ADD CONSTRAINT `DataSiswa_updatedBy_fkey` FOREIGN KEY (`updatedBy`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PembayaranSpp` ADD CONSTRAINT `PembayaranSpp_updatedBy_fkey` FOREIGN KEY (`updatedBy`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `HistoryPembayaranSpp` ADD CONSTRAINT `HistoryPembayaranSpp_updatedBy_fkey` FOREIGN KEY (`updatedBy`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Seragam` ADD CONSTRAINT `Seragam_updatedBy_fkey` FOREIGN KEY (`updatedBy`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PembayaranSeragam` ADD CONSTRAINT `PembayaranSeragam_updatedBy_fkey` FOREIGN KEY (`updatedBy`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `HistoryPembayaranSeragam` ADD CONSTRAINT `HistoryPembayaranSeragam_updatedBy_fkey` FOREIGN KEY (`updatedBy`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
