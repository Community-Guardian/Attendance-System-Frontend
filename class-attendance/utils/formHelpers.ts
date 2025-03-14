import { toast } from "sonner"

interface ApiError {
  detail?: string;
  [key: string]: any;
}

export const handleApiError = (error: any, customMessage?: string) => {
  // Network or axios cancellation errors
  if (!error.response) {
    toast.error(error.message || 'Network error occurred');
    return;
  }

  const { status, data } = error.response;

  // Handle different HTTP status codes
  switch (status) {
    case 400:
      // Handle validation errors
      if (typeof data === 'object') {
        Object.entries(data).forEach(([key, value]) => {
          const message = Array.isArray(value) ? value[0] : value;
          toast.error(`${key}: ${message}`);
        });
      } else {
        toast.error(customMessage || data.detail || 'Invalid request');
      }
      break;

    case 401:
      toast.error('Session expired. Please login again');
      // You might want to trigger a logout or redirect here
      break;

    case 403:
      toast.error('You do not have permission to perform this action');
      break;

    case 404:
      toast.error(customMessage || 'Resource not found');
      break;

    case 429:
      toast.error('Too many requests. Please try again later');
      break;

    case 500:
      toast.error('Server error occurred. Please try again later');
      break;

    default:
      toast.error(customMessage || data.detail || 'An unexpected error occurred');
  }

  // Log error for debugging
  console.error('API Error:', {
    status,
    data,
    endpoint: error.config?.url,
    method: error.config?.method
  });
}

