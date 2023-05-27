import axios from "axios";

export const getHistoryPembayaranSeragam = () => {
  return new Promise<any>((resolve, reject) => {
    axios
      .get("/api/historyPembayaranSeragamData")
      .then((response) => resolve(response))
      .catch((error) => reject(error));
  });
};

export const tambahHistoryPembayaranSeragam = (payload: any) => {
  return new Promise<any>((resolve, reject) => {
    axios
      .post("/api/historyPembayaranSeragamTambah", payload)
      .then((response) => resolve(response))
      .catch((error) => reject(error));
  });
};

export const dataHistoryPembayaranSeragamDelete = (payload: any) => {
  return new Promise<any>((resolve, reject) => {
    axios
      .post("/api/historyPembayaranSeragamDelete", payload)
      .then((response) => resolve(response))
      .catch((error) => reject(error));
  });
};

export const dataHistoryPembayaranSeragamUpdate = (payload: any) => {
  return new Promise<any>((resolve, reject) => {
    axios
      .post("/api/historyPembayaranSeragamUpdate", payload)
      .then((response) => resolve(response))
      .catch((error) => reject(error));
  });
};

