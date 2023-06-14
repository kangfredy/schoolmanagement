import { PrismaClient } from '@prisma/client'
import type { NextApiRequest, NextApiResponse } from 'next'

const prisma = new PrismaClient()

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === 'GET') {
    // Get Data
    const getPembayaranSpp = await prisma.pembayaranSpp.findMany({
      where: {
        isDeleted: false,
      },
      include: {
        siswa: {
          include: {
            kelas: {
              include: {
                jurusan: true,
              },
            },
          },
        },
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
    res.status(200).json({ message: 'Get Data successful', getPembayaranSpp })
  } else {
    res.status(405).json({ message: 'Method not allowed' })
  }
}
