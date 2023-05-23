import {PrismaClient} from '@prisma/client'
import type { NextApiRequest, NextApiResponse } from 'next'

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'GET') {
  
      // Get Siswa Data
      const dataSiswaData = await prisma.dataSiswa.findMany({
        where: {
          isDeleted: false,
        },
        include: {
            kelas: true
        }
      })

      // Return a success message or user data
      res.status(200).json({ message: 'Get Data successful', dataSiswaData });
    } else {
      res.status(405).json({ message: 'Method not allowed' });
    }
  }



