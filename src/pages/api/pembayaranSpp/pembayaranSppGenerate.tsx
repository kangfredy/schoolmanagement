import { PrismaClient } from '@prisma/client'
import { NextApiRequest, NextApiResponse } from 'next'
const prisma = new PrismaClient()
const dotenv = require('dotenv')

dotenv.config()

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { idSiswa, updatedBy }: any = req.query
  const jumlahspp: any = process.env.SPP_BULANAN
  const tunggakanseragam: any = process.env.TOTAL_SERAGAM
  if (req.method === 'GET') {
    const generatePembayaranSpp = await prisma.pembayaranSpp.create({
      data: {
        siswaId: parseInt(idSiswa),
        tunggakan: jumlahspp * 12,
        totalBayar: 0,
        updatedBy: Number(updatedBy),
      },
    })

    const startDate = new Date() // Set the start date
    const numberOfMonths = 12 // Define the number of months

    // Loop through each month
    for (let i = 0; i < numberOfMonths; i++) {
      const currentMonth = startDate.getMonth() + i
      const currentDate = new Date(startDate.getFullYear(), currentMonth, 1)
      await prisma.historyPembayaranSpp.create({
        data: {
          pembayaranSppId: generatePembayaranSpp.id,
          jatuhTempo: currentDate,
          jumlah: parseInt(jumlahspp),
          sudahDibayar: false,
          updatedBy: Number(updatedBy),
        },
      })
    }

    await prisma.pembayaranSeragam.create({
      data: {
        siswaId: parseInt(idSiswa),
        totalBayar: 0,
        tunggakan: Number(tunggakanseragam),
        updatedBy: Number(updatedBy),
      },
    })
    res.status(200).json({ message: 'Generate successful' })
  } else {
    res.status(405).json({ message: 'metthod not allowed' })
  }
}
