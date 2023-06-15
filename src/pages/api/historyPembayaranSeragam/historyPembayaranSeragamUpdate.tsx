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
      seragamId,
      tanggalPembayaran,
      sudahDibayar,
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
          seragamId: seragamId,
          tanggalPembayaran: tanggalPembayaran,
          sudahDibayar: sudahDibayar,
          updatedBy: Number(updatedBy),
        },
        include: {
          seragam: true,
        },
      })

    // Calculate the updated values
    const updatedTunggakan =
      tunggakan - updateHistoryPembayaranSeragam.seragam.harga
    const updatedTotalBayar =
      totalBayar + updateHistoryPembayaranSeragam.seragam.harga

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
        siswa: true,
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
