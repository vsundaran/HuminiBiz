import { QueryClient } from '@tanstack/react-query';
import { handleApiError } from '../../utils/errorHandler';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2, // Default retry failed requests up to 2 times
      staleTime: 1000 * 60 * 5, // Data is fresh for 5 minutes
      gcTime: 1000 * 60 * 15, // Cache time is 15 minutes
      refetchOnWindowFocus: true,
      refetchOnReconnect: true,
      // Generic error handler for background queries. Using the error utility we built.
      // Do not show errors to user for background fetches unless necessary (so showNotification = false)
      throwOnError: false, 
    },
    mutations: {
      // Global error handling for mutations (typically user triggered like POST/PUT)
      onError: (error) => {
        handleApiError(error, true);
      },
      retry: 0,
    },
  },
});
