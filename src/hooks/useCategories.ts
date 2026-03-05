import { useQuery } from '@tanstack/react-query';
import { getCategories } from '../services/category.service';

// ─── Query Key ────────────────────────────────────────────────────────────────
export const categoryKeys = {
  all: () => ['categories'] as const,
};

// ─── Categories Query ─────────────────────────────────────────────────────────
/**
 * Fetches all active categories with their subcategories.
 * Long stale time since categories rarely change.
 */
export const useCategories = () => {
  return useQuery({
    queryKey: categoryKeys.all(),
    queryFn: getCategories,
    staleTime: 1000 * 60 * 30,    // 30 min — categories rarely change
    gcTime: 1000 * 60 * 60,       // 1 hour cache
  });
};
