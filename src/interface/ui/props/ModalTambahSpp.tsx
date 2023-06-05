import { Dispatch, SetStateAction } from 'react'
import { IDataSppModal } from '../state/dataSppModal'
import { IHistorySpp } from '../state/dataHistorySppTable'
import { ISelect } from '@/interface/ui/component/dropdown'

export interface ModalTambahSppProps {
  open: boolean
  action: string
  setOpen: Dispatch<SetStateAction<boolean>>
  getData: () => any
  setDataSppInput: Dispatch<SetStateAction<IDataSppModal>>
  dataSppInput: IDataSppModal
  setDataHistorySpp: Dispatch<SetStateAction<IHistorySpp[]>>
  dataHistorySpp: IHistorySpp[]
  setDataHistorySppSelect: Dispatch<SetStateAction<ISelect[]>>
  dataHistorySppSelect: ISelect[]
  getHistoryPembayaranSppByPembayaranSppId: Dispatch<SetStateAction<number>>
}
