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

export type UserRole = "attendee" | "vendor" | "small-creator" | "admin" | "event-organizer" | null;

export interface OrganizerProfile {
  _id: string;
  organizer_id: string;
  organization_name: string;
  country: string;
  phone: {
    countryCode: string;
    number: string;
    e164?: string;
  };
  location: string;
  is_verified: boolean;
  links: Array<{
    brand: string;
    url: string;
  }>;
  createdAt: string;
  updatedAt: string;
  __v?: number;
}

export interface VendorProfile {
  portfolios?: unknown[];
  [key: string]: unknown;
}

export type OnboardedProfile = OrganizerProfile | VendorProfile | null;

export interface IsOnboardedData {
  id: OnboardedProfile;
  completed: boolean;
}

export interface UserProfile {
  _id: string;
  first_name: string;
  last_name: string;
  email: string;
  role: UserRole;
  is_onboarded: IsOnboardedData;
  isOnboardedModel: "Vendor" | "Event_Organizer" | null;
  avatar?: string;
}

export interface GetUserResponse {
  profile: UserProfile;
}

