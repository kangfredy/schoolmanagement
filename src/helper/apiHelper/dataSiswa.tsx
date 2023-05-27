import axios from "axios"

export const getDataSiswa  = () => {
    return new Promise<any>((resolve, reject) => {
        axios.get('/api/dataSiswaData')
        .then(response => resolve(response))
        .catch((error) => reject(error))
    })
}

export const getDetailSiswa  = (payload: any) => {
  return new Promise<any>((resolve, reject) => {
      axios.post('/api/dataSiswaDetail', payload)
      .then(response => resolve(response))
      .catch((error) => reject(error))
  })
}

export const tambahSiswa = (payload: any) => {
  return new Promise<any>((resolve, reject) => {
    axios
      .post("/api/dataSiswaTambah", payload)
      .then((response) => resolve(response))
      .catch((error) => reject(error));
  });
};

export const dataSiswaDelete = (payload: any) => {
  return new Promise<any>((resolve, reject) => {
    axios
      .post("/api/dataSiswaDelete", payload)
      .then((response) => resolve(response))
      .catch((error) => reject(error));
  });
};

export const dataSiswaUpdate = (payload: any) => {
  return new Promise<any>((resolve, reject) => {
    axios
      .post("/api/dataSiswaUpdate", payload)
      .then((response) => resolve(response))
      .catch((error) => reject(error));
  });
};