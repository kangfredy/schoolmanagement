export interface IDataSeragamnModal {
  id?: number
  nama: string
  harga: number
  updatedAt?: string
  updatedBy: number
}

export interface ISeragam {
  id: number
  nama: string
  harga: number
  updatedBy: number
  updatedAt: string
  user: Iuser
}

export interface Iuser {
  id: number
  username: string
  role: string
}