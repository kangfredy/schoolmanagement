import { PrismaClient } from '@prisma/client'
import type { NextApiRequest, NextApiResponse } from 'next'

const prisma = new PrismaClient()

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === 'POST') {
    const { id, namaJurusan, updatedBy } = req.body

    // Update Data
    const updateJurusan = await prisma.jurusan.update({
      where: {
        id: id,
      },
      data: {
        namaJurusan: namaJurusan,
        updatedBy: updatedBy,
      },
    })

    // Return a success or failed message
    res.status(200).json({ message: 'Update successful', updateJurusan })
  } else {
    res.status(405).json({ message: 'Method not allowed' })
  }
}
