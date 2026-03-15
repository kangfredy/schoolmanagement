import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface UserInfo {
  id: number
  username: string
  isLogin: boolean
  role: string
}

interface UserState {
  user: UserInfo | null
  setUser: (user: UserInfo | null) => void
  logout: () => void
  isAuthenticated: () => boolean
}

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      user: null,
      setUser: (user) => set({ user }),
      logout: () => {
        set({ user: null })
        if (typeof window !== 'undefined') window.location.href = '/'
      },
      isAuthenticated: () => {
        const u = get().user
        return u != null && u.isLogin === true
      },
    }),
    {
      name: 'user-storage',
      partialize: (state) => ({ user: state.user }),
    },
  ),
)
