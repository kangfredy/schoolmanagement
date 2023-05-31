import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

const mockData = [
  { siswaId: 1, tunggakan: 20000000, totalBayar: 35000000 },
  { siswaId: 2, tunggakan: 15000000, totalBayar: 25000000 },
  { siswaId: 3, tunggakan: 10000000, totalBayar: 18000000 },
  { siswaId: 4, tunggakan: 5000000, totalBayar: 9000000 },
  { siswaId: 5, tunggakan: 30000000, totalBayar: 40000000 },
  { siswaId: 6, tunggakan: 25000000, totalBayar: 30000000 },
  { siswaId: 7, tunggakan: 12000000, totalBayar: 15000000 },
  { siswaId: 8, tunggakan: 8000000, totalBayar: 12000000 },
  { siswaId: 9, tunggakan: 18000000, totalBayar: 22000000 },
  { siswaId: 10, tunggakan: 30000500, totalBayar: 40000000 },
]

export const seedSpp = async () => {
  await prisma.pembayaranSpp.createMany({
    data: mockData,
  })
}

seedSpp()
  .catch(error => {
    console.error(error)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
