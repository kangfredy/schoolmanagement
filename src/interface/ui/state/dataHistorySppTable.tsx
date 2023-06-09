export interface IHistorySpp {
  id: number
  pembayaranSppId: number
  jatuhTempo: string
  jumlah: number
  sudahDibayar: boolean
  tanggalPembayaran: string
  pembayaranSpp: ISpp
  updatedBy: number
  updatedAt: string
  user: Iuser
}

export interface ISpp {
  id: number
  siswaId: number
  tunggakan: number
  totalBayar: number
  siswa: Isiswa
}

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
