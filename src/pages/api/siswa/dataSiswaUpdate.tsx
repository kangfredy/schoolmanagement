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
      nim,
      nama,
      alamat,
      tanggalMasuk,
      tanggalLahir,
      kelasId,
      jenisKelamin,
      asalSekolah,
      agama,
      updatedBy,
    } = req.body

    // Update Data
    const updateSiswaData = await prisma.dataSiswa.update({
      where: {
        id: id,
      },
      data: {
        nim: nim,
        nama: nama,
        alamat: alamat,
        tanggalMasuk: tanggalMasuk,
        asalSekolah: asalSekolah,
        tanggalLahir: tanggalLahir,
        kelasId: kelasId,
        jenisKelamin: jenisKelamin,
        agama: agama,
        updatedBy: Number(updatedBy),
      },
    })

    // Return a success or failed message
    res.status(200).json({ message: 'Update successful', updateSiswaData })
  } else {
    res.status(405).json({ message: 'Method not allowed' })
  }
}
