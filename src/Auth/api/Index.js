import axios from 'axios';

const API_URL = 'http://localhost:8080';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const setAuthToken = (token) => {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common['Authorization'];
  }
};

export const login = async (userId, password) => {
  const response = await api.post('/api/auth/login', { userId, password });
  return response.data;
};

export const refreshToken = async (refreshToken) => {
  const response = await api.post('/api/reissue', { refreshToken });
  return response.data;
};

export default api;