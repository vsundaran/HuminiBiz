import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getUserProfile, getUserStats, getLeaderboard, updateProfile } from '../services/user.service';
import { UpdateProfilePayload } from '../types/user.types';
import { useAuthStore } from '../store/auth.store';

// ─── Query Keys ───────────────────────────────────────────────────────────────
export const userKeys = {
  profile: () => ['user', 'profile'] as const,
  stats: () => ['user', 'stats'] as const,
  leaderboard: () => ['user', 'leaderboard'] as const,
};

// ─── User Profile Query ───────────────────────────────────────────────────────
export const useUserProfile = () => {
  return useQuery({
    queryKey: userKeys.profile(),
    queryFn: getUserProfile,
    staleTime: 1000 * 60 * 5,     // Profile rarely changes
  });
};

// ─── User Stats Query ─────────────────────────────────────────────────────────
export const useUserStats = () => {
  return useQuery({
    queryKey: userKeys.stats(),
    queryFn: getUserStats,
    staleTime: 1000 * 60 * 5,
  });
};

// ─── Leaderboard Query ────────────────────────────────────────────────────────
export const useLeaderboard = () => {
  return useQuery({
    queryKey: userKeys.leaderboard(),
    queryFn: getLeaderboard,
    staleTime: 1000 * 60 * 10,    // Leaderboard can be stale a bit longer
  });
};

// ─── Update Profile Mutation ──────────────────────────────────────────────────
export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  const setUser = useAuthStore(s => s.setUser);

  return useMutation({
    mutationFn: (payload: UpdateProfilePayload) => updateProfile(payload),
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: userKeys.profile() });
      // Also sync auth store with updated name
      const currentUser = useAuthStore.getState().user;
      if (currentUser) {
        setUser({ ...currentUser, name: updated.name, jobRole: updated.jobRole, department: updated.department } as any);
      }
    },
  });
};
