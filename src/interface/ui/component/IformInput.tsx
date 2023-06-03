import { ReactNode } from 'react'

export interface IFormInput {
  label: string
  placeholder: string
  icons?: ReactNode
  isDisabled?: boolean
  values?: any
  onChange?: (e: any) => void
}
