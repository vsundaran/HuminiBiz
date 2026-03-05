import axios, { AxiosError } from 'axios';

// Assuming there's a custom toast or alert system in the app
// You could integrate this with a UI Toast library
export const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
  // Replace with actual toast implementation (e.g., gluestack Toast, react-native-toast-message)
  console.log(`[Toast ${type.toUpperCase()}]: ${message}`);
};

export const handleApiError = (error: unknown, showNotification = true): string => {
  let errorMessage = 'An unexpected error occurred. Please try again.';

  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<any>;
    
    // Check if network error (no response received)
    if (!axiosError.response) {
      if (axiosError.code === 'ECONNABORTED') {
        errorMessage = 'Request timed out. Please check your connection.';
      } else {
        errorMessage = 'Network error. Please check your internet connection.';
      }
    } else {
      // Server responded with a status other than 2xx
      const status = axiosError.response.status;
      const data = axiosError.response.data;

      // According to user rules, backend return standardized response:
      // { success: false, message: "...", error: { ... } }
      if (data && data.message) {
        errorMessage = data.message;
      } else if (status === 401) {
        errorMessage = 'Session expired. Please log in again.';
      } else if (status === 403) {
        errorMessage = 'You do not have permission to perform this action.';
      } else if (status >= 500) {
        errorMessage = 'Server error. Please try again later.';
      }
    }
  } else if (error instanceof Error) {
    errorMessage = error.message;
  }

  if (showNotification) {
    showToast(errorMessage, 'error');
  }

  return errorMessage;
};
