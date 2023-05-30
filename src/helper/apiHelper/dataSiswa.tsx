import axios from 'axios'

export const getDataSiswa = () => {
  return new Promise<any>((resolve, reject) => {
    axios
      .get('/api/siswa/dataSiswaData')
      .then(response => resolve(response))
      .catch(error => reject(error))
  })
}

export const getDetailSiswa = (payload: any) => {
  return new Promise<any>((resolve, reject) => {
    axios
      .post('/api/siswa/dataSiswaDetail', payload)
      .then(response => resolve(response))
      .catch(error => reject(error))
  })
}

export const tambahSiswa = (payload: any) => {
  return new Promise<any>((resolve, reject) => {
    axios
      .post('/api/siswa/dataSiswaTambah', payload)
      .then(response => resolve(response))
      .catch(error => reject(error))
  })
}

export const dataSiswaDelete = (payload: any) => {
  return new Promise<any>((resolve, reject) => {
    axios
      .post('/api/siswa/dataSiswaDelete', payload)
      .then(response => resolve(response))
      .catch(error => reject(error))
  })
}

export const dataSiswaUpdate = (payload: any) => {
  return new Promise<any>((resolve, reject) => {
    axios
      .post('/api/siswa/dataSiswaUpdate', payload)
      .then(response => resolve(response))
      .catch(error => reject(error))
  })
}
