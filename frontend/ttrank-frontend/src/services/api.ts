import axios, { type AxiosResponse } from 'axios';
import type { Athlete, CSVImportResult } from '../types/athlete';
import type { LoginCredentials, AuthTokens } from '../types/auth';

// Configure axios
const API_BASE_URL = 'http://localhost:8000';
axios.defaults.baseURL = API_BASE_URL;

// Add request interceptor to include auth token
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle token refresh
axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      const refreshToken = localStorage.getItem('refreshToken');
      if (refreshToken) {
        try {
          const response = await axios.post('/api/auth/refresh/', {
            refresh: refreshToken
          });
          
          const { access } = response.data;
          localStorage.setItem('accessToken', access);
          
          return axios(originalRequest);
        } catch (refreshError) {
          // Refresh failed, redirect to login
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          window.location.href = '/';
        }
      }
    }
    
    return Promise.reject(error);
  }
);

export const api = {
  // Auth endpoints
  auth: {
    login: (credentials: LoginCredentials): Promise<AxiosResponse<AuthTokens>> =>
      axios.post('/api/auth/login/', credentials),
    
    refresh: (refreshToken: string): Promise<AxiosResponse<AuthTokens>> =>
      axios.post('/api/auth/refresh/', { refresh: refreshToken }),
  },

  // Athletes endpoints
  athletes: {
    list: (): Promise<AxiosResponse<Athlete[]>> =>
      axios.get('/api/athletes/'),
    
    create: (data: Omit<Athlete, 'id'>): Promise<AxiosResponse<Athlete>> =>
      axios.post('/api/athletes/', data),
    
    get: (id: number): Promise<AxiosResponse<Athlete>> =>
      axios.get(`/api/athletes/${id}/`),
    
    update: (id: number, data: Partial<Athlete>): Promise<AxiosResponse<Athlete>> =>
      axios.put(`/api/athletes/${id}/`, data),
    
    delete: (id: number): Promise<AxiosResponse<void>> =>
      axios.delete(`/api/athletes/${id}/`),
    
    importCSV: (file: File): Promise<AxiosResponse<CSVImportResult>> => {
      const formData = new FormData();
      formData.append('file', file);
      return axios.post('/api/athletes/import_csv/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
    },
    
    exportCSV: (): Promise<AxiosResponse<Blob>> =>
      axios.get('/api/athletes/export_csv/', {
        responseType: 'blob'
      }),
  }
};

export default api;