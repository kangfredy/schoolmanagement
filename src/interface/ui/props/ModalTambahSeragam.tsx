import { Dispatch, SetStateAction } from 'react'
import { IPembayaranSeragam } from '../state/dataPembayaranSeragamTable'
import { IHistorySeragam } from '../state/dataHistorySeragamTable'
import { ISeragam } from '@/interface/ui/state/dataSeragamModal'
import { IDetailHistorySeragam } from '../state/dataDetailHistorySeragamTable'

export interface ModalTambahSeragamProps {
  open: boolean
  action: string
  setOpen: Dispatch<SetStateAction<boolean>>
  getData: () => any
  setDataPembayaranSeragamInput: Dispatch<SetStateAction<IPembayaranSeragam>>
  dataPembayaranSeragamInput: IPembayaranSeragam
  setDataHistorySeragam: Dispatch<SetStateAction<IHistorySeragam[]>>
  dataHistorySeragam: IHistorySeragam[]
  setDataDetailHistoryPembayaranSeragam: Dispatch<
    SetStateAction<IDetailHistorySeragam[]>
  >
  dataDetailHistoryPembayaranSeragam: IDetailHistorySeragam[]

  setDataSeragam: Dispatch<SetStateAction<ISeragam[]>>
  dataSeragam: ISeragam[]
  setDataInputFilteredSeragam: Dispatch<SetStateAction<ISeragam[]>>
  dataInputFilteredSeragam: ISeragam[]
  showModal: (action: string, data: IPembayaranSeragam) => void
  getHistoryPembayaranSeragamByPembayaranSeragamId: (
    id: number,
    action: string,
  ) => void
}
