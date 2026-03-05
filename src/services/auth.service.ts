import { apiClient } from './api/axios';

export interface RequestOtpPayload {
  email: string;
}

export interface VerifyOtpPayload {
  email: string;
  otp: string;
}

export interface AuthResponse {
  user: {
    id: string;
    email: string;
    name?: string;
    jobRole?: string;
    department?: string;
    organizationId?: string;
    isProfileUpdated?: boolean;
  };
  accessToken: string;
  refreshToken: string;
}

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  error: any;
}

const authService = {
  requestOtp: async (payload: RequestOtpPayload): Promise<ApiResponse<any>> => {
    // The backend route is /api/auth/request-otp. apiClient already has baseURL
    const response = await apiClient.post<ApiResponse<any>>('/api/auth/request-otp', payload);
    return response.data;
  },

  verifyOtp: async (payload: VerifyOtpPayload): Promise<ApiResponse<AuthResponse>> => {
    const response = await apiClient.post<ApiResponse<AuthResponse>>('/api/auth/verify-otp', payload);
    return response.data;
  },
  
  logout: async (): Promise<ApiResponse<null>> => {
    const response = await apiClient.post<ApiResponse<null>>('/api/auth/logout');
    return response.data;
  }
};

export default authService;
