import {PrismaClient} from '@prisma/client'
import type { NextApiRequest, NextApiResponse } from 'next'

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        const { id, pembayaranSppId, jatuhTempo, jumlah, sudahDibayar, tanggalPembayaran } = req.body;
  
      // Update Data
      const updateHistoryPembayaranSpp = await prisma.historyPembayaranSpp.update({
        where: {
          id: id,
        },
        data: {
            pembayaranSppId: pembayaranSppId,
            jatuhTempo: jatuhTempo,
            jumlah: jumlah,
            sudahDibayar: sudahDibayar,
            tanggalPembayaran: tanggalPembayaran
        },
      })
  
      // Return a success or failed message
      res.status(200).json({ message: 'Update successful', updateHistoryPembayaranSpp });
    } else {
      res.status(405).json({ message: 'Method not allowed' });
    }
  }



