import { apiClient } from './api/axios';
import { UserProfile, UserStats, LeaderboardEntry, UpdateProfilePayload } from '../types/user.types';

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  error: any;
}

// ─── Get logged-in user profile ───────────────────────────────────────────────
export const getUserProfile = async (): Promise<UserProfile> => {
  const { data } = await apiClient.get<ApiResponse<UserProfile>>('/users/profile');
  return data.data;
};

// ─── Get user call stats ─────────────────────────────────────────────────────
export const getUserStats = async (): Promise<UserStats> => {
  const { data } = await apiClient.get<ApiResponse<UserStats>>('/users/stats');
  return data.data;
};

// ─── Get org leaderboard (top 3 by minutes) ──────────────────────────────────
export const getLeaderboard = async (): Promise<LeaderboardEntry[]> => {
  const { data } = await apiClient.get<ApiResponse<LeaderboardEntry[]>>('/users/leaderboard');
  return data.data;
};

// ─── Update user profile ─────────────────────────────────────────────────────
export const updateProfile = async (payload: UpdateProfilePayload): Promise<UserProfile> => {
  const { data } = await apiClient.put<ApiResponse<UserProfile>>('/users/profile', payload);
  return data.data;
};
