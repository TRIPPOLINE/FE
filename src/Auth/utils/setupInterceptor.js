import api from '@/Auth/api/Index';
import { useAuth } from './AuthContext';

const setupInterceptors = () => {
  const { refreshAccessToken, logoutUser } = useAuth();

  api.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;

      if (error.response.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        try {
          const newAccessToken = await refreshAccessToken();
          originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
          return api(originalRequest);
        } catch (refreshError) {
          logoutUser();
          return Promise.reject(refreshError);
        }
      }

      return Promise.reject(error);
    }
  );

  api.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('accessToken');
      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
      }
      console.log('Request config:', config);
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );
};

export default setupInterceptors;