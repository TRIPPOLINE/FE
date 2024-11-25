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
        this.setTokens(response.accessToken, response.refreshToken, credentials.remember);

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
      localStorage.removeItem('rememberLogin');
    },

    setTokens(accessToken, refreshToken, remember) {
      this.accessToken = accessToken;
      this.refreshToken = refreshToken;
      if (remember) {
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);
        localStorage.setItem('rememberLogin', 'true');
      } else {
        sessionStorage.setItem('accessToken', accessToken);
        sessionStorage.setItem('refreshToken', refreshToken);
      }
    },

    clearTokens() {
      this.accessToken = null;
      this.refreshToken = null;
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('rememberLogin');
      sessionStorage.removeItem('accessToken');
      sessionStorage.removeItem('refreshToken');
    },

    initializeAuth() {
      const rememberLogin = localStorage.getItem('rememberLogin');
      const token = rememberLogin === 'true'
        ? localStorage.getItem('accessToken')
        : sessionStorage.getItem('accessToken');

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
