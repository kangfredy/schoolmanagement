import axios from 'axios'

export const getPembayaranSpp = () => {
  return new Promise<any>((resolve, reject) => {
    axios
      .get('/api/pembayaranSpp/pembayaranSppData')
      .then(response => resolve(response))
      .catch(error => reject(error))
  })
}

export const getDetailPembayaranSpp = (payload: any) => {
  return new Promise<any>((resolve, reject) => {
    axios
      .post('/api/pembayaranSpp/pembayaranSppDetail', payload)
      .then(response => resolve(response))
      .catch(error => reject(error))
  })
}

export const tambahPembayaranSpp = (payload: any) => {
  return new Promise<any>((resolve, reject) => {
    axios
      .post('/api/pembayaranSpp/pembayaranSppTambah', payload)
      .then(response => resolve(response))
      .catch(error => reject(error))
  })
}

export const pembayaranSppGenerate = (
  idSiswa: number,
  dateSiwwaMasuk: string,
  updatedBy: number,
) => {
  return new Promise<any>((resolve, reject) => {
    axios
      .get(
        '/api/pembayaranSpp/pembayaranSppGenerate?idSiswa=' +
          idSiswa +
          '&dateSiwwaMasuk=' +
          dateSiwwaMasuk +
          '&updatedBy=' +
          updatedBy,
      )
      .then(response => resolve(response))
      .catch(error => reject(error))
  })
}

export const dataPembayaranSppNaikKelas = (payload: any) => {
  return new Promise<any>((resolve, reject) => {
    axios
      .post('/api/pembayaranSpp/pembayaranSPPNaikKelas', payload)
      .then(response => resolve(response))
      .catch(error => reject(error))
  })
}

export const dataPembayaranSppDelete = (payload: any) => {
  return new Promise<any>((resolve, reject) => {
    axios
      .post('/api/pembayaranSpp/pembayaranSppDelete', payload)
      .then(response => resolve(response))
      .catch(error => reject(error))
  })
}

export const dataPembayaranSppUpdate = (payload: any) => {
  return new Promise<any>((resolve, reject) => {
    axios
      .post('/api/pembayaranSpp/pembayaranSppUpdate', payload)
      .then(response => resolve(response))
      .catch(error => reject(error))
  })
}

export const dataPembayaranSppReCalculate = (payload: any) => {
  return new Promise<any>((resolve, reject) => {
    axios
      .post('/api/pembayaranSpp/pembayaranSppReCalculate', payload)
      .then(response => resolve(response))
      .catch(error => reject(error))
  })
}
