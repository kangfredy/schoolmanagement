import axios from "axios";

export const getJurusan = () => {
  return new Promise<any>((resolve, reject) => {
    axios
      .get("/api/jurusanData")
      .then((response) => resolve(response))
      .catch((error) => reject(error));
  });
};

export const getDetailJurusan  = (payload: any) => {
    return new Promise<any>((resolve, reject) => {
        axios.post('/api/jurusanDetail', payload)
        .then(response => resolve(response))
        .catch((error) => reject(error))
    })
  }

export const tambahJurusan = (payload: any) => {
  return new Promise<any>((resolve, reject) => {
    axios
      .post("/api/jurusanTambah", payload)
      .then((response) => resolve(response))
      .catch((error) => reject(error));
  });
};

export const dataJurusanDelete = (payload: any) => {
  return new Promise<any>((resolve, reject) => {
    axios
      .post("/api/jurusanDelete", payload)
      .then((response) => resolve(response))
      .catch((error) => reject(error));
  });
};

export const dataJurusanUpdate = (payload: any) => {
  return new Promise<any>((resolve, reject) => {
    axios
      .post("/api/jurusanUpdate", payload)
      .then((response) => resolve(response))
      .catch((error) => reject(error));
  });
};
