import axios from 'axios';

const API_URL = 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const setAuthToken = (token) => {
  console.log('setAuthToken called with token:', token);
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    console.log('Authorization header set:', api.defaults.headers.common['Authorization']);
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