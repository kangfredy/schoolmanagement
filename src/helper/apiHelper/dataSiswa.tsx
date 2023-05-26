import axios from "axios"

export const getDataSiswa  = () => {
    return new Promise<any>((resolve, reject) => {
        axios.get('/api/dataSiswaData')
        .then(response => resolve(response))
        .catch((error) => reject(error))
    })
}

export const tambahSiswa = (payload) => {
    return new Promise<any>((respolve, reject)=> {
        axios.post('/api/dataSiswaTambah', payload)
        .then(response => resolve(response))
        .catch(error => reject(error))
    })
}

export const dataSiswaDelete = (payload) => {
    return new Promise<any>((resolve, reject) => {
        axios.post('/api/dataSiswaDelete', payload)
        .then(response => resolve(response))
        .catch(error => reject(error))
    })
}

export const dataSiswaUpdate = (payload) => {
    return new Promise<any>((resolve, reject) => {
        axios.post('/api/dataSiswaUpdate', payload)
        .then(response => resolve(response))
        .catch(error => reject(error))
    })
}