import { PrismaClient } from '@prisma/client'
import type { NextApiRequest, NextApiResponse } from 'next'

const prisma = new PrismaClient()

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === 'GET') {
    const currentMonth = new Date().getMonth() + 1;
  
    // Get Data
    const getHistoryPembayaranSpp = await prisma.historyPembayaranSpp.findMany({
      where: {
        isDeleted: false,
        sudahDibayar: false,
        jatuhTempo:{
            gte: new Date(new Date().getFullYear(), currentMonth - 1, 1),
            lt: new Date(new Date().getFullYear(), currentMonth, 1),
          },
      },
      include: {
        pembayaranSpp: {
            select: {
                siswa: {
                    select: {
                        nama: true,
                        kelas: {
                            select: {
                                namaKelas: true,
                                jurusan: {
                                    select: {
                                        namaJurusan: true
                                    }
                                }
                            }
                        }
                    }
                }
            }
        },
        user: {
          select: {
            username: true,
          },
        },
      },
    })

    // Return a success or failed message
    res
      .status(200)
      .json({ message: 'Get Data successful', getHistoryPembayaranSpp })
  } else {
    res.status(405).json({ message: 'Method not allowed' })
  }
}
