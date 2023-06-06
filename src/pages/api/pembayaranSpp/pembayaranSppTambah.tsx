import {PrismaClient} from '@prisma/client'
import type { NextApiRequest, NextApiResponse } from 'next'

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
      const { siswaId, tunggakan, TotalBayar } = req.body;
  
      // Create Data Baru
      const tambahPembayaranSpp = await prisma.pembayaranSpp.create({data: {
        siswaId: siswaId,
        tunggakan: tunggakan,
        totalBayar: TotalBayar
      }})
  
      // Return a success or failed message
      res.status(200).json({ message: 'Create successful', tambahPembayaranSpp });
    } else {
      res.status(405).json({ message: 'Method not allowed' });
    }
  }



