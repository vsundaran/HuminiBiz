import { apiClient } from './api/axios';
import {
  Moment,
  PaginatedMoments,
  MyMomentsData,
  CreateMomentPayload,
  ToggleLikeResponse,
} from '../types/moment.types';

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  error: any;
}

// ─── Fetch live moments (ongoing right now) ───────────────────────────────────
export const getLiveMoments = async (limit?: number, categoryId?: string): Promise<PaginatedMoments> => {
  const params: Record<string, any> = {};
  if (limit) { params.limit = limit; }
  if (categoryId) { params.categoryId = categoryId; }

  const { data } = await apiClient.get<ApiResponse<PaginatedMoments>>('/moments/live', { params });
  return data.data;
};

// ─── Fetch upcoming moments (start in next 2h) ───────────────────────────────
export const getUpcomingMoments = async (limit?: number, categoryId?: string): Promise<PaginatedMoments> => {
  const params: Record<string, any> = {};
  if (limit) { params.limit = limit; }
  if (categoryId) { params.categoryId = categoryId; }

  const { data } = await apiClient.get<ApiResponse<PaginatedMoments>>('/moments/upcoming', { params });
  return data.data;
};

// ─── Fetch later moments (start after 2h) ────────────────────────────────────
export const getLaterMoments = async (limit?: number, categoryId?: string): Promise<PaginatedMoments> => {
  const params: Record<string, any> = {};
  if (limit) { params.limit = limit; }
  if (categoryId) { params.categoryId = categoryId; }

  const { data } = await apiClient.get<ApiResponse<PaginatedMoments>>('/moments/later', { params });
  return data.data;
};

// ─── Fetch my moments (created by logged-in user) ─────────────────────────────
export const getMyMoments = async (): Promise<MyMomentsData> => {
  const { data } = await apiClient.get<ApiResponse<MyMomentsData>>('/moments/my');
  return data.data;
};

// ─── Create a new moment ──────────────────────────────────────────────────────
export const createMoment = async (payload: CreateMomentPayload): Promise<Moment> => {
  const { data } = await apiClient.post<ApiResponse<Moment>>('/moments', payload);
  return data.data;
};

// ─── Toggle moment active status ──────────────────────────────────────────────
export const toggleMomentStatus = async (momentId: string, active: boolean): Promise<Moment> => {
  const { data } = await apiClient.put<ApiResponse<Moment>>(`/moments/${momentId}/status`, { active });
  return data.data;
};

// ─── Toggle like on a moment ─────────────────────────────────────────────────
export const toggleLike = async (momentId: string): Promise<ToggleLikeResponse> => {
  const { data } = await apiClient.post<ApiResponse<ToggleLikeResponse>>(`/moments/${momentId}/like`);
  return data.data;
};
