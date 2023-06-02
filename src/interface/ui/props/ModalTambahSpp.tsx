import { Dispatch, SetStateAction } from 'react'
import { IDataSppModal } from '../state/dataSppModal'

export interface ModalTambahSppProps {
  open: boolean
  action: string
  setOpen: Dispatch<SetStateAction<boolean>>
  getData: () => any
  setDataSppInput: Dispatch<SetStateAction<IDataSppModal>>
  dataSppInput: IDataSppModal
}
