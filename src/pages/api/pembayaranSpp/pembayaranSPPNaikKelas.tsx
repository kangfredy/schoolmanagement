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
  if (req.method === 'GET') {
    const pembayaranSpp = await prisma.pembayaranSpp.findFirst({
      where: { siswaId: idSiswa },
    })

    const startDate = new Date() // Set the start date
    const numberOfMonths = 12 // Define the number of months
    if (pembayaranSpp) {
      // Loop through each month
      for (let i = 0; i < numberOfMonths; i++) {
        const currentMonth = startDate.getMonth() + i + 1
        const currentDate = new Date(startDate.getFullYear(), currentMonth, 1)
        await prisma.historyPembayaranSpp.create({
          data: {
            pembayaranSppId: pembayaranSpp.id,
            jatuhTempo: currentDate,
            jumlah: parseInt(jumlahspp),
            sudahDibayar: false,
            updatedBy: Number(updatedBy),
          },
        })
      }
      res.status(200).json({ message: 'Generate successful' })
    }
    res.status(500).json({ message: 'pembayaran SPP Id Not Found' })
  } else {
    res.status(405).json({ message: 'metthod not allowed' })
  }
}
