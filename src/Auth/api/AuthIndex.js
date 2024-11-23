//auth/api/AuthIndex.js
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
//

const API_URL = 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 요청 인터셉터 추가
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;

      // 토큰에서 사용자 정보 추출 -> 전역에서 사용자 정보 사용
      try {
        const decoded = jwtDecode(token);
        config.headers['User-Id'] = decoded.userId;
        config.headers['Role-Id'] = decoded.role;
        
      } catch (error) {
        console.error('Token decode failed:', error);
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const setAuthToken = (token) => {
  console.log('setAuthToken called with token:', token);
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    console.log('Authorization header set:', api.defaults.headers.common['Authorization']);
    // 토큰에서 사용자 정보 추출하여 헤더에 설정
    try {
      const decoded = jwtDecode(token);
      api.defaults.headers.common['User-Id'] = decoded.userId;
      api.defaults.headers.common['Role-Id'] = decoded.role;
    } catch (error) {
      console.error('Token decode failed:', error);
    }
  } else {
    delete api.defaults.headers.common['Authorization'];
    console.log('Authorization header removed');
  }
};

export const login = async (userId, password) => {
  const response = await api.post('/auth/login', { userId, password });
  return response.data;
};

export const reissueToken = async (refreshToken) => {
  const data = JSON.stringify({ refreshToken });
  const response = await api.post('/reissue', data, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return response.data;
};

export default api;