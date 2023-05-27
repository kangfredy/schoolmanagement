import axios from "axios";

export const getDataKelas = () => {
  return new Promise<any>((resolve, reject) => {
    axios
      .get("/api/kelas/kelasData")
      .then((response) => resolve(response))
      .catch((error) => reject(error));
  });
};

export const getDetailKelas  = (payload: any) => {
  return new Promise<any>((resolve, reject) => {
      axios.post('/api/kelas/kelasDetail', payload)
      .then(response => resolve(response))
      .catch((error) => reject(error))
  })
}

export const tambahKelas = (payload: any) => {
  return new Promise<any>((resolve, reject) => {
    axios
      .post("/api/kelas/kelasTambah", payload)
      .then((response) => resolve(response))
      .catch((error) => reject(error));
  });
};

export const dataKelasDelete = (payload: any) => {
  return new Promise<any>((resolve, reject) => {
    axios
      .post("/api/kelas/kelasDelete", payload)
      .then((response) => resolve(response))
      .catch((error) => reject(error));
  });
};

export const dataKelasUpdate = (payload: any) => {
  return new Promise<any>((resolve, reject) => {
    axios
      .post("/api/kelas/kelasUpdate", payload)
      .then((response) => resolve(response))
      .catch((error) => reject(error));
  });
};
