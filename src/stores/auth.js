import { defineStore } from 'pinia'
import {login, setAuthToken} from '@/Auth/api/Index'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    accessToken: null,
  }),
  actions: {
    async login(credentials) {
      try {
        const response = await login(credentials)
        this.accessToken = response.accessToken
        setAuthToken(response.accessToken)
        // 사용자 정보 설정 (API 응답에 따라 조정 필요)
        this.user = { id: credentials.userId }
        return response
      } catch (error) {
        console.error('Login failed:', error)
        throw error
      }
    },
    logout() {
      this.user = null
      this.accessToken = null
      setAuthToken(null)
      localStorage.removeItem('rememberLogin')
    },
  },
})