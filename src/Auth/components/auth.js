import { defineStore } from 'pinia'
import { login, setAuthToken } from '@/Auth/api/AuthIndex'
import { jwtDecode } from 'jwt-decode'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    accessToken: null,
    refreshToken: null,
    isAuthenticated: false,
  }),

  getters: {
    userId() {
      if (this.accessToken) {
        const decoded = jwtDecode(this.accessToken)
        return decoded.userId
      }
      return null
    },
    roleId() {
      if (this.accessToken) {
        const decoded = jwtDecode(this.accessToken)
        return decoded.role
      }
      return null
    },
    email() {
      if (this.accessToken) {
        const decoded = jwtDecode(this.accessToken)
        return decoded.email
      }
      return null
    },
  },

  actions: {
    async login(credentials) {
      try {
        const response = await login(credentials.userId, credentials.password);
        localStorage.setItem('accessToken', response.accessToken);
        localStorage.setItem('refreshToken', response.refreshToken);

        setAuthToken(response.accessToken);

        const decoded = jwtDecode(response.accessToken);
        this.user = {
          id: decoded.userId,
          roleId: decoded.role,
          email: decoded.email
        };

        this.isAuthenticated = true;
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
      this.isAuthenticated = false;
      setAuthToken(null);
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
    },

    setAccessToken(token) {
      this.accessToken = token
      localStorage.setItem('accessToken', token)
    },

    clearAccessToken() {
      this.accessToken = null
      localStorage.removeItem('accessToken')
    },

    initializeAuth() {
      const token = localStorage.getItem('accessToken');
      if (token) {
        try {
          const decoded = jwtDecode(token);
          this.accessToken = token;
          this.user = {
            id: decoded.userId,
            role: decoded.role,
            email: decoded.email
          };
          this.isAuthenticated = true;
          setAuthToken(token);
        } catch (error) {
          console.error('Token initialization failed:', error);
          this.logout();
        }
      }
    }
  },
});