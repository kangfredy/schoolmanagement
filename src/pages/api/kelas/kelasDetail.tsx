import { PrismaClient } from '@prisma/client'
import type { NextApiRequest, NextApiResponse } from 'next'

const prisma = new PrismaClient()

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === 'POST') {
    const { id } = req.body

    // Get Data
    const detailKelas = await prisma.kelas.findUnique({
      where: {
        id: id,
      },
      include: {
        jurusan: true,
        user: {
          select: {
            id: true,
            username: true,
            role: true,
            createdAt: true,
            updatedAt: true,
            isDeleted: true,
          },
        },
      },
    })

    // Return a success or failed message
    res.status(200).json({ message: 'Get Data successful', detailKelas })
  } else {
    res.status(405).json({ message: 'Method not allowed' })
  }
}
