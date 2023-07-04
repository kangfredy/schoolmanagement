import { Dispatch, SetStateAction } from 'react'
import { ISpp } from '@/interface/ui/state/dataSppTable'
import { IHistorySpp } from '../state/dataHistorySppTable'
import { ISelect } from '@/interface/ui/component/dropdown'

export interface ModalPrintPembayaranSppProps {
  open: boolean
  action: string
  setOpen: Dispatch<SetStateAction<boolean>>
  getData: () => any
  setDataSppInput: Dispatch<SetStateAction<ISpp>>
  dataSppInput: ISpp
  setDataHistorySpp: Dispatch<SetStateAction<IHistorySpp[]>>
  dataHistorySpp: IHistorySpp[]
  setDataHistorySppSelect: Dispatch<SetStateAction<ISelect[]>>
  dataHistorySppSelect: ISelect[]
  showModal: (data: ISpp) => void
  getHistoryPembayaranSppByPembayaranSppId: (id: number) => void
}
