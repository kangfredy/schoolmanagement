import { PrismaClient } from '@prisma/client'
import type { NextApiRequest, NextApiResponse } from 'next'

const prisma = new PrismaClient()

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === 'POST') {
    const { pembayaranSeragamId, seragamId, updatedBy } = req.body

    // Create Data Baru
    const tambahDetailHistoryPembayaranSeragam =
      await prisma.detailHistoryPembayaranSeragam.create({
        data: {
          pembayaranSeragamId: pembayaranSeragamId,
          seragamId: seragamId,
          updatedBy: Number(updatedBy),
        },
      })

    const getPembayaranSeragam = await prisma.pembayaranSeragam.findUnique({
      where: {
        id: tambahDetailHistoryPembayaranSeragam.pembayaranSeragamId,
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
      message: 'Tambah successful',
      tambahDetailHistoryPembayaranSeragam,
      getPembayaranSeragam,
    })
  } else {
    res.status(405).json({ message: 'Method not allowed' })
  }
}
