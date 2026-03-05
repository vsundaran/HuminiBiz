import { useMutation } from '@tanstack/react-query';
import authService, { RequestOtpPayload, VerifyOtpPayload, AuthResponse } from '../services/auth.service';
import { useAuthStore } from '../store/auth.store';

interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
  };
  message?: string;
}

export const useRequestOtp = () => {
  return useMutation({
    mutationFn: (payload: RequestOtpPayload) => authService.requestOtp(payload),
  });
};

export const useVerifyOtp = () => {
  const setTokens = useAuthStore((state) => state.setTokens);
  const setUser = useAuthStore((state) => state.setUser);
  const loginStore = useAuthStore((state) => state.login);

  return useMutation({
    mutationFn: (payload: VerifyOtpPayload) => authService.verifyOtp(payload),
    onSuccess: (data) => {
      if (data.success && data.data) {
        const { user, accessToken, refreshToken } = data.data;
        // Update global auth state
        loginStore(user, accessToken, refreshToken);
      }
    },
  });
};
