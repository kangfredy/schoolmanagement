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
    const getDetailHistoryPembayaranSeragamById =
      await prisma.detailHistoryPembayaranSeragam.findMany({
        where: {
          pembayaranSeragamId: parseInt(pembayaranSeragamId),
          isDeleted: false,
        },
        include: {
          pembayaranSeragam: true,
          seragam: true,
          user: {
            select: {
              id: true,
              username: true,
              role: true,
              createdAt: true,
              updatedAt: true,
              isDeleted: true,
            },
          },
        },
      })

    // Return a success or failed message
    res
      .status(200)
      .json({
        message: 'Get Data successful',
        getDetailHistoryPembayaranSeragamById,
      })
  } else {
    res.status(405).json({ message: 'Method not allowed' })
  }
}
