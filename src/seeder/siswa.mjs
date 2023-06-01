import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

const mockData = [
  {
    nim: '123328374',
    nama: 'Dani Vicky Mahendra',
    alamat: 'Jalan Anggrek No. 10 Jakarta',
    tanggalMasuk: new Date(Date.now()),
    tanggalLahir: new Date(Date.now()),
    kelasId: 3,
    jenisKelamin: 1,
    agama: 3,
  },
  {
    nim: '123456789',
    nama: 'Rina Sari Dewi',
    alamat: 'Jalan Melati No. 5 Bandung',
    tanggalMasuk: new Date(Date.now()),
    tanggalLahir: new Date(Date.now()),
    kelasId: 2,
    jenisKelamin: 2,
    agama: 1,
  },
  {
    nim: '123987654',
    nama: 'Andi Budi Pratama',
    alamat: 'Jalan Mawar No. 7 Surabaya',
    tanggalMasuk: new Date(Date.now()),
    tanggalLahir: new Date(Date.now()),
    kelasId: 1,
    jenisKelamin: 1,
    agama: 2,
  },
  {
    nim: '123654789',
    nama: 'Lia Nur Fitriani',
    alamat: 'Jalan Kamboja No. 9 Medan',
    tanggalMasuk: new Date(Date.now()),
    tanggalLahir: new Date(Date.now()),
    kelasId: 4,
    jenisKelamin: 2,
    agama: 1,
  },
  {
    nim: '123765498',
    nama: 'Rudi Harianto',
    alamat: 'Jalan Cempaka No. 11 Makassar',
    tanggalMasuk: new Date(Date.now()),
    tanggalLahir: new Date(Date.now()),
    kelasId: 3,
    jenisKelamin: 1,
    agama: 4,
  },
  {
    nim: '123876549',
    nama: 'Siti Aisyah Putri',
    alamat: 'Jalan Dahlia No. 13 Semarang',
    tanggalMasuk: new Date(Date.now()),
    tanggalLahir: new Date(Date.now()),
    kelasId: 2,
    jenisKelamin: 2,
    agama: 3,
  },
  {
    nim: '123987465',
    nama: 'Eko Prasetyo',
    alamat: 'Jalan Kenanga No. 15 Yogyakarta',
    tanggalMasuk: new Date(Date.now()),
    tanggalLahir: new Date(Date.now()),
    kelasId: 1,
    jenisKelamin: 1,
    agama: 2,
  },
  {
    nim: '123654987',
    nama: 'Dewi Lestari',
    alamat: 'Jalan Teratai No.17 Denpasar',
    tanggalMasuk: new Date(Date.now()),
    tanggalLahir: new Date(Date.now()),
    kelasId: 4,
    jenisKelamin: 2,
    agama: 1,
  },
  {
    nim: '123765849',
    nama: 'Fajar Nugroho',
    alamat: 'Jalan Flamboyan No.19 Palembang',
    tanggalMasuk: new Date(Date.now()),
    tanggalLahir: new Date(Date.now()),
    kelasId: 3,
    jenisKelamin: 1,
    agama: 4,
  },
  {
    nim: '123876594',
    nama: 'Rini Wulandari',
    alamat: 'Jalan Bougenville No.21 Malang',
    tanggalMasuk: new Date(Date.now()),
    tanggalLahir: new Date(Date.now()),
    kelasId: 2,
    jenisKelamin: 2,
    agama: 3,
  },
]

export const seedSiswa = async () => {
  await prisma.dataSiswa.createMany({
    data: mockData,
  })
}

seedSiswa()
  .catch(error => {
    console.error(error)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
