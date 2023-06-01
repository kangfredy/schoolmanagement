import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

const mockData = [
  { namaJurusan: 'Rekayasa Perangkat Lunak' },
  { namaJurusan: 'Multimedia' },
  { namaJurusan: 'Teknik Komputer dan Jaringan' },
  { namaJurusan: 'Tata Busana' },
  { namaJurusan: 'Teknik Otomotif' },
  { namaJurusan: 'Akuntansi' },
  { namaJurusan: 'Administrasi Perkantoran' },
  { namaJurusan: 'Bisnis Daring dan Pemasaran' },
  { namaJurusan: 'Agribisnis' },
  { namaJurusan: 'Tata Boga' },
]

export const seedJurusan = async () => {
  await prisma.jurusan.createMany({
    data: mockData,
  })
}

seedJurusan()
  .catch(error => {
    console.error(error)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
