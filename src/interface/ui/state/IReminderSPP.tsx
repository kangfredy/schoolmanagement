
export interface IReminderSPP {
    id: number
    isDelete: boolean
    jatuhTempo: string
    jumlah: number
    pembayaranSppId: number
    sudahDibayar: boolean
    tanggalPembayaran: string
    updateAt: string
    updateBy: number
    pembayaranSpp: IPembayaranSpp
}

export interface IPembayaranSpp {
    siswa: ISiswa
}

export interface ISiswa {
    nama: string
    kelas: IKelas
}

export interface IKelas {
jurusan: IJurusan
namaKelas: string
}

export interface IJurusan {
    namaJurusan: string
}