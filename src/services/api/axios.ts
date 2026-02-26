import axios, { AxiosError } from 'axios';
import { useAuthStore } from '../../store/useAuthStore';
import Config from 'react-native-config';

export const apiClient = axios.create({
  baseURL: Config.API_URL || 'https://api.example.com',
  timeout: 10000,
});

apiClient.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Global 401 handler: clear token to logout user
      useAuthStore.getState().clearToken();
    }
    return Promise.reject(error);
  }
);
