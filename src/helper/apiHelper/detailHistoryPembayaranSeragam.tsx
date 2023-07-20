import axios from 'axios'

export const getDetailHistoryPembayaranSeragam = () => {
  return new Promise<any>((resolve, reject) => {
    axios
      .get(
        '/api/detailHistoryPembayaranSeragam/detailHistoryPembayaranSeragamData',
      )
      .then(response => resolve(response))
      .catch(error => reject(error))
  })
}

export const detailHistoryPembayaranSeragamByPembayaranSeragamId = (
  pembayaranSeragamId: number,
) => {
  return new Promise<any>((resolve, reject) => {
    axios
      .get(
        '/api/detailHistoryPembayaranSeragam/detailHistoryPembayaranSeragamByPembayaranSeragamId?pembayaranSeragamId=' +
          pembayaranSeragamId,
      )
      .then(response => resolve(response))
      .catch(error => reject(error))
  })
}

export const tambahDetailHistoryPembayaranSeragam = (payload: any) => {
  return new Promise<any>((resolve, reject) => {
    axios
      .post(
        '/api/detailHistoryPembayaranSeragam/detailHistoryPembayaranSeragamTambah',
        payload,
      )
      .then(response => resolve(response))
      .catch(error => reject(error))
  })
}

export const dataDetailHistoryPembayaranSeragamDelete = (payload: any) => {
  return new Promise<any>((resolve, reject) => {
    axios
      .post(
        '/api/detailHistoryPembayaranSeragam/detailHistoryPembayaranSeragamDelete',
        payload,
      )
      .then(response => resolve(response))
      .catch(error => reject(error))
  })
}

export const dataDetailHistoryPembayaranSeragamUpdate = (payload: any) => {
  return new Promise<any>((resolve, reject) => {
    axios
      .post(
        '/api/detailHistoryPembayaranSeragam/detailHistoryPembayaranSeragamUpdate',
        payload,
      )
      .then(response => resolve(response))
      .catch(error => reject(error))
  })
}
