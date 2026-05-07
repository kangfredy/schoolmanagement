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

    const where: any = {
      isDeleted: false,
    }

    if (searchColumn && searchText) {
      if (searchColumn === 'nama') {
        where.nama = { contains: searchText }
      } else if (searchColumn === 'nisn') {
        where.nisn = { contains: searchText }
      } else if (searchColumn === 'kelas,namaKelas') {
        where.kelas = { namaKelas: { contains: searchText } }
      } else if (searchColumn === 'kelas,jurusan,namaJurusan') {
        where.kelas = { jurusan: { namaJurusan: { contains: searchText } } }
      } else if (searchColumn === 'user,username') {
        where.user = { username: { contains: searchText } }
      }
    } else if (searchText) {
      where.nama = { contains: searchText }
    }

    try {
      const skip = (page - 1) * pageSize
      const dataSiswaData = await prisma.dataSiswa.findMany({
          where,
          skip,
          take: pageSize + 1,
          include: {
            kelas: {
              include: {
                jurusan: true,
              },
            },
            user: {
              select: {
                id: true,
                username: true,
                role: true,
                createdAt: true,
                updatedAt: true,
                isDeleted: true,
              },
            },
          },
        })

      
      const hasNextPage = dataSiswaData.length > pageSize
      const data = hasNextPage ? dataSiswaData.slice(0, pageSize) : dataSiswaData
      res.status(200).json({ message: 'Get Data successful', dataSiswaData: data, hasNextPage })
    } catch (error) {
      res.status(500).json({ message: 'Error retrieving data' })
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' })
  }
}
