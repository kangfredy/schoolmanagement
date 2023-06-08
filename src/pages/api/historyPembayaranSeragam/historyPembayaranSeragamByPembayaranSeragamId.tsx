import { PrismaClient } from '@prisma/client'
import type { NextApiRequest, NextApiResponse } from 'next'

const prisma = new PrismaClient()

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { pembayaranSeragamId }: any = req.query
  if (req.method === 'GET') {
    // Get Data
    const getHistoryPembayaranSeragamById =
      await prisma.historyPembayaranSeragam.findMany({
        where: {
          pembayaranSeragamId: parseInt(pembayaranSeragamId),
          isDeleted: false,
        },
        include: {
          pembayaranSeragam: true,
          seragam: true,
        },
      })

    // Return a success or failed message
    res
      .status(200)
      .json({ message: 'Get Data successful', getHistoryPembayaranSeragamById })
  } else {
    res.status(405).json({ message: 'Method not allowed' })
  }
}
