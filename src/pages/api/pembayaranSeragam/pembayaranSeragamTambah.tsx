import {PrismaClient} from '@prisma/client'
import type { NextApiRequest, NextApiResponse } from 'next'

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
      const { siswaId, Tunggakan, TotalBayar } = req.body;
  
      // Create Data Baru
      const tambahPembayaranSeragam = await prisma.pembayaranSeragam.create({data: {
        siswaId: siswaId,
        tunggakan: Tunggakan,
        totalBayar: TotalBayar
      }})
  
      // Return a success or failed message
      res.status(200).json({ message: 'Create successful', tambahPembayaranSeragam });
    } else {
      res.status(405).json({ message: 'Method not allowed' });
    }
  }



