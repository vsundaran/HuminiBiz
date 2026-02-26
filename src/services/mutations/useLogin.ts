import { useMutation } from '@tanstack/react-query';
import { apiClient } from '../api/axios';
import { useAuthStore } from '../../store/useAuthStore';
import { useUserStore, User } from '../../store/useUserStore';

interface LoginPayload {
  email: string;
  password?: string;
}

interface LoginResponse {
  token: string;
  user: User;
}

export const useLogin = () => {
  const setToken = useAuthStore((state) => state.setToken);
  const setUser = useUserStore((state) => state.setUser);

  return useMutation({
    mutationFn: async (payload: LoginPayload) => {
      const { data } = await apiClient.post<LoginResponse>('/auth/login', payload);
      return data;
    },
    onSuccess: (data) => {
      setToken(data.token);
      setUser(data.user);
    },
  });
};
