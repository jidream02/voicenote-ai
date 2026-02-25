import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import api from '../api/axios'

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isLoading: false,

      login: async (email, password) => {
        set({ isLoading: true })
        const { data } = await api.post('/auth/login', { email, password })
        set({ user: data.user, token: data.token, isLoading: false })
        return data
      },

      register: async (email, password, name) => {
        set({ isLoading: true })
        const { data } = await api.post('/auth/register', { email, password, name })
        set({ user: data.user, token: data.token, isLoading: false })
        return data
      },

      logout: () => set({ user: null, token: null }),

      isAuthenticated: () => !!get().token
    }),
    { name: 'auth-storage', partialize: (s) => ({ token: s.token, user: s.user }) }
  )
)
