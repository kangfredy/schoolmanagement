import { Dispatch, SetStateAction } from 'react'
import { Isiswa } from '../state/dataSiswaTable'
import { IHistorySpp } from '../state/dataHistorySppTable'
import { IHistorySeragam } from '../state/dataHistorySeragamTable'

export interface IModalDetailSiswaProps {
  open: boolean
  setOpen: Dispatch<SetStateAction<boolean>>
  DataSiswa: Isiswa
  setDataHistorySpp: Dispatch<SetStateAction<IHistorySpp[]>>
  dataHistorySpp: IHistorySpp[]
  setDataHistorySeragam: Dispatch<SetStateAction<IHistorySeragam[]>>
  dataHistorySeragam: IHistorySeragam[]
  getHistoryPembayaranSppBySiswaId: (id: number) => void
}
