import axios from "axios";

export const getJurusan = () => {
  return new Promise<any>((resolve, reject) => {
    axios
      .get("/api/jurusan/jurusanData")
      .then((response) => resolve(response))
      .catch((error) => reject(error));
  });
};

export const getDetailJurusan  = (payload: any) => {
    return new Promise<any>((resolve, reject) => {
        axios.post('/api/jurusan/jurusanDetail', payload)
        .then(response => resolve(response))
        .catch((error) => reject(error))
    })
  }

export const tambahJurusan = (payload: any) => {
  return new Promise<any>((resolve, reject) => {
    axios
      .post("/api/jurusan/jurusanTambah", payload)
      .then((response) => resolve(response))
      .catch((error) => reject(error));
  });
};

export const dataJurusanDelete = (payload: any) => {
  return new Promise<any>((resolve, reject) => {
    axios
      .post("/api/jurusan/jurusanDelete", payload)
      .then((response) => resolve(response))
      .catch((error) => reject(error));
  });
};

export const dataJurusanUpdate = (payload: any) => {
  return new Promise<any>((resolve, reject) => {
    axios
      .post("/api/jurusan/jurusanUpdate", payload)
      .then((response) => resolve(response))
      .catch((error) => reject(error));
  });
};
