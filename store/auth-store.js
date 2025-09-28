'use client'

import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { getUser } from '@/lib/api/user'
import { login as apiLogin, logout, logoutAll } from '@/lib/api/auth'

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      hasHydrated: false,    
      hasInitialized: false, 
      isFetchingUser: false,

      setHasHydrated: (v) => set({ hasHydrated: v }),
      setHasInitialized: (v) => set({ hasInitialized: v }),

      initializeAuth: async () => {
        const s = get()
        if (s.hasInitialized) return
        set({ hasInitialized: true })
        if (s.user) return
        if (s.isFetchingUser) return
        try {
          await s.fetchUser()
        } catch (e) {
        }
      },

      fetchUser: async () => {
        set({ isFetchingUser: true })
        try {
          const data = await getUser()
          set({ user: data })
        } catch (err) {
          console.error('fetchUser error:', err)
          set({ user: null })
        } finally {
          set({ isFetchingUser: false })
        }
      },

      loginUser: async (identifier, password) => {
        try {
          const result = await apiLogin(identifier, password)
          if (result?.error) return { error: result.error }

          if (result?.success) {
            await get().fetchUser()
            return { success: true }
          }
          return { error: 'Đăng nhập thất bại. Vui lòng thử lại.' }
        } catch (err) {
          console.error('loginUser error:', err)
          return { error: 'Lỗi kết nối server' }
        }
      },

      logoutUser: async () => {
        try {
          const result = await logout()
          if (result?.success) set({ user: null })
          return result
        } catch {
          set({ user: null })
          return { error: 'Đăng xuất thất bại.' }
        }
      },

      logoutAllUser: async () => {
        try {
          const result = await logoutAll()
          if (result?.success) set({ user: null })
          return result
        } catch {
          set({ user: null })
          return { error: 'Đăng xuất tất cả thất bại.' }
        }
      },
    }),
    {
      name: 'engpro-auth-storage',
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state, error) => {
        if (!state) return
        state.setHasHydrated(true)
        state.initializeAuth()
      },
      
    }
  )
)
