import axios, {
  AxiosError,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios';
import { useAuthStore } from '../../store/auth.store';

export const apiClient = axios.create({
  baseURL: 'http://10.0.2.2:3000/api',
  timeout: 10000,
});

/**
 * =========================
 * REQUEST INTERCEPTOR
 * =========================
 */
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = useAuthStore.getState().accessToken;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    if (__DEV__) {
      console.log('🚀 API REQUEST', {
        url: `${config.baseURL}${config.url}`,
        method: config.method?.toUpperCase(),
        headers: config.headers,
        params: config.params,
        payload: config.data,
        timestamp: new Date().toISOString(),
      });
    }

    return config;
  },
  (error) => {
    console.log('❌ REQUEST ERROR', error);
    return Promise.reject(error);
  }
);

/**
 * =========================
 * RESPONSE INTERCEPTOR
 * =========================
 */
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    if (__DEV__) {
      console.log('✅ API RESPONSE', {
        url: response.config.url,
        method: response.config.method?.toUpperCase(),
        status: response.status,
        data: response.data,
        timestamp: new Date().toISOString(),
      });
    }

    return response;
  },
  (error: AxiosError) => {
    if (__DEV__) {
      console.log('❌ API ERROR', {
        url: error.config?.url,
        method: error.config?.method?.toUpperCase(),
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
      });
    }

    if (error.response?.status === 401) {
      useAuthStore.getState().logout();
    }

    return Promise.reject(error);
  }
);