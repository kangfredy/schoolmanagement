import { decodeData, key } from "./saltPassword"

export interface UserInfo {
  id: number
  username: string
  isLogin: boolean
  role: string
}

export async function getUserInfo (): Promise<UserInfo | null> {
  //const userString = localStorage.getItem('user')
 // const decodeString = decodeData(userString,key)
 const userencrypted = localStorage.getItem('user')
  let decodeString = await decodeData(userencrypted? userencrypted.toString() : '',key)
  if (decodeString) {
    return JSON.parse(decodeString) as UserInfo
  }
  return null
}

export async function getUserInfoWithNullCheck(): Promise<UserInfo | null> {
  const user = await getUserInfo(); // Await the getUserInfo() promise

  if (user) {
    const { id, username, isLogin, role } = user;
    return {
      id,
      username,
      isLogin,
      role,
    };
  }

  return null;
}
