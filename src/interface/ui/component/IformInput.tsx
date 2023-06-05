import { ReactNode } from 'react'

export interface IFormInput {
  label: string
  placeholder: string
  icons?: ReactNode
  isDisabled?: boolean
  values?: any
  isArea?: boolean
  onChange: (e: any) => void
}
