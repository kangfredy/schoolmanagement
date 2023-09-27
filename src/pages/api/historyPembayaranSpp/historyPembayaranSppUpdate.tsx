import { PrismaClient } from '@prisma/client'
import type { NextApiRequest, NextApiResponse } from 'next'

const prisma = new PrismaClient()

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const sppbulanan: any = process.env.SPP_BULANAN
  if (req.method === 'POST') {
    const {
      id,
      pembayaranSppId,
      jatuhTempo,
      jumlah,
      sudahDibayar,
      tanggalPembayaran,
      updatedBy,
      siswaId,
      tunggakan,
      totalBayar,
    } = req.body

    // Update Data
    const updateHistoryPembayaranSpp = await prisma.historyPembayaranSpp.update(
      {
        where: {
          id: id,
        },
        data: {
          pembayaranSppId: pembayaranSppId,
          jatuhTempo: jatuhTempo,
          jumlah: jumlah,
          sudahDibayar: sudahDibayar,
          tanggalPembayaran:
            tanggalPembayaran === '' ? null : tanggalPembayaran, // Kalau Undo, jadinya null
          updatedBy: Number(updatedBy),
        },
      },
    )

    const getListHistoryPembayaranSpp =
      await prisma.historyPembayaranSpp.findMany({
        where: {
          pembayaranSppId: pembayaranSppId,
        },
      })

    let bayarCount = 0
    let belumCount = 0

    getListHistoryPembayaranSpp.forEach(item => {
      if (item.sudahDibayar === true) {
        bayarCount++
      } else {
        belumCount++
      }
    })

    // Calculate the updated values
    const updatedTunggakan = belumCount * Number(sppbulanan)
    const updatedTotalBayar = bayarCount * Number(sppbulanan)

    const updatePembayaranSpp = await prisma.pembayaranSpp.update({
      where: {
        id: pembayaranSppId,
      },
      data: {
        siswaId: siswaId,
        tunggakan: updatedTunggakan,
        totalBayar: updatedTotalBayar,
        updatedBy: Number(updatedBy),
      },
      include: {
        siswa: true, // Include the related data from the siswa table
      },
    })

    // Return a success or failed message
    res.status(200).json({
      message: 'Update successful',
      updateHistoryPembayaranSpp,
      updatePembayaranSpp,
      getListHistoryPembayaranSpp,
    })
  } else {
    res.status(405).json({ message: 'Method not allowed' })
  }
}
