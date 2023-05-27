import axios from "axios";

export const getDataKelas = () => {
  return new Promise<any>((resolve, reject) => {
    axios
      .get("/api/kelasData")
      .then((response) => resolve(response))
      .catch((error) => reject(error));
  });
};

export const getDetailKelas  = (payload: any) => {
  return new Promise<any>((resolve, reject) => {
      axios.post('/api/kelasDetail', payload)
      .then(response => resolve(response))
      .catch((error) => reject(error))
  })
}

export const tambahKelas = (payload: any) => {
  return new Promise<any>((resolve, reject) => {
    axios
      .post("/api/kelasTambah", payload)
      .then((response) => resolve(response))
      .catch((error) => reject(error));
  });
};

export const dataKelasDelete = (payload: any) => {
  return new Promise<any>((resolve, reject) => {
    axios
      .post("/api/kelasDelete", payload)
      .then((response) => resolve(response))
      .catch((error) => reject(error));
  });
};

export const dataKelasUpdate = (payload: any) => {
  return new Promise<any>((resolve, reject) => {
    axios
      .post("/api/kelasUpdate", payload)
      .then((response) => resolve(response))
      .catch((error) => reject(error));
  });
};
