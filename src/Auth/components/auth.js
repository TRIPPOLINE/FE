// auth.js
import { defineStore } from 'pinia'
import { login, setAuthToken } from '@/Auth/api/AuthIndex'
import { jwtDecode } from 'jwt-decode'  // JWT 디코딩 
//
export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    accessToken: null,
    refreshToken: null,
    isAuthenticated: false,
  }),
  
  getters: {
    // 사용자 id를 전역적으로 사용 목적
    userId() {
      if (this.accessToken) {
        const decoded = jwtDecode(this.accessToken)
        return decoded.userId
      }
      return null
    },
    // role id를 전역적으로 사용 목적
    roleId() {
      if (this.accessToken) {
        const decoded = jwtDecode(this.accessToken)
        return decoded.roleId
      }
      return null
    }
  },
  actions: {
    async login(credentials) {
      try {
        const response = await login(credentials.userId, credentials.password);
        // this.accessToken = response.accessToken;
        // this.refreshToken = response.refreshToken;
        localStorage.setItem('accessToken', response.accessToken);
        localStorage.setItem('refreshToken', response.refreshToken);

        // 헤더에 토큰 설정
        setAuthToken(response.accessToken);
        //this.user = { id: credentials.userId };

        // JWT에서 사용자 정보 디코딩
        const decoded = jwtDecode(response.accessToken);
        this.user = {
          id: decoded.userId,
          roleId: decoded.roleId
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
  
    // initializeAuth() {
    //   const accessToken = localStorage.getItem('accessToken');
    //   if (accessToken) {
    //     this.accessToken = accessToken;
    //     setAuthToken(accessToken);
    //     const decoded = jwtDecode(accessToken);
    //     this.user = {
    //       id: decoded.userId,
    //     };
    //   }
    // },
    setAccessToken(token) {
      this.accessToken = token
      localStorage.setItem('accessToken', token)
    },
    clearAccessToken() {
      this.accessToken = null
      localStorage.removeItem('accessToken')
    },
    // initializeAuth() {
    //   const token = localStorage.getItem('accessToken')
    //   if (token) {
    //     this.setAccessToken(token)
    //   }
    // }
    initializeAuth() {
      const token = localStorage.getItem('accessToken');
      if (token) {
        try {
          const decoded = jwtDecode(token);
          this.accessToken = token;
          this.user = {
            id: decoded.userId,
            roleId: decoded.roleId
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