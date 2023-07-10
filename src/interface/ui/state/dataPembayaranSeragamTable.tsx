export interface IPembayaranSeragam {
  id: number
  siswaId: number
  tunggakan: number
  totalBayar: number
  siswa: Isiswa
  updatedBy: number
  updatedAt: string
  user: Iuser
}

export interface Isiswa {
  id: number
  nim: string
  nama: string
  asalSekolah: string
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
