import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const BASEURL = process.env.NEXT_PUBLIC_BASE_URL || "http://72.60.80.28:5000";

// Validate BASEURL on import
if (typeof window !== 'undefined' && !BASEURL) {
  console.error('BASEURL is not configured. Please set NEXT_PUBLIC_BASE_URL environment variable.');
}

// Network utility functions
export const checkNetworkConnectivity = async (): Promise<boolean> => {
  try {
    const response = await fetch(`${BASEURL}/health`, {
      method: 'GET',
      cache: 'no-cache',
      headers: {
        'Cache-Control': 'no-cache'
      }
    });
    return response.ok;
  } catch {
    try {
      // Fallback: try the courses endpoint
      const response = await fetch(`${BASEURL}/courses/published`, {
        method: 'GET',
        cache: 'no-cache'
      });
      return response.ok;
    } catch {
      return false;
    }
  }
};

export const withRetry = async <T>(
  fn: () => Promise<T>,
  maxRetries = 3,
  delay = 1000
): Promise<T> => {
  let lastError: Error = new Error('Retry failed');
  
  for (let i = 0; i <= maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      
      if (i === maxRetries) break;
      
      // Don't retry on auth errors
      if (lastError.message.includes('401') || lastError.message.includes('unauthorized')) {
        break;
      }
      
      console.log(`Retry attempt ${i + 1}/${maxRetries} after ${delay}ms`);
      await new Promise(resolve => setTimeout(resolve, delay * (i + 1)));
    }
  }
  
  throw lastError;
};

// Check if progress API is available (can be disabled via env var)
export const isProgressApiAvailable = (): boolean => {
  // If explicitly disabled via environment variable
  if (process.env.NEXT_PUBLIC_DISABLE_PROGRESS_API === 'true') {
    return false;
  }
  
  // If the backend doesn't support progress API, disable it
  // This prevents unnecessary 404 errors in console
  return false; // Temporarily disabled until backend implements progress API
};
