import {PrismaClient} from '@prisma/client'
import type { NextApiRequest, NextApiResponse } from 'next'

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        const { id, pembayaranSeragamId, jumlahDiBayar, seragamId, tanggalPembayaran } = req.body;
  
      // Update Data
      const updateHistoryPembayaranSeragam = await prisma.historyPembayaranSeragam.update({
        where: {
          id: id,
        },
        data: {
          pembayaranSeragamId: pembayaranSeragamId,
          seragamId: seragamId,
          jumlahDiBayar: jumlahDiBayar,
          tanggalPembayaran: tanggalPembayaran
        },
      })
  
      // Return a success or failed message
      res.status(200).json({ message: 'Update successful', updateHistoryPembayaranSeragam });
    } else {
      res.status(405).json({ message: 'Method not allowed' });
    }
  }



