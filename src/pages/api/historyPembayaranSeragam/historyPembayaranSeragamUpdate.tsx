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
      jumlahDiBayar,
      tanggalPembayaran,
      updatedBy,
      siswaId,
      tunggakan,
      totalBayar,
      jumlahDiBayarAwal,
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
    let updatedTunggakan
    let updatedTotalBayar
    if (jumlahDiBayarAwal > jumlahDiBayar) {
      const sisa = jumlahDiBayarAwal - jumlahDiBayar
      updatedTunggakan = tunggakan + sisa
      updatedTotalBayar = totalBayar - sisa
    } else if (jumlahDiBayarAwal < jumlahDiBayar) {
      const sisa = jumlahDiBayar - jumlahDiBayarAwal
      updatedTunggakan = tunggakan - sisa
      updatedTotalBayar = totalBayar + sisa
    }

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
