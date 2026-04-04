import { useUserStore } from '@/store/userStore'
import type { UserInfo } from '@/store/userStore'

export type { UserInfo }

/** Get current user from Zustand store (sync). Use this in components/hooks. */
export function getUserInfoSync(): UserInfo | null {
  return useUserStore.getState().user
}

/** Async wrapper for compatibility with existing code that awaits getUserInfo. */
export async function getUserInfo(): Promise<UserInfo | null> {
  return Promise.resolve(useUserStore.getState().user)
}

export async function getUserInfoWithNullCheck(): Promise<UserInfo | null> {
  const user = useUserStore.getState().user
  if (user) {
    return {
      id: user.id,
      username: user.username,
      isLogin: user.isLogin,
      role: user.role,
    }
  }
  return null
}
