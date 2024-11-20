import { defineStore } from 'pinia'
import axios from 'axios'

export const useUserStore = defineStore('user', {
  state: () => ({
    user: null,
    isLoggedIn: false
  }),
  
  actions: {
    async login(credentials) {
      try {
        const response = await axios.post('/api/user/login', credentials)
        this.user = response.data
        this.isLoggedIn = true
      } catch (error) {
        console.error('Login failed:', error)
        throw error
      }
    },

    async register(userData) {
      try {
        const response = await axios.post('/api/user/join', userData)
        return response.data
      } catch (error) {
        console.error('Registration failed:', error)
        throw error
      }
    },

    logout() {
      this.user = null
      this.isLoggedIn = false
    }
  }
})