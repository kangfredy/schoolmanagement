import { Dispatch, SetStateAction } from 'react'
import {
  IDataSeragamnModal,
  ISeragam,
} from '@/interface/ui/state/dataSeragamModal'
import { IPembayaranSeragam } from '../state/dataPembayaranSeragamTable'
import { IDetailHistorySeragam } from '../state/dataDetailHistorySeragamTable'

export interface ModalDetailHistoryPembayaranSeragamProps {
  open: boolean
  action: string
  setOpen: Dispatch<SetStateAction<boolean>>
  getData: () => any
  setDataSeragam: Dispatch<SetStateAction<ISeragam[]>>
  dataSeragam: ISeragam[]
  setDataDetailHistoryPembayaranSeragam: Dispatch<
    SetStateAction<IDetailHistorySeragam[]>
  >
  dataDetailHistoryPembayaranSeragam: IDetailHistorySeragam[]
  setDataInputFilteredSeragam: Dispatch<SetStateAction<ISeragam[]>>
  dataInputFilteredSeragam: ISeragam[]
  setDataPembayaranSeragamInput: Dispatch<SetStateAction<IPembayaranSeragam>>
  dataPembayaranSeragamInput: IPembayaranSeragam
  showModal: (action: string, data: IPembayaranSeragam) => void
  getHistoryPembayaranSeragamByPembayaranSeragamId: (
    id: number,
    action: string,
  ) => void
}
