import axios from "axios";

export const getDataSeragam = () => {
  return new Promise<any>((resolve, reject) => {
    axios
      .get("/api/seragamData")
      .then((response) => resolve(response))
      .catch((error) => reject(error));
  });
};

export const getDetailSeragam  = (payload: any) => {
  return new Promise<any>((resolve, reject) => {
      axios.post('/api/seragamDetail', payload)
      .then(response => resolve(response))
      .catch((error) => reject(error))
  })
}

export const tambahSeragam = (payload: any) => {
  return new Promise<any>((resolve, reject) => {
    axios
      .post("/api/seragamTambah", payload)
      .then((response) => resolve(response))
      .catch((error) => reject(error));
  });
};

export const dataSeragamDelete = (payload: any) => {
  return new Promise<any>((resolve, reject) => {
    axios
      .post("/api/seragamDelete", payload)
      .then((response) => resolve(response))
      .catch((error) => reject(error));
  });
};

export const dataSeragamUpdate = (payload: any) => {
  return new Promise<any>((resolve, reject) => {
    axios
      .post("/api/seragamUpdate", payload)
      .then((response) => resolve(response))
      .catch((error) => reject(error));
  });
};

