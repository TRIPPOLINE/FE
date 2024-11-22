// auth.js
import { defineStore } from 'pinia'
import { login, setAuthToken } from '@/Auth/api/Index'
import { jwtDecode } from 'jwt-decode'  // JWT 디코딩 

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    accessToken: null,
    refreshToken: null,
    isAuthenticated: false,
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
        //this.user = { id: credentials.userId };
        // JWT에서 사용자 정보 디코딩
        const decoded = jwtDecode(response.accessToken);
        this.user = {
          id: decoded.userId,
          // 필요한 다른 사용자 정보도 JWT payload에서 추출
        };
        return response;
      } catch (error) {
        console.error('Login failed:', error);
        throw error;
      }
    },
    logout() {
      this.user = null;
      this.accessToken = null;
      this.refreshToken = null;
      setAuthToken(null);
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
    },
  
    initializeAuth() {
      const accessToken = localStorage.getItem('accessToken');
      if (accessToken) {
        this.accessToken = accessToken;
        setAuthToken(accessToken);
        const decoded = jwtDecode(accessToken);
        this.user = {
          id: decoded.userId,
        };
      }
    },
  },
});