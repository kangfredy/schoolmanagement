import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

const mockData = [{ siswaId: 1, tunggakan: 20000000, totalBayar: 35000000 }]

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
