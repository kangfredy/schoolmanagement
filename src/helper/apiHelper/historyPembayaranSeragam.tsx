import axios from 'axios'

export const getHistoryPembayaranSeragam = () => {
  return new Promise<any>((resolve, reject) => {
    axios
      .get('/api/historyPembayaranSeragam/historyPembayaranSeragamData')
      .then(response => resolve(response))
      .catch(error => reject(error))
  })
}

export const historyPembayaranSeragamByPembayaranSeragamId = (
  pembayaranSeragamId: number,
) => {
  return new Promise<any>((resolve, reject) => {
    axios
      .get(
        '/api/historyPembayaranSeragam/historyPembayaranSeragamByPembayaranSeragamId?pembayaranSeragamId=' +
          pembayaranSeragamId,
      )
      .then(response => resolve(response))
      .catch(error => reject(error))
  })
}

export const historyPembayaranSeragamBySiswaId = (siswaId: number) => {
  return new Promise<any>((resolve, reject) => {
    axios
      .get(
        '/api/historyPembayaranSeragam/historyPembayaranSeragamBySiswaId?siswaId=' +
          siswaId,
      )
      .then(response => resolve(response))
      .catch(error => reject(error))
  })
}

export const tambahHistoryPembayaranSeragam = (
  payload: any,
  siswaId: number,
  tunggakan: number,
  totalBayar: number,
) => {
  return new Promise<any>((resolve, reject) => {
    axios
      .post('/api/historyPembayaranSeragam/historyPembayaranSeragamTambah', {
        ...payload,
        siswaId: siswaId,
        tunggakan: tunggakan,
        totalBayar: totalBayar,
      })
      .then(response => resolve(response))
      .catch(error => reject(error))
  })
}

export const dataHistoryPembayaranSeragamDelete = (
  payload: any,
  siswaId: number,
  tunggakan: number,
  totalBayar: number,
) => {
  return new Promise<any>((resolve, reject) => {
    axios
      .post('/api/historyPembayaranSeragam/historyPembayaranSeragamDelete', {
        ...payload,
        siswaId: siswaId,
        tunggakan: tunggakan,
        totalBayar: totalBayar,
      })
      .then(response => resolve(response))
      .catch(error => reject(error))
  })
}

export const dataHistoryPembayaranSeragamUpdate = (
  payload: any,
  siswaId: number,
  tunggakan: number,
  totalBayar: number,
  jumlahDiBayarAwal: number,
) => {
  return new Promise<any>((resolve, reject) => {
    axios
      .post('/api/historyPembayaranSeragam/historyPembayaranSeragamUpdate', {
        ...payload,
        siswaId: siswaId,
        tunggakan: tunggakan,
        totalBayar: totalBayar,
        jumlahDiBayarAwal: jumlahDiBayarAwal,
      })
      .then(response => resolve(response))
      .catch(error => reject(error))
  })
}
