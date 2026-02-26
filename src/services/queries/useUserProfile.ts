import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../api/axios';
import { User } from '../../store/useUserStore';

export const fetchUserProfile = async (): Promise<User> => {
  const { data } = await apiClient.get<User>('/user/profile');
  return data;
};

export const useUserProfile = () => {
  return useQuery({
    queryKey: ['userProfile'],
    queryFn: fetchUserProfile,
  });
};
