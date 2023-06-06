import {PrismaClient} from '@prisma/client'
import type { NextApiRequest, NextApiResponse } from 'next'

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        const { id, siswaId, Tunggakan, TotalBayar } = req.body;
  
      // Update Data
      const updatePembayaranSeragam = await prisma.pembayaranSeragam.update({
        where: {
          id: id,
        },
        data: {
            siswaId: siswaId,
            tunggakan: Tunggakan,
            totalBayar: TotalBayar
        },
      })
  
      // Return a success or failed message
      res.status(200).json({ message: 'Update successful', updatePembayaranSeragam });
    } else {
      res.status(405).json({ message: 'Method not allowed' });
    }
  }



