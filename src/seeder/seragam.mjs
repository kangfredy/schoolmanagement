import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

const mockData = [
  { seragam: 'Seragam Batik XL' },
  { seragam: 'Seragam Pramuka XL' },
  { seragam: 'Seragam Olahraga XL' },
  { seragam: 'Seragam Sekolah XL' },
  { seragam: 'Seragam Kantor XL' },
  { seragam: 'Seragam Pesta XL' },
  { seragam: 'Seragam Dinas XL' },
  { seragam: 'Seragam Pernikahan XL' },
  { seragam: 'Seragam Wisuda XL' },
  { seragam: 'Seragam Kerja XL' },
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
