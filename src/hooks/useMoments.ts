import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from '@tanstack/react-query';
import {
  getLiveMoments,
  getUpcomingMoments,
  getLaterMoments,
  getMyMoments,
  createMoment,
  toggleMomentStatus,
  archiveMoment,
  toggleLike,
} from '../services/moment.service';
import { CreateMomentPayload } from '../types/moment.types';

// ─── Query Keys ───────────────────────────────────────────────────────────────
export const momentKeys = {
  all: ['moments'] as const,
  live: (categoryId?: string) => ['moments', 'live', categoryId] as const,
  liveInfinite: (categoryId?: string) => ['moments', 'live', 'infinite', categoryId] as const,
  upcoming: (categoryId?: string) => ['moments', 'upcoming', categoryId] as const,
  upcomingInfinite: (categoryId?: string) => ['moments', 'upcoming', 'infinite', categoryId] as const,
  later: (categoryId?: string) => ['moments', 'later', categoryId] as const,
  laterInfinite: (categoryId?: string) => ['moments', 'later', 'infinite', categoryId] as const,
  my: () => ['moments', 'my'] as const,
};

const PAGE_SIZE = 10;

// ─── Live Moments ─────────────────────────────────────────────────────────────
export const useLiveMoments = (params?: { limit?: number; categoryId?: string }) => {
  return useQuery({
    queryKey: momentKeys.live(params?.categoryId),
    queryFn: () => getLiveMoments(params?.limit, params?.categoryId),
    staleTime: 1000 * 30,            // Refresh every 30s for live data
    refetchInterval: 1000 * 60,    // Auto-refetch every 60s
  });
};

// ─── Upcoming Moments (next 2h) ───────────────────────────────────────────────
export const useUpcomingMoments = (params?: { limit?: number; categoryId?: string }) => {
  return useQuery({
    queryKey: momentKeys.upcoming(params?.categoryId),
    queryFn: () => getUpcomingMoments(params?.limit, params?.categoryId),
    staleTime: 1000 * 60 * 2,       // 2 min stale time
  });
};

// ─── Later Moments (after 2h) ─────────────────────────────────────────────────
export const useLaterMoments = (params?: { limit?: number; categoryId?: string }) => {
  return useQuery({
    queryKey: momentKeys.later(params?.categoryId),
    queryFn: () => getLaterMoments(params?.limit, params?.categoryId),
    staleTime: 1000 * 60 * 5,       // 5 min stale time
  });
};

// ─── My Moments ───────────────────────────────────────────────────────────────
export const useMyMoments = () => {
  return useQuery({
    queryKey: momentKeys.my(),
    queryFn: getMyMoments,
    staleTime: 1000 * 60 * 2,
  });
};

// ─── Create Moment Mutation ───────────────────────────────────────────────────
export const useCreateMoment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateMomentPayload) => createMoment(payload),
    onSuccess: () => {
      // Invalidate relevant caches after creating
      queryClient.invalidateQueries({ queryKey: momentKeys.my() });
      queryClient.invalidateQueries({ queryKey: momentKeys.live() });
      queryClient.invalidateQueries({ queryKey: momentKeys.upcoming() });
      queryClient.invalidateQueries({ queryKey: momentKeys.later() });
    },
  });
};

// ─── Toggle Moment Status Mutation ───────────────────────────────────────────
export const useToggleMomentStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ momentId, active }: { momentId: string; active: boolean }) =>
      toggleMomentStatus(momentId, active),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: momentKeys.my() });
      queryClient.invalidateQueries({ queryKey: momentKeys.live() });
    },
  });
};

// ─── Toggle Like Mutation ─────────────────────────────────────────────────────
export const useToggleLike = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (momentId: string) => toggleLike(momentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: momentKeys.all });
    },
  });
};

// ─── Archive Moment Mutation ──────────────────────────────────────────────────
export const useArchiveMoment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (momentId: string) => archiveMoment(momentId),
    onSuccess: () => {
      // Move the card to Archive tab by re-fetching my moments
      queryClient.invalidateQueries({ queryKey: momentKeys.my() });
      queryClient.invalidateQueries({ queryKey: momentKeys.live() });
    },
  });
};

// ─── Infinite Live Moments (for LiveMomentsScreen) ────────────────────────────
export const useInfiniteLiveMoments = (categoryId?: string) => {
  return useInfiniteQuery({
    queryKey: momentKeys.liveInfinite(categoryId),
    queryFn: ({ pageParam = 0 }) =>
      getLiveMoments(undefined, categoryId).then((all) => ({
        moments: all.moments.slice(pageParam, pageParam + PAGE_SIZE),
        totalCount: all.totalCount
      })),
    getNextPageParam: (lastPage, allPages) => {
      const fetched = allPages.flatMap((p) => p.moments).length;
      return lastPage.moments.length === PAGE_SIZE ? fetched : undefined;
    },
    staleTime: 1000 * 30,
    refetchInterval: 1000 * 60,
    initialPageParam: 0,
  });
};

// ─── Infinite Upcoming Moments (for LiveMomentsScreen) ────────────────────────
export const useInfiniteUpcomingMoments = (categoryId?: string) => {
  return useInfiniteQuery({
    queryKey: momentKeys.upcomingInfinite(categoryId),
    queryFn: ({ pageParam = 0 }) =>
      getUpcomingMoments(undefined, categoryId).then((all) => ({
        moments: all.moments.slice(pageParam, pageParam + PAGE_SIZE),
        totalCount: all.totalCount
      })),
    getNextPageParam: (lastPage, allPages) => {
      const fetched = allPages.flatMap((p) => p.moments).length;
      return lastPage.moments.length === PAGE_SIZE ? fetched : undefined;
    },
    staleTime: 1000 * 60 * 2,
    initialPageParam: 0,
  });
};

// ─── Infinite Later Moments (for LiveMomentsScreen) ───────────────────────────
export const useInfiniteLaterMoments = (categoryId?: string) => {
  return useInfiniteQuery({
    queryKey: momentKeys.laterInfinite(categoryId),
    queryFn: ({ pageParam = 0 }) =>
      getLaterMoments(undefined, categoryId).then((all) => ({
        moments: all.moments.slice(pageParam, pageParam + PAGE_SIZE),
        totalCount: all.totalCount
      })),
    getNextPageParam: (lastPage, allPages) => {
      const fetched = allPages.flatMap((p) => p.moments).length;
      return lastPage.moments.length === PAGE_SIZE ? fetched : undefined;
    },
    staleTime: 1000 * 60 * 5,
    initialPageParam: 0,
  });
};
