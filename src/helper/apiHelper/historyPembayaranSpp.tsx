import axios from "axios";

export const getHistoryPembayaranSpp = () => {
  return new Promise<any>((resolve, reject) => {
    axios
      .get("/api/historyPembayaranSppData")
      .then((response) => resolve(response))
      .catch((error) => reject(error));
  });
};

export const tambahHistoryPembayaranSpp = (payload: any) => {
  return new Promise<any>((resolve, reject) => {
    axios
      .post("/api/historyPembayaranSppTambah", payload)
      .then((response) => resolve(response))
      .catch((error) => reject(error));
  });
};

export const dataHistoryPembayaranSppDelete = (payload: any) => {
  return new Promise<any>((resolve, reject) => {
    axios
      .post("/api/historyPembayaranSppDelete", payload)
      .then((response) => resolve(response))
      .catch((error) => reject(error));
  });
};

export const dataHistoryPembayaranSppUpdate = (payload: any) => {
  return new Promise<any>((resolve, reject) => {
    axios
      .post("/api/historyPembayaranSppUpdate", payload)
      .then((response) => resolve(response))
      .catch((error) => reject(error));
  });
};

