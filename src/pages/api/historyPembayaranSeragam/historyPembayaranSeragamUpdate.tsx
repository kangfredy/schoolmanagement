import { PrismaClient } from '@prisma/client'
import type { NextApiRequest, NextApiResponse } from 'next'

const prisma = new PrismaClient()

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === 'POST') {
    const {
      id,
      pembayaranSeragamId,
      tanggalPembayaran,
      jumlahDiBayar,
      updatedBy,
      siswaId,
      tunggakan,
      totalBayar,
    } = req.body

    // Update Data
    const updateHistoryPembayaranSeragam =
      await prisma.historyPembayaranSeragam.update({
        where: {
          id: id,
        },
        data: {
          pembayaranSeragamId: pembayaranSeragamId,
          tanggalPembayaran: tanggalPembayaran,
          jumlahDiBayar: jumlahDiBayar,
          updatedBy: Number(updatedBy),
        },
      })

    // Calculate the updated values
    const updatedTunggakan = tunggakan - jumlahDiBayar
    const updatedTotalBayar = totalBayar + jumlahDiBayar

    const updatePembayaranSeragam = await prisma.pembayaranSeragam.update({
      where: {
        id: pembayaranSeragamId,
      },
      data: {
        siswaId: siswaId,
        tunggakan: updatedTunggakan,
        totalBayar: updatedTotalBayar,
        updatedBy: Number(updatedBy),
      },
      include: {
        user: true,
      },
    })
    // Return a success or failed message
    res.status(200).json({
      message: 'Update successful',
      updateHistoryPembayaranSeragam,
      updatePembayaranSeragam,
    })
  } else {
    res.status(405).json({ message: 'Method not allowed' })
  }
}
