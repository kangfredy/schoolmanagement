import { PrismaClient } from '@prisma/client'
import type { NextApiRequest, NextApiResponse } from 'next'

const prisma = new PrismaClient()

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === 'POST') {
    const { id, updatedBy } = req.body

    // Delete Data
    const deleteSiswaData = await prisma.dataSiswa.update({
      where: {
        id: id,
      },
      data: {
        updatedBy: Number(updatedBy),
        isDeleted: {
          set: true,
        },
      },
    })

    const getPembayaranSeragamIdBySiswaId =
      await prisma.pembayaranSeragam.findMany({
        where: {
          siswa: {
            id: id,
          },
        },
        select: {
          id: true,
        },
      })

    const pembayaranSeragamId = Number(getPembayaranSeragamIdBySiswaId[0].id)

    const deletePembayaranSeragam = await prisma.pembayaranSeragam.update({
      where: {
        id: pembayaranSeragamId,
      },
      data: {
        updatedBy: Number(updatedBy),
        isDeleted: {
          set: true,
        },
      },
    })

    const getPembayaranSppIdBySiswaId = await prisma.pembayaranSpp.findMany({
      where: {
        siswa: {
          id: id,
        },
      },
      select: {
        id: true,
      },
    })

    const pembayaranSppId = Number(getPembayaranSppIdBySiswaId[0].id)

    const deletePembayaranSpp = await prisma.pembayaranSpp.update({
      where: {
        id: pembayaranSppId,
      },
      data: {
        updatedBy: Number(updatedBy),
        isDeleted: {
          set: true,
        },
      },
    })

    const deleteHistoryPembayaranSppByPembayaranSppId =
      await prisma.historyPembayaranSpp.updateMany({
        where: {
          pembayaranSppId: pembayaranSppId,
          isDeleted: false,
        },
        data: {
          updatedBy: Number(updatedBy),
          isDeleted: true,
        },
      })

    // Return a success or failed message
    res.status(200).json({
      message: 'Delete successful',
      deleteSiswaData,
      getPembayaranSeragamIdBySiswaId,
      deletePembayaranSeragam,
      getPembayaranSppIdBySiswaId,
      deletePembayaranSpp,
      deleteHistoryPembayaranSppByPembayaranSppId,
    })
  } else {
    res.status(405).json({ message: 'Method not allowed' })
  }
}
