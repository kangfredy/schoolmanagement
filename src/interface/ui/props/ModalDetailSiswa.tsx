import { Dispatch, SetStateAction } from 'react'
import { Isiswa } from '../state/dataSiswaTable'

export interface IModalDetailSiswaProps {
  isOpen: boolean
  setIsOpen: Dispatch<SetStateAction<boolean>>
  DataSiswa: Isiswa
}
