/**
 * API Configuration
 * Central configuration for API base URL and default settings
 */

const isDev = true
export const API_CONFIG = {
  BASE_URL: isDev ? "http://localhost:3003/api/v1" : "https://eve-backend-bi8l.onrender.com/api/v1",
  TIMEOUT: 30000, // 30 seconds
} as const;

/**
 * API Response Types
 */
export interface ApiResponse<T = unknown> {
  status: boolean;
  message: string;
  data?: T;
  errors?: Array<{ field: string; message: string }>;
}

/**
 * Auth Token Types
 */
export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

/**
 * Token Storage Keys
 */
export const TOKEN_STORAGE_KEYS = {
  ACCESS_TOKEN: "eve_access_token",
  REFRESH_TOKEN: "eve_refresh_token",
} as const;


