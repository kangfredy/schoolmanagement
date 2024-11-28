import { PrismaClient } from '@prisma/client'
import type { NextApiRequest, NextApiResponse } from 'next'

const prisma = new PrismaClient()
const dotenv = require('dotenv')

dotenv.config()

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === 'POST') {
    const {
      id,
      nim,
      nama,
      alamat,
      tanggalMasuk,
      tanggalLahir,
      kelasId,
      jenisKelamin,
      agama,
      updatedBy,
    } = req.body
    const jumlahspp: any = process.env.SPP_BULANAN

    // Update Data
    const updateNaikKelas = await prisma.dataSiswa.update({
      where: {
        id: id,
      },
      data: {
        nim: nim,
        nama: nama,
        alamat: alamat,
        tanggalMasuk: tanggalMasuk,
        tanggalLahir: tanggalLahir,
        kelasId: kelasId,
        jenisKelamin: jenisKelamin,
        agama: agama,
        updatedBy: Number(updatedBy),
      },
    })

    const pembayaranSpp = await prisma.pembayaranSpp.findFirst({
      where: { siswaId: id },
    })

    const startDate = new Date() // Set the start date
    const numberOfMonths = 11 // Define the number of months

    if (pembayaranSpp) {
      const updatedTunggakan = pembayaranSpp?.tunggakan + jumlahspp * 12

      await prisma.pembayaranSpp.update({
        where: {
          id: pembayaranSpp?.id,
        },
        data: {
          siswaId: pembayaranSpp.siswaId,
          tunggakan: updatedTunggakan,
          totalBayar: pembayaranSpp?.totalBayar,
          updatedBy: Number(updatedBy),
        },
      })

      const getLastMonthPayment = await prisma.historyPembayaranSpp.findFirst({
        where: {
          pembayaranSppId: pembayaranSpp.id,
        },
        orderBy: {
          jatuhTempo: 'desc',
        },
      })

      if (getLastMonthPayment) {
        const lastPaymentDate = new Date(getLastMonthPayment.jatuhTempo)
        // Loop through each month
        for (let i = -1; i < numberOfMonths; i++) {
          const currentMonth = startDate.getMonth() + i + 1
          const currentDate = new Date(startDate.getFullYear(), currentMonth, 1)
          await prisma.historyPembayaranSpp.create({
            data: {
              pembayaranSppId: pembayaranSpp.id,
              jatuhTempo: currentDate,
              jumlah: parseInt(jumlahspp),
              sudahDibayar: false,
              updatedBy: Number(updatedBy),
            },
          })
        }
      } else {
        res.status(500).json({ message: 'Last Month Payment Not Found' })
      }

      res.status(200).json({ message: 'Generate successful' })
    } else if (!pembayaranSpp) {
      res.status(500).json({ message: 'pembayaran SPP Id Not Found' })
    }

    // Return a success or failed message
    res.status(200).json({ message: 'Update successful', updateNaikKelas })
  } else {
    res.status(405).json({ message: 'Method not allowed' })
  }
}
