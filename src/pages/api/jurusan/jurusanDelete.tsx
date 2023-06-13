import { PrismaClient } from '@prisma/client'
import type { NextApiRequest, NextApiResponse } from 'next'
import { getUserInfoWithNullCheck } from '@/helper/util/userInfo'

const prisma = new PrismaClient()

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === 'POST') {
    const { id, updatedBy } = req.body

    // Delete Data
    const deleteJurusan = await prisma.jurusan.update({
      where: {
        id: id,
      },
      data: {
        updatedBy: updatedBy,
        isDeleted: {
          set: true,
        },
      },
    })

    // Return a success or failed message
    res.status(200).json({ message: 'Delete successful', deleteJurusan })
  } else {
    res.status(405).json({ message: 'Method not allowed' })
  }
}
