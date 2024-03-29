import { PrismaClient } from '@prisma/client'
import type { NextApiRequest, NextApiResponse } from 'next'

const prisma = new PrismaClient()

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === 'POST') {
    const { id, updatedBy } = req.body

    // Delete Data
    const deleteDetailHistoryPembayaranSeragam =
      await prisma.detailHistoryPembayaranSeragam.update({
        where: {
          id: id,
        },
        data: {
          updatedBy: Number(updatedBy),
          isDeleted: {
            set: true,
          },
        },
      })

    const getPembayaranSeragam = await prisma.pembayaranSeragam.findUnique({
      where: {
        id: deleteDetailHistoryPembayaranSeragam.pembayaranSeragamId,
      },
      include: {
        siswa: true,
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
    res.status(200).json({
      message: 'Delete successful',
      deleteDetailHistoryPembayaranSeragam,
      getPembayaranSeragam,
    })
  } else {
    res.status(405).json({ message: 'Method not allowed' })
  }
}
