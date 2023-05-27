import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const mockData = [
  {
    nama: "ucok",
    alamat: "Jalan 1",
    tanggalMasuk: new Date(Date.now()),
    kelasId: 1,
    jenisKelamin: 1,
    agama: "budha",
  },
  {
    nama: "budi",
    alamat: "Jalan 2",
    tanggalMasuk: new Date(Date.now()),
    kelasId: 2,
    jenisKelamin: 2,
    agama: "islam",
  },
  {
    nama: "joko",
    alamat: "Jalan 3",
    tanggalMasuk: new Date(Date.now()),
    kelasId: 1,
    jenisKelamin: 1,
    agama: "kristen",
  },
  {
    nama: "siti",
    alamat: "Jalan 4",
    tanggalMasuk: new Date(Date.now()),
    kelasId: 2,
    jenisKelamin: 2,
    agama: "hindu",
  },
  {
    nama: "rini",
    alamat: "Jalan 6",
    tanggalMasuk: new Date(Date.now()),
    kelasId: 2,
    jenisKelamin: 2,
    agama: "islam",
  },
];

export const seedSiswa = async () => {
  await prisma.dataSiswa.createMany({
    data: mockData,
  });
};

seedSiswa()
  .catch(error => {
    console.error(error);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
