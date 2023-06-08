import { Dispatch, SetStateAction } from 'react'
import { IDataSeragamnModal } from '@/interface/ui/state/dataSeragamModal'

export interface ModalTambahSeragamBaruProps {
  open: boolean
  setOpen: Dispatch<SetStateAction<boolean>>
  getData: () => any
  setDataSeragamInput: Dispatch<SetStateAction<IDataSeragamnModal>>
  dataSeragamInput: IDataSeragamnModal
}
