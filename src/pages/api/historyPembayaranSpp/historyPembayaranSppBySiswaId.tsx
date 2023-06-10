import { PrismaClient } from '@prisma/client'
import type { NextApiRequest, NextApiResponse } from 'next'

const prisma = new PrismaClient()

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { siswaId }: any = req.query
  if (req.method === 'GET') {
    // Get Data
    const getHistoryPembayaranSppBySiswaId =
      await prisma.historyPembayaranSpp.findMany({
        where: {
          pembayaranSpp: {
            siswaId: Number(siswaId),
          },
          isDeleted: false,
        },
        include: {
          pembayaranSpp: true,
        },
      })

    // Return a success or failed message
    res.status(200).json({
      message: 'Get Data successful',
      getHistoryPembayaranSppBySiswaId,
    })
  } else {
    res.status(405).json({ message: 'Method not allowed' })
  }
}
