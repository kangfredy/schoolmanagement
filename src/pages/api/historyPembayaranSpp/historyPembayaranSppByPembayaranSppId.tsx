import { PrismaClient } from '@prisma/client'
import type { NextApiRequest, NextApiResponse } from 'next'

const prisma = new PrismaClient()

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { pembayaranSppId }: any = req.query
  if (req.method === 'GET') {
    // Get Data
    const getHistoryPembayaranSppById =
      await prisma.historyPembayaranSpp.findMany({
        where: {
          pembayaranSppId: parseInt(pembayaranSppId),
          isDeleted: false,
        },
        include: {
          pembayaranSpp: true,
        },
      })

    // Return a success or failed message
    res
      .status(200)
      .json({ message: 'Get Data successful', getHistoryPembayaranSppById })
  } else {
    res.status(405).json({ message: 'Method not allowed' })
  }
}
