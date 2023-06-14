export interface Ikelas {
  id: number
  namaKelas: string
  updatedBy: number
  updatedAt: string
  user: Iuser
  jurusan: Ijurusan
}

export interface Ijurusan {
  id: number
  namaJurusan: string
}

export interface Iuser {
  id: number
  username: string
  role: string
}
