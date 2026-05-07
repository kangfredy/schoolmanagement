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
      if (searchColumn === 'namaKelas') {
        where.namaKelas = { contains: searchText }
      } else if (searchColumn === 'jurusan,namaJurusan') {
        where.jurusan = { namaJurusan: { contains: searchText } }
      } else if (searchColumn === 'user,username') {
        where.user = { username: { contains: searchText } }
      }
    } else if (searchText) {
      where.namaKelas = { contains: searchText }
    }

    try {
      const skip = (page - 1) * pageSize
      const getKelas = await prisma.kelas.findMany({
          where,
          skip,
          take: pageSize + 1,
          include: {
            jurusan: true,
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

      
      const hasNextPage = getKelas.length > pageSize
      const data = hasNextPage ? getKelas.slice(0, pageSize) : getKelas
      res.status(200).json({ message: 'Get Data successful', getKelas: data, hasNextPage })
    } catch (error) {
      res.status(500).json({ message: 'Error retrieving data' })
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' })
  }
}
