import { Dispatch, SetStateAction } from 'react'
import { IHistorySeragam } from '@/interface/ui/state/dataHistorySeragamTable'
import { IPembayaranSeragam } from '../state/dataPembayaranSeragamTable'

export interface ModalEditHistorySeragamProps {
  open: boolean
  action: string
  setOpen: Dispatch<SetStateAction<boolean>>
  getData: () => any
  setDataRowHistorySeragam: Dispatch<SetStateAction<IHistorySeragam>>
  dataRowHistorySeragam: IHistorySeragam
  setDataPembayaranSeragamInput: Dispatch<SetStateAction<IPembayaranSeragam>>
  dataPembayaranSeragamInput: IPembayaranSeragam
  showModal: (action: string, data: IPembayaranSeragam) => void
}
