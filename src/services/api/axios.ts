import axios, {
  AxiosError,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios';
import { useAuthStore } from '../../store/auth.store';

// ─── Base instance ─────────────────────────────────────────────────────────────
export const apiClient = axios.create({
  baseURL: 'http://10.0.2.2:3000/api',
  timeout: 10000,
});

/**
 * Separate bare axios instance used ONLY for token refresh calls.
 * Using apiClient itself here would create a circular dependency and
 * infinite retry loop if the refresh endpoint itself returned a 401.
 */
const refreshClient = axios.create({
  baseURL: 'http://10.0.2.2:3000/api',
  timeout: 10000,
});

// ─── Refresh-in-flight state ──────────────────────────────────────────────────
/**
 * Controls the "refresh gate":
 *   - isRefreshing:   true while a token refresh call is in-flight
 *   - failedQueue:    requests that arrived while refresh was in-flight → replayed after success
 *
 * This ensures that when 5 concurrent requests all get 401, only ONE refresh
 * call is made. The other 4 wait and then retry with the new token.
 */
let isRefreshing = false;
type QueueItem = {
  resolve: (value: unknown) => void;
  reject: (reason?: unknown) => void;
};
let failedQueue: QueueItem[] = [];

/** Flush all queued requests after a refresh attempt */
const processQueue = (error: Error | null, token: string | null = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else {
      resolve(token);
    }
  });
  failedQueue = [];
};

// ─── REQUEST INTERCEPTOR ──────────────────────────────────────────────────────
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
        timestamp: new Date().toISOString(),
      });
    }

    return config;
  },
  (error) => {
    console.error('❌ REQUEST ERROR', error);
    return Promise.reject(error);
  }
);

// ─── RESPONSE INTERCEPTOR ────────────────────────────────────────────────────
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    if (__DEV__) {
      console.log('✅ API RESPONSE', {
        url: response.config.url,
        status: response.status,
        response: response.data,
      });
    }
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    if (__DEV__) {
      console.warn('❌ API ERROR', {
        url: error.config?.url,
        status: error.response?.status,
        message: error.message,
      });
    }

    // Only attempt refresh on 401 errors, and only once per request
    if (error.response?.status !== 401 || originalRequest._retry) {
      return Promise.reject(error);
    }

    // ── Refresh in-flight: queue this request ─────────────────────────────────
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      })
        .then((newToken) => {
          // Replay the queued request with the freshly issued access token
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return apiClient(originalRequest);
        })
        .catch((err) => Promise.reject(err));
    }

    // ── Start the refresh cycle ───────────────────────────────────────────────
    originalRequest._retry = true;
    isRefreshing = true;

    const { refreshToken, setTokens, logout } = useAuthStore.getState();

    if (!refreshToken) {
      // No refresh token stored → user must log in again
      isRefreshing = false;
      processQueue(new Error('No refresh token'), null);
      logout();
      return Promise.reject(error);
    }

    try {
      const { data } = await refreshClient.post('/auth/refresh-token', {
        refreshToken,
      });

      const newAccessToken  = data.data.accessToken;
      const newRefreshToken = data.data.refreshToken;

      // Persist both tokens in Zustand (which also persists to AsyncStorage via middleware)
      setTokens(newAccessToken, newRefreshToken);

      // Replay all queued requests with the new access token
      processQueue(null, newAccessToken);

      // Retry the original failed request
      originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
      return apiClient(originalRequest);

    } catch (refreshError) {
      // Refresh failed (token expired, reuse detected, account suspended…)
      // Force logout — user needs to re-authenticate
      processQueue(refreshError as Error, null);
      logout();
      return Promise.reject(refreshError);

    } finally {
      isRefreshing = false;
    }
  }
);