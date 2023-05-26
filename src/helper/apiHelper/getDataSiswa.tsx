import axios from "axios"

export const getDataSiswa  = () => {
    return new Promise<any>((resolve, reject) => {
        axios.get('/api/dataSiswaData')
        .then(response => resolve(response))
        .catch((error) => reject(error))
    })
}