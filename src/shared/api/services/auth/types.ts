/**
 * Auth Service Types
 * Type definitions for authentication-related API requests and responses
 */

export interface SignUpRequest {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
}

export interface SignUpResponse {
  id: string;
  otp: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  _id: string;
  firstName?: string;
  lastname?: string;
  email: string;
  tokens?: {
    accessToken: string;
    refreshToken: string;
  };
  isVerified: boolean;
  role?: string;
  isOnboarded?: boolean;
}

export interface VerifyOtpRequest {
  email: string;
  otp: string;
}

export interface VerifyOtpResponse {
  message: string;
}

export interface ResendOtpRequest {
  email: string;
}

export interface ResendOtpResponse {
  message: string;
  otp?: string;
}

export interface RefreshTokenRequest {
  refresh_token: string;
}

export interface RefreshTokenResponse {
  accessToken: string;
  refreshToken: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ForgotPasswordResponse {
  message: string;
}

export interface VerifyPasswordResetOtpRequest {
  email: string;
  otp: string;
}

export interface VerifyPasswordResetOtpResponse {
  token: string;
}

export interface ResetPasswordRequest {
  email: string;
  token: string;
  newPassword: string;
}

export interface ResetPasswordResponse {
  message: string;
}

export enum UserRoleEnum {
  EVENT_ORGANIZER = "event-organizer",
  VENDOR = "vendor",
}

export interface SetRoleRequest {
  role: UserRoleEnum;
}

export interface SetRoleResponse {
  message: string;
  role: string;
}

export interface GoogleOAuthRequest {
  id_token: string;
}

export interface GoogleOAuthResponse {
  _id: string;
  firstName?: string;
  lastname?: string;
  email: string;
  tokens?: {
    accessToken: string;
    refreshToken: string;
  };
  isVerified: boolean;
  role?: string;
  isOnboarded?: boolean;
}

export interface LinkAccountRequest {
  provider: "google" | "apple";
  id_token: string;
}

export interface LinkAccountResponse {
  message: string;
  linkedProviders: {
    email: boolean;
    google: boolean;
    apple: boolean;
  };
}


