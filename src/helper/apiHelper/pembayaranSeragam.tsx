import axios from "axios";

export const getPembayaranSeragam = () => {
  return new Promise<any>((resolve, reject) => {
    axios
      .get("/api/pembayaranSeragamData")
      .then((response) => resolve(response))
      .catch((error) => reject(error));
  });
};

export const getDetailPembayaranSeragam  = (payload: any) => {
  return new Promise<any>((resolve, reject) => {
      axios.post('/api/pembayaranSeragamDetail', payload)
      .then(response => resolve(response))
      .catch((error) => reject(error))
  })
}

export const tambahPembayaranSeragam = (payload: any) => {
  return new Promise<any>((resolve, reject) => {
    axios
      .post("/api/pembayaranSeragamTambah", payload)
      .then((response) => resolve(response))
      .catch((error) => reject(error));
  });
};

export const dataPembayaranSeragamDelete = (payload: any) => {
  return new Promise<any>((resolve, reject) => {
    axios
      .post("/api/pembayaranSeragamDelete", payload)
      .then((response) => resolve(response))
      .catch((error) => reject(error));
  });
};

export const dataPembayaranSeragamUpdate = (payload: any) => {
  return new Promise<any>((resolve, reject) => {
    axios
      .post("/api/pembayaranSeragamUpdate", payload)
      .then((response) => resolve(response))
      .catch((error) => reject(error));
  });
};

