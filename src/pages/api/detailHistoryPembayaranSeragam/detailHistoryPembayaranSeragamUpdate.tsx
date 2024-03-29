import { PrismaClient } from '@prisma/client'
import type { NextApiRequest, NextApiResponse } from 'next'

const prisma = new PrismaClient()

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === 'POST') {
    const { id, pembayaranSeragamId, seragamId, updatedBy } = req.body

    // Update Data
    const updateDetailHistoryPembayaranSeragam =
      await prisma.detailHistoryPembayaranSeragam.update({
        where: {
          id: id,
        },
        data: {
          pembayaranSeragamId: pembayaranSeragamId,
          seragamId: seragamId,
          updatedBy: Number(updatedBy),
        },
      })

    // Return a success or failed message
    res.status(200).json({
      message: 'Update successful',
      updateDetailHistoryPembayaranSeragam,
    })
  } else {
    res.status(405).json({ message: 'Method not allowed' })
  }
}
