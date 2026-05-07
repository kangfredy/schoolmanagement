import { PrismaClient } from '@prisma/client'
import type { NextApiRequest, NextApiResponse } from 'next'

const prisma = new PrismaClient()

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === 'GET') {
    const page = parseInt(req.query.page as string) || 1
    const pageSize = parseInt(req.query.pageSize as string) || 10
    const searchColumn = req.query.searchColumn as string
    const searchText = req.query.searchText as string

    const currentMonth = new Date().getMonth() + 1;
  
    const where: any = {
      isDeleted: false,
      sudahDibayar: false,
      jatuhTempo:{
          gte: new Date(new Date().getFullYear(), currentMonth - 1, 1),
          lt: new Date(new Date().getFullYear(), currentMonth, 1),
        },
    }

    if (searchColumn && searchText) {
      if (searchColumn === 'pembayaranSpp,siswa,nama') {
        where.pembayaranSpp = { siswa: { nama: { contains: searchText } } }
      } else if (searchColumn === 'pembayaranSpp,siswa,kelas,namaKelas') {
        where.pembayaranSpp = { siswa: { kelas: { namaKelas: { contains: searchText } } } }
      } else if (searchColumn === 'pembayaranSpp,siswa,kelas,jurusan,namaJurusan') {
        where.pembayaranSpp = { siswa: { kelas: { jurusan: { namaJurusan: { contains: searchText } } } } }
      } else if (searchColumn === 'user,username') {
        where.user = { username: { contains: searchText } }
      }
    } else if (searchText) {
      where.pembayaranSpp = { siswa: { nama: { contains: searchText } } }
    }

    try {
      const skip = (page - 1) * pageSize
      const getHistoryPembayaranSpp = await prisma.historyPembayaranSpp.findMany({
          where,
          skip,
          take: pageSize + 1,
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

      
      const hasNextPage = getHistoryPembayaranSpp.length > pageSize
      const data = hasNextPage ? getHistoryPembayaranSpp.slice(0, pageSize) : getHistoryPembayaranSpp
      res.status(200).json({ message: 'Get Data successful', getHistoryPembayaranSpp: data, hasNextPage })
    } catch (error) {
      res.status(500).json({ message: 'Error retrieving data' })
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' })
  }
}
