import { PrismaClient } from '@prisma/client'
import type { NextApiRequest, NextApiResponse } from 'next'

const prisma = new PrismaClient()

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === 'POST') {
    const {
      pembayaranSeragamId,
      seragamId,
      updatedBy,
      siswaId,
      tunggakan,
      totalBayar,
    } = req.body

    // Create Data Baru
    const tambahHistoryPembayaranSeragam =
      await prisma.historyPembayaranSeragam.create({
        data: {
          pembayaranSeragamId: pembayaranSeragamId,
          seragamId: seragamId,
          updatedBy: Number(updatedBy),
        },
        include: {
          seragam: true,
        },
      })

    const updatedTunggakan =
      tunggakan + tambahHistoryPembayaranSeragam.seragam.harga

    const updatePembayaranSeragam = await prisma.pembayaranSeragam.update({
      where: {
        id: pembayaranSeragamId,
      },
      data: {
        siswaId: siswaId,
        tunggakan: updatedTunggakan,
        totalBayar: totalBayar,
        updatedBy: Number(updatedBy),
      },
      include: {
        siswa: true,
      },
    })
    // Return a success or failed message
    res.status(200).json({
      message: 'Update successful',
      tambahHistoryPembayaranSeragam,
      updatePembayaranSeragam,
    })
  } else {
    res.status(405).json({ message: 'Method not allowed' })
  }
}
