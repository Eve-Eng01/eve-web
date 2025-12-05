/**
 * API Client
 * Axios instance with interceptors for token management and error handling
 */

import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from "axios";
import { API_CONFIG, TOKEN_STORAGE_KEYS } from "./config";

// Create axios instance
export const apiClient: AxiosInstance = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor - Add access token to requests
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const accessToken = localStorage.getItem(TOKEN_STORAGE_KEYS.ACCESS_TOKEN);
    
    if (accessToken && config.headers) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle token refresh and errors
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: unknown) => void;
  reject: (reason?: unknown) => void;
}> = [];

const processQueue = (error: AxiosError | null, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  
  failedQueue = [];
};

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // Handle 401 Unauthorized - Token expired or invalid
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // If already refreshing, queue this request
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            if (originalRequest.headers && token) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
            }
            return apiClient(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = localStorage.getItem(TOKEN_STORAGE_KEYS.REFRESH_TOKEN);

      if (!refreshToken) {
        // No refresh token, logout user immediately
        processQueue(error, null);
        isRefreshing = false;
        clearAuthTokens();
        // Clear auth store (dynamic import to avoid circular dependency)
        import("../stores/auth-store").then(({ useAuthStore }) => {
          useAuthStore.getState().clearAuth();
        });
        // Dispatch logout event
        window.dispatchEvent(new CustomEvent("auth:logout"));
        return Promise.reject(error);
      }

      try {
        // Attempt to refresh token (use axios directly to avoid interceptor loop)
        const response = await axios.post(
          `${API_CONFIG.BASE_URL}/auth/refresh`,
          { refresh_token: refreshToken },
          {
            headers: { "Content-Type": "application/json" },
            timeout: API_CONFIG.TIMEOUT,
          }
        );

        const { accessToken, refreshToken: newRefreshToken } = response.data.data;

        // Store new tokens
        localStorage.setItem(TOKEN_STORAGE_KEYS.ACCESS_TOKEN, accessToken);
        localStorage.setItem(TOKEN_STORAGE_KEYS.REFRESH_TOKEN, newRefreshToken);

        // Update authorization header
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        }

        // Process queued requests
        processQueue(null, accessToken);
        isRefreshing = false;

        // Retry original request
        return apiClient(originalRequest);
      } catch (refreshError) {
        // Refresh failed, logout user immediately
        processQueue(refreshError as AxiosError, null);
        isRefreshing = false;
        clearAuthTokens();
        // Clear auth store (dynamic import to avoid circular dependency)
        import("../stores/auth-store").then(({ useAuthStore }) => {
          useAuthStore.getState().clearAuth();
        });
        // Dispatch logout event
        window.dispatchEvent(new CustomEvent("auth:logout"));
        return Promise.reject(refreshError);
      }
    }

    // Handle other 401 errors (not from refresh attempt)
    // This catches 401s that occur when refresh token is also invalid or on direct 401s
    if (error.response?.status === 401 && originalRequest._retry) {
      // This is a 401 after a failed refresh attempt, logout immediately
      clearAuthTokens();
      import("../stores/auth-store").then(({ useAuthStore }) => {
        useAuthStore.getState().clearAuth();
      });
      window.dispatchEvent(new CustomEvent("auth:logout"));
    }

    return Promise.reject(error);
  }
);

/**
 * Clear authentication tokens from storage
 */
export function clearAuthTokens(): void {
  localStorage.removeItem(TOKEN_STORAGE_KEYS.ACCESS_TOKEN);
  localStorage.removeItem(TOKEN_STORAGE_KEYS.REFRESH_TOKEN);
}

/**
 * Set authentication tokens in storage
 */
export function setAuthTokens(tokens: { accessToken: string; refreshToken: string }): void {
  localStorage.setItem(TOKEN_STORAGE_KEYS.ACCESS_TOKEN, tokens.accessToken);
  localStorage.setItem(TOKEN_STORAGE_KEYS.REFRESH_TOKEN, tokens.refreshToken);
}

/**
 * Get stored access token
 */
export function getAccessToken(): string | null {
  return localStorage.getItem(TOKEN_STORAGE_KEYS.ACCESS_TOKEN);
}

/**
 * Get stored refresh token
 */
export function getRefreshToken(): string | null {
  return localStorage.getItem(TOKEN_STORAGE_KEYS.REFRESH_TOKEN);
}

