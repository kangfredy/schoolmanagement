import {PrismaClient} from '@prisma/client'
import type { NextApiRequest, NextApiResponse } from 'next'

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'GET') {
  
      // Get Data
      const getPembayaranSeragam = await prisma.pembayaranSeragam.findMany({
        where: {
            isDeleted: false,
          },
        include: {
            siswa: true
          }
      })
  
      // Return a success or failed message
      res.status(200).json({ message: 'Get Data successful', getPembayaranSeragam });
    } else {
      res.status(405).json({ message: 'Method not allowed' });
    }
  }


