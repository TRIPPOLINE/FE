import React, { createContext, useState, useContext, useEffect } from 'react';
import { setAuthToken, login, refreshToken } from './api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(localStorage.getItem('accessToken'));
  const [refreshTokenValue, setRefreshToken] = useState(localStorage.getItem('refreshToken'));

  useEffect(() => {
    if (accessToken) {
      setAuthToken(accessToken);
    }
  }, [accessToken]);

  const loginUser = async (userId, password) => {
    try {
      const response = await login(userId, password);
      setAccessToken(response.accessToken);
      setRefreshToken(response.refreshToken);
      localStorage.setItem('accessToken', response.accessToken);
      localStorage.setItem('refreshToken', response.refreshToken);
      setUser({ userId });
    } catch (error) {
      console.error('로그인 실패:', error);
    }
  };

  const logoutUser = () => {
    setUser(null);
    setAccessToken(null);
    setRefreshToken(null);
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    setAuthToken(null);
  };

  const refreshAccessToken = async () => {
    try {
      const response = await refreshToken(refreshTokenValue);
      setAccessToken(response.accessToken);
      localStorage.setItem('accessToken', response.accessToken);
      return response.accessToken;
    } catch (error) {
      console.error('토큰 갱신 실패:', error);
      logoutUser();
    }
  };

  return (
    <AuthContext.Provider value={{ user, loginUser, logoutUser, refreshAccessToken, accessToken }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);