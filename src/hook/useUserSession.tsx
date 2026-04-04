import { useEffect, useState } from 'react'
import { getUserInfoWithNullCheck } from '@/helper/util/userInfo'

interface UserSessionState {
  userId: number
  userRole: string
}

export function useUserSession(initialRole: string = ''): UserSessionState {
  const [userId, setUserId] = useState(0)
  const [userRole, setUserRole] = useState(initialRole)

  useEffect(() => {
    const fetchUser = async () => {
      const user = await getUserInfoWithNullCheck()
      if (user) {
        setUserId(user.id)
        setUserRole(user.role)
      } else {
        console.log('LOCALSTORAGE IS EMPTY')
      }
    }

    fetchUser()
  }, [])

  return { userId, userRole }
}

