export interface Isiswa {
  id: number
  nim: string
  nama: string
  alamat: string
  tanggalMasuk: string
  tanggalLahir: string
  jenisKelamin: number
  jenisKelaminDisplay: string | ''
  agama: number
  agamaDisplay: string | ''
  kelas: Ikelas
  updatedBy: number
  updatedAt: string
  user: Iuser
}

export interface Ikelas {
  id: number
  namaKelas: string
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
