import { useState, useEffect } from 'react';
import type { LoginCredentials } from '../types/auth';
import { api } from '../services/api';

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    console.log('Auth check - token:', token ? 'exists' : 'missing');
    if (token) {
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, []);

  const login = async (credentials: LoginCredentials) => {
    try {
      const response = await api.auth.login(credentials);
      const { access, refresh } = response.data;
      
      localStorage.setItem('accessToken', access);
      localStorage.setItem('refreshToken', refresh);
      setIsAuthenticated(true);
      
      return { success: true };
    } catch (error: any) {
      let message = 'Login failed';
      if (error.response?.status === 401) {
        message = 'Invalid username or password';
      } else if (error.response?.data?.detail) {
        message = error.response.data.detail;
      }
      return { success: false, error: message };
    }
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    setIsAuthenticated(false);
  };

  return {
    isAuthenticated,
    loading,
    login,
    logout
  };
};