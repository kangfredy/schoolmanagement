import axios from 'axios'

export const getHistoryPembayaranSpp = () => {
  return new Promise<any>((resolve, reject) => {
    axios
      .get('/api/historyPembayaranSpp/historyPembayaranSppData')
      .then(response => resolve(response))
      .catch(error => reject(error))
  })
}

export const historyPembayaranSppByPembayaranSppId = (
  pembayaranSppId: number,
) => {
  return new Promise<any>((resolve, reject) => {
    axios
      .get(
        '/api/historyPembayaranSpp/historyPembayaranSppByPembayaranSppId?pembayaranSppId=' +
          pembayaranSppId,
      )
      .then(response => resolve(response))
      .catch(error => reject(error))
  })
}

export const tambahHistoryPembayaranSpp = (payload: any) => {
  return new Promise<any>((resolve, reject) => {
    axios
      .post('/api/historyPembayaranSpp/historyPembayaranSppTambah', payload)
      .then(response => resolve(response))
      .catch(error => reject(error))
  })
}

export const dataHistoryPembayaranSppDelete = (payload: any) => {
  return new Promise<any>((resolve, reject) => {
    axios
      .post('/api/historyPembayaranSpp/historyPembayaranSppDelete', payload)
      .then(response => resolve(response))
      .catch(error => reject(error))
  })
}

export const dataHistoryPembayaranSppUpdate = (payload: any) => {
  return new Promise<any>((resolve, reject) => {
    axios
      .post('/api/historyPembayaranSpp/historyPembayaranSppUpdate', payload)
      .then(response => resolve(response))
      .catch(error => reject(error))
  })
}
