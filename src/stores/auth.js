import { defineStore } from 'pinia'
import { login, setAuthToken } from '@/Auth/api/Index'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    accessToken: null,
    refreshToken: null,
  }),
  actions: {
    async login(credentials) {
      try {
        const response = await login(credentials.userId, credentials.password);
        // this.accessToken = response.accessToken;
        // this.refreshToken = response.refreshToken;
        localStorage.setItem('accessToken', response.accessToken);
        localStorage.setItem('refreshToken', response.refreshToken)
        setAuthToken(response.accessToken);
        this.user = { id: credentials.userId };
        return response;
      } catch (error) {
        console.error('Login failed:', error);
        throw error;
      }
    },
    logout() {
      this.user = null;
      this.accessToken = null;
      setAuthToken(null);
      localStorage.removeItem('rememberLogin');
    },
  },
});