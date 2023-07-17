import { PrismaClient } from '@prisma/client'
import type { NextApiRequest, NextApiResponse } from 'next'

const prisma = new PrismaClient()

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === 'POST') {
    const { id, nama, updatedBy } = req.body

    // Update Data
    const updateSeragam = await prisma.seragam.update({
      where: {
        id: id,
      },
      data: {
        nama: nama,
        updatedBy: Number(updatedBy),
      },
    })

    // Return a success or failed message
    res.status(200).json({ message: 'Update successful', updateSeragam })
  } else {
    res.status(405).json({ message: 'Method not allowed' })
  }
}
