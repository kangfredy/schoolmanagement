import {PrismaClient} from '@prisma/client'
import type { NextApiRequest, NextApiResponse } from 'next'

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
      const { namaKelas } = req.body;
  
      // Create Data Baru
      const tambahKelas = await prisma.kelas.create({data: {
        namaKelas: namaKelas
      }})
  
      // Return a success or failed message
      res.status(200).json({ message: 'Create successful', tambahKelas });
    } else {
      res.status(405).json({ message: 'Method not allowed' });
    }
  }



