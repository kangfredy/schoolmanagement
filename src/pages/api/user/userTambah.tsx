import { PrismaClient } from '@prisma/client'
import type { NextApiRequest, NextApiResponse } from 'next'
import bcrypt from "bcrypt"
const prisma = new PrismaClient()

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === 'POST') {
    const {
      username,
      password,
      role,
    } = req.body

    // Create Data Baru
    const user = await prisma.user.create({
      data: {
        username: username,
        password: await bcrypt.hash(password,10),
        role: role,
      },
    })

    // Return a success or failed message
    res.status(200).json({ message: 'Create successful', user })
  } else {
    res.status(405).json({ message: 'Method not allowed' })
  }
}
