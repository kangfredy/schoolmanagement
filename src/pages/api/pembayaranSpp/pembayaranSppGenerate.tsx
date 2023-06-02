import { PrismaClient } from '@prisma/client'
import { NextApiRequest, NextApiResponse } from 'next'
const prisma = new PrismaClient()
const dotenv = require('dotenv')

dotenv.config()

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { idSiswa }: any = req.query
  const jumlahspp: any = process.env.SPP_BULANAN
  if (req.method === 'GET') {
    const generate = await prisma.pembayaranSpp.create({
      data: {
        siswaId: parseInt(idSiswa),
        tunggakan: jumlahspp * 12,
        totalBayar: 0,
      },
    })

    const startDate = new Date() // Set the start date
    const numberOfMonths = 12 // Define the number of months

    // Loop through each month
    for (let i = 0; i < numberOfMonths; i++) {
      const currentMonth = startDate.getMonth() + i + 1
      const currentDate = new Date(startDate.getFullYear(), currentMonth, 1)
      await prisma.historyPembayaranSpp.create({
        data: {
          pembayaranSppId: generate.id,
          jatuhTempo: currentDate,
          jumlah: parseInt(jumlahspp),
          sudahDibayar: false,
        },
      })
    }
    res.status(200).json({ message: 'Generate successful' })
  } else {
    res.status(405).json({ message: 'metthod not allowed' })
  }
}
