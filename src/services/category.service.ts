import { apiClient } from './api/axios';
import { Category } from '../types/moment.types';

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  error: any;
}

// ─── Get all active categories with their subcategories ───────────────────────
export const getCategories = async (): Promise<Category[]> => {
  const { data } = await apiClient.get<ApiResponse<Category[]>>('/categories');
  return data.data;
};
