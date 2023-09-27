import axios from 'axios'

export const getUserService = () => {
  return new Promise<any>((resolve, reject) => {
    const url = '/api/user/userData'
    // console.log("🚀 Fetching URL: " + url);
    axios
      .get(url)
      .then(response => {
        // console.log("🎉 Success Response : ", response)
        resolve(response)
      })
      .catch(error => {
        // console.log("🔥 Error : "+ error)
        reject(error)
      })
  })
}

export const tambahUserService = (payload: any) => {
  const url = '/api/user/userTambah'
  // console.log("🚀 Fetching URL: " + url);
  return new Promise<any>((resolve, reject) => {
    axios
      .post(url, payload)
      .then(response => {
        // console.log("🎉 Success Response : ", response)
        resolve(response)
      })
      .catch(error => {
        // console.log("🔥 Error : "+ error)
        reject(error)
      })
  })
}

export const dataUserDeleteService = (payload: any) => {
  const url = '/api/user/userDelete'
  // console.log("🚀 Fetching URL: " + url);
  return new Promise<any>((resolve, reject) => {
    axios
      .post(url, payload)
      .then(response => {
        // console.log("🎉 Success Response : ", response)
        resolve(response)
      })
      .catch(error => {
        // console.log("🔥 Error : "+ error)
        reject(error)
      })
  })
}

export const dataUserUpdateService = (payload: any) => {
  const url = '/api/user/userUpdate'
  // console.log("🚀 Fetching URL: " + url);
  return new Promise<any>((resolve, reject) => {
    axios
      .post(url, payload)
      .then(response => {
        // console.log("🎉 Success Response : ", response)
        resolve(response)
      })
      .catch(error => {
        // console.log("🔥 Error : "+ error)
        reject(error)
      })
  })
}
