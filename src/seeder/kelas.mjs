import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

const mockData = [
  { namaKelas: 'X RPL 1', jurusanId: 1 },
  { namaKelas: 'X RPL 2', jurusanId: 2 },
  { namaKelas: 'X MM 1', jurusanId: 3 },
  { namaKelas: 'X MM 2', jurusanId: 4 },
  { namaKelas: 'X TKJ 1', jurusanId: 5 },
  { namaKelas: 'X TKJ 2', jurusanId: 6 },
  { namaKelas: 'X TJA 1', jurusanId: 7 },
  { namaKelas: 'X TJA 2', jurusanId: 8 },
  { namaKelas: 'X AKL 1', jurusanId: 9 },
  { namaKelas: 'X AKL 2', jurusanId: 10 },
]

export const seedKelas = async () => {
  await prisma.kelas.createMany({
    data: mockData,
  })
}

seedKelas()
  .catch(error => {
    console.error(error)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
