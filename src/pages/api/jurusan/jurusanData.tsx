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
      if (searchColumn === 'namaJurusan') {
        where.namaJurusan = { contains: searchText }
      } else if (searchColumn === 'user,username') {
        where.user = { username: { contains: searchText } }
      } else if (searchColumn === 'updatedAt') {
        // usually search by date is tricky with string contains, so we might skip or do exact date match if needed
        // but for now, we'll leave it out or add simple text match if supported by schema
      }
    } else if (searchText) {
      where.namaJurusan = { contains: searchText }
    }

    try {
      const skip = (page - 1) * pageSize
      const getJurusan = await prisma.jurusan.findMany({
          where,
          skip,
          take: pageSize + 1,
          include: {
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

      
      const hasNextPage = getJurusan.length > pageSize
      const data = hasNextPage ? getJurusan.slice(0, pageSize) : getJurusan
      res.status(200).json({ message: 'Get Data successful', getJurusan: data, hasNextPage })
    } catch (error) {
      res.status(500).json({ message: 'Error retrieving data' })
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' })
  }
}
