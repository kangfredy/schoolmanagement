import {PrismaClient} from '@prisma/client'
import type { NextApiRequest, NextApiResponse } from 'next'

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
      const { pembayaranSeragamId, jumlahDiBayar, seragamId, tanggalPembayaran } = req.body;
  
      // Create Data Baru
      const tambahHistoryPembayaranSeragam = await prisma.historyPembayaranSeragam.create({data: {
        pembayaranSeragamId: pembayaranSeragamId,
        seragamId: seragamId,
        jumlahDiBayar: jumlahDiBayar,
        tanggalPembayaran: tanggalPembayaran
      }})
  
      // Return a success or failed message
      res.status(200).json({ message: 'Create successful', tambahHistoryPembayaranSeragam });
    } else {
      res.status(405).json({ message: 'Method not allowed' });
    }
  }



