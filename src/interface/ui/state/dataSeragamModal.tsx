export interface IDataSeragamnModal {
  id?: number
  nama: string
  updatedAt?: string
  updatedBy: number
}

export interface ISeragam {
  id: number
  nama: string
  updatedBy: number
  updatedAt: string
  user: Iuser
}

export interface Iuser {
  id: number
  username: string
  role: string
}
