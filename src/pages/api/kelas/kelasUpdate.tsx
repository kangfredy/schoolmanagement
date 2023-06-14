import { PrismaClient } from '@prisma/client'
import type { NextApiRequest, NextApiResponse } from 'next'

const prisma = new PrismaClient()

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === 'POST') {
    const { id, namaKelas, jurusanId, updatedBy } = req.body

    // Update Data
    const updateKelas = await prisma.kelas.update({
      where: {
        id: id,
      },
      data: {
        namaKelas: namaKelas,
        jurusanId: jurusanId,
        updatedBy: updatedBy,
      },
    })

    // Return a success or failed message
    res.status(200).json({ message: 'Update successful', updateKelas })
  } else {
    res.status(405).json({ message: 'Method not allowed' })
  }
}
