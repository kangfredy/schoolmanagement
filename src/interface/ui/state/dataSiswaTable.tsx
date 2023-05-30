export interface Isiswa {
  id: number
  nim: string
  nama: string
  alamat: string
  tanggalMasuk: string
  tanggalLahir: string
  jenisKelamin: number
  agama: string
  kelas: Ikelas
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
