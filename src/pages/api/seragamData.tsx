import {PrismaClient} from '@prisma/client'
import type { NextApiRequest, NextApiResponse } from 'next'

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'GET') {
  
      // Get Data
      const getSeragam = await prisma.seragam.findMany({
        where: {
          isDeleted: false,
        }
      })
  
      // Return a success or failed message
      res.status(200).json({ message: 'Get Data successful', getSeragam });
    } else {
      res.status(405).json({ message: 'Method not allowed' });
    }
  }



