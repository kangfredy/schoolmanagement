export interface IDataJurusanModal {
  id?: number
  namaJurusan: string
  updatedAt?: string
  updatedBy: number
}

export interface IJurusan {
  id: number
  namaJurusan: string
  updatedBy: number
  updatedAt: string
  user: Iuser
}

export interface Iuser {
  id: number
  username: string
  role: string
}
