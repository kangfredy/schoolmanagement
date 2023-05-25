import {PrismaClient} from '@prisma/client'
import type { NextApiRequest, NextApiResponse } from 'next'

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
      const { pembayaranSppId, jatuhTempo, jumlah, sudahDibayar, tanggalPembayaran } = req.body;
  
      // Create Data Baru
      const tambahHistoryPembayaranSpp = await prisma.historyPembayaranSpp.create({data: {
        pembayaranSppId: pembayaranSppId,
        jatuhTempo: jatuhTempo,
        jumlah: jumlah,
        sudahDibayar: sudahDibayar,
        tanggalPembayaran: tanggalPembayaran
      }})
  
      // Return a success or failed message
      res.status(200).json({ message: 'Create successful', tambahHistoryPembayaranSpp });
    } else {
      res.status(405).json({ message: 'Method not allowed' });
    }
  }



