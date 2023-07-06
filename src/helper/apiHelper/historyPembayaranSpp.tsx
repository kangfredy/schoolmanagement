import axios from 'axios'

export const getHistoryPembayaranSpp = () => {
  return new Promise<any>((resolve, reject) => {
    axios
      .get('/api/historyPembayaranSpp/historyPembayaranSppData')
      .then(response => resolve(response))
      .catch(error => reject(error))
  })
}

export const historyPembayaranSppByPembayaranSppId = (
  pembayaranSppId: number,
) => {
  return new Promise<any>((resolve, reject) => {
    axios
      .get(
        '/api/historyPembayaranSpp/historyPembayaranSppByPembayaranSppId?pembayaranSppId=' +
          pembayaranSppId,
      )
      .then(response => resolve(response))
      .catch(error => reject(error))
  })
}

export const historyPembayaranSppBySiswaId = (siswaId: number) => {
  return new Promise<any>((resolve, reject) => {
    axios
      .get(
        '/api/historyPembayaranSpp/historyPembayaranSppBySiswaId?siswaId=' +
          siswaId,
      )
      .then(response => resolve(response))
      .catch(error => reject(error))
  })
}

export const tambahHistoryPembayaranSpp = (payload: any) => {
  return new Promise<any>((resolve, reject) => {
    axios
      .post('/api/historyPembayaranSpp/historyPembayaranSppTambah', payload)
      .then(response => resolve(response))
      .catch(error => reject(error))
  })
}

export const dataHistoryPembayaranSppDelete = (payload: any) => {
  return new Promise<any>((resolve, reject) => {
    axios
      .post('/api/historyPembayaranSpp/historyPembayaranSppDelete', payload)
      .then(response => resolve(response))
      .catch(error => reject(error))
  })
}

export const dataHistoryPembayaranSppUpdate = (
  payload: any,
  siswaId: number,
  tunggakan: number,
  totalBayar: number,
) => {
  return new Promise<any>((resolve, reject) => {
    axios
      .post('/api/historyPembayaranSpp/historyPembayaranSppUpdate', {
        ...payload,
        siswaId: siswaId,
        tunggakan: tunggakan,
        totalBayar: totalBayar,
      })
      .then(response => resolve(response))
      .catch(error => reject(error))
  })
}


export const getSiswaBelumBayarService = () => {
  const url = "/api/historyPembayaranSpp/getSiswaBelumBayar"
  console.log("🚀 Fetching URL: " + url);
return new Promise<any>((resolve, reject) => {
  axios
    .get(url)
    .then((response) =>{ 
      console.log("🎉 Success Response : ", response)
      resolve(response)
    })
    .catch((error) => {
      console.log("🔥 Error : "+ error)
      reject(error)
  });
});
};
