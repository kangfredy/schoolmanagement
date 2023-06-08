import { PrismaClient } from '@prisma/client'
import type { NextApiRequest, NextApiResponse } from 'next'

const prisma = new PrismaClient()

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === 'POST') {
    const { nama, harga } = req.body

    // Create Data Baru
    const tambahSeragam = await prisma.seragam.create({
      data: {
        nama: nama,
        harga: harga,
      },
    })

    // Return a success or failed message
    res.status(200).json({ message: 'Create successful', tambahSeragam })
  } else {
    res.status(405).json({ message: 'Method not allowed' })
  }
}
