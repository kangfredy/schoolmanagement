export interface IDataJurusanModal {
  id?: number
  namaJurusan: string
  updatedAt?: string
}

export interface IJurusan {
  id: number
  namaJurusan: string
  user: Iuser
  updatedAt: string
}

export interface Iuser {
  id: number
  username: string
  role: string
}
