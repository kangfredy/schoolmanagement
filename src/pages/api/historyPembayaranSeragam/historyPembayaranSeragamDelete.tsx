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
      updatedBy,
      siswaId,
      tunggakan,
      totalBayar,
    } = req.body

    // Delete Data
    const deleteHistoryPembayaranSeragam =
      await prisma.historyPembayaranSeragam.update({
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

    // Calculate the updated values
    const updatedTunggakan = tunggakan + jumlahDiBayar
    const updatedTotalBayar = totalBayar - jumlahDiBayar

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
      message: 'Delete Successful',
      deleteHistoryPembayaranSeragam,
      updatePembayaranSeragam,
    })
  } else {
    res.status(405).json({ message: 'Method not allowed' })
  }
}
