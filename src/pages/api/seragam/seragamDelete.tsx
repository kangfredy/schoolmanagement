import { PrismaClient } from '@prisma/client'
import type { NextApiRequest, NextApiResponse } from 'next'

const prisma = new PrismaClient()

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === 'POST') {
    const { id, updatedBy } = req.body

    // Delete Data
    const deleteSeragam = await prisma.seragam.update({
      where: {
        id: id,
      },
      data: {
        updatedBy: Number(updatedBy),
        isDeleted: {
          set: true,
        },
      },
    })

    // Return a success or failed message
    res.status(200).json({ message: 'Delete successful', deleteSeragam })
  } else {
    res.status(405).json({ message: 'Method not allowed' })
  }
}
