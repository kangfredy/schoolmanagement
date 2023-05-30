import axios from 'axios'

export const getDataSeragam = () => {
  return new Promise<any>((resolve, reject) => {
    axios
      .get('/api/seragam/seragamData')
      .then(response => resolve(response))
      .catch(error => reject(error))
  })
}

export const getDetailSeragam = (payload: any) => {
  return new Promise<any>((resolve, reject) => {
    axios
      .post('/api/seragam/seragamDetail', payload)
      .then(response => resolve(response))
      .catch(error => reject(error))
  })
}

export const tambahSeragam = (payload: any) => {
  return new Promise<any>((resolve, reject) => {
    axios
      .post('/api/seragam/seragamTambah', payload)
      .then(response => resolve(response))
      .catch(error => reject(error))
  })
}

export const dataSeragamDelete = (payload: any) => {
  return new Promise<any>((resolve, reject) => {
    axios
      .post('/api/seragam/seragamDelete', payload)
      .then(response => resolve(response))
      .catch(error => reject(error))
  })
}

export const dataSeragamUpdate = (payload: any) => {
  return new Promise<any>((resolve, reject) => {
    axios
      .post('/api/seragam/seragamUpdate', payload)
      .then(response => resolve(response))
      .catch(error => reject(error))
  })
}
