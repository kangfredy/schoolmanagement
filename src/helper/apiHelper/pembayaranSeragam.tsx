import axios from 'axios'

export const getPembayaranSeragam = () => {
  return new Promise<any>((resolve, reject) => {
    axios
      .get('/api/pembayaranSeragam/pembayaranSeragamData')
      .then(response => resolve(response))
      .catch(error => reject(error))
  })
}

export const getDetailPembayaranSeragam = (payload: any) => {
  return new Promise<any>((resolve, reject) => {
    axios
      .post('/api/pembayaranSeragam/pembayaranSeragamDetail', payload)
      .then(response => resolve(response))
      .catch(error => reject(error))
  })
}

export const tambahPembayaranSeragam = (payload: any) => {
  return new Promise<any>((resolve, reject) => {
    axios
      .post('/api/pembayaranSeragam/pembayaranSeragamTambah', payload)
      .then(response => resolve(response))
      .catch(error => reject(error))
  })
}

export const dataPembayaranSeragamDelete = (payload: any) => {
  return new Promise<any>((resolve, reject) => {
    axios
      .post('/api/pembayaranSeragam/pembayaranSeragamDelete', payload)
      .then(response => resolve(response))
      .catch(error => reject(error))
  })
}

export const dataPembayaranSeragamUpdate = (payload: any) => {
  return new Promise<any>((resolve, reject) => {
    axios
      .post('/api/pembayaranSeragam/pembayaranSeragamUpdate', payload)
      .then(response => resolve(response))
      .catch(error => reject(error))
  })
}
