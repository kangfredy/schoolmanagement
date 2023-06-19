import { Dispatch, SetStateAction } from 'react'
import { IDataSiswaModal } from '../state/dataSiswaModal'

export interface ModalTambahSiswaProps {
  open: boolean
  action: string
  setOpen: Dispatch<SetStateAction<boolean>>
  getData: () => any
  setDataSiswaInput: Dispatch<SetStateAction<IDataSiswaModal>>
  dataSiswaInput: IDataSiswaModal
  initialClassId?: number
}
