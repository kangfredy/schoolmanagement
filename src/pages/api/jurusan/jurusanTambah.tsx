import { PrismaClient } from '@prisma/client'
import type { NextApiRequest, NextApiResponse } from 'next'

const prisma = new PrismaClient()

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === 'POST') {
    const { namaJurusan, updatedBy } = req.body

    // Create Data Baru
    const tambahJurusan = await prisma.jurusan.create({
      data: {
        namaJurusan: namaJurusan,
        updatedBy: updatedBy,
      },
    })

    // Return a success or failed message
    res.status(200).json({ message: 'Create successful', tambahJurusan })
  } else {
    res.status(405).json({ message: 'Method not allowed' })
  }
}
