import {PrismaClient} from '@prisma/client'
import type { NextApiRequest, NextApiResponse } from 'next'

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
      const { id } = req.body;
  
      // Update Kelas
      const deleteSiswaData = await prisma.dataSiswa.update({
        where: {
          id: id,
        },
        data: {
            isDeleted: {
                set: true
            },
        },
      })
  
      // Return a success message or user data
      res.status(200).json({ message: 'Delete successful', deleteSiswaData });
    } else {
      res.status(405).json({ message: 'Method not allowed' });
    }
  }



