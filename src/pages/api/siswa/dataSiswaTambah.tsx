import { PrismaClient } from '@prisma/client'
import type { NextApiRequest, NextApiResponse } from 'next'

const prisma = new PrismaClient()

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === 'POST') {
    const {
      nim,
      nama,
      alamat,
      tanggalMasuk,
      tanggalLahir,
      kelasId,
      jenisKelamin,
      agama,
      asalSekolah,
      updatedBy,
    } = req.body

    // Create Data Baru
    const tambahSiswaData = await prisma.dataSiswa.create({
      data: {
        nama: nama,
        nim: nim,
        alamat: alamat,
        asalSekolah: asalSekolah,
        tanggalMasuk: tanggalMasuk,
        tanggalLahir: tanggalLahir,
        kelasId: kelasId,
        jenisKelamin: jenisKelamin,
        agama: agama,
        updatedBy: Number(updatedBy),
      },
    })

    // Return a success or failed message
    res.status(200).json({ message: 'Create successful', tambahSiswaData })
  } else {
    res.status(405).json({ message: 'Method not allowed' })
  }
}
