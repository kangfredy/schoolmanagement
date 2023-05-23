import {PrismaClient} from '@prisma/client'
import type { NextApiRequest, NextApiResponse } from 'next'

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
      const { nama, alamat, tanggalMasuk, kelasId, jenisKelamin, agama } = req.body;
  
      // Create Kelas Baru
      const tambahSiswaData = await prisma.dataSiswa.create({data: {
        nama: nama,
        alamat: alamat,
        tanggalMasuk: tanggalMasuk,
        kelasId: kelasId,
        jenisKelamin: jenisKelamin,
        agama: agama
      }})
  
      // Return a success message or user data
      res.status(200).json({ message: 'Create successful', tambahSiswaData });
    } else {
      res.status(405).json({ message: 'Method not allowed' });
    }
  }



