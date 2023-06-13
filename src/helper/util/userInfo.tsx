export interface UserInfo {
  id: number
  username: string
  isLogin: boolean
  role: string
}

export function getUserInfo(): UserInfo | null {
  const userString = localStorage.getItem('user')
  if (userString) {
    return JSON.parse(userString) as UserInfo
  }
  return null
}

export function getUserInfoWithNullCheck(): UserInfo | null {
  const user = getUserInfo()
  if (user) {
    const { id, username, isLogin, role } = user
    return {
      id,
      username,
      isLogin,
      role,
    }
  }
  return null
}
