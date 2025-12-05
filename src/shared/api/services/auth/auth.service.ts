/**
 * Auth Service
 * API service functions for authentication endpoints
 */

import { apiClient } from "../../client";
import { ApiResponse } from "../../config";
import type {
  SignUpRequest,
  SignUpResponse,
  LoginRequest,
  LoginResponse,
  VerifyOtpRequest,
  VerifyOtpResponse,
  ResendOtpRequest,
  ResendOtpResponse,
  RefreshTokenRequest,
  RefreshTokenResponse,
  ForgotPasswordRequest,
  ForgotPasswordResponse,
  ResetPasswordRequest,
  ResetPasswordResponse,
  SetRoleRequest,
  SetRoleResponse,
} from "./types";

/**
 * Auth Service Endpoints
 */
export const authService = {
  /**
   * Sign up a new user
   */
  signUp: async (data: SignUpRequest): Promise<ApiResponse<SignUpResponse>> => {
    const response = await apiClient.post<ApiResponse<SignUpResponse>>(
      "/auth/signup",
      data
    );
    return response.data;
  },

  /**
   * Login user
   */
  login: async (data: LoginRequest): Promise<ApiResponse<LoginResponse>> => {
    const response = await apiClient.post<ApiResponse<LoginResponse>>(
      "/auth/login",
      data
    );
    return response.data;
  },

  /**
   * Verify OTP
   */
  verifyOtp: async (
    data: VerifyOtpRequest
  ): Promise<ApiResponse<VerifyOtpResponse>> => {
    const response = await apiClient.post<ApiResponse<VerifyOtpResponse>>(
      "/auth/verify-otp",
      data
    );
    return response.data;
  },

  /**
   * Resend OTP
   */
  resendOtp: async (
    data: ResendOtpRequest
  ): Promise<ApiResponse<ResendOtpResponse>> => {
    const response = await apiClient.post<ApiResponse<ResendOtpResponse>>(
      "/auth/resend-otp",
      data
    );
    return response.data;
  },

  /**
   * Refresh access token
   */
  refreshToken: async (
    data: RefreshTokenRequest
  ): Promise<ApiResponse<RefreshTokenResponse>> => {
    const response = await apiClient.post<ApiResponse<RefreshTokenResponse>>(
      "/auth/refresh",
      data
    );
    return response.data;
  },

  /**
   * Forgot password
   */
  forgotPassword: async (
    data: ForgotPasswordRequest
  ): Promise<ApiResponse<ForgotPasswordResponse>> => {
    const response = await apiClient.post<ApiResponse<ForgotPasswordResponse>>(
      "/auth/forgot-password",
      data
    );
    return response.data;
  },

  /**
   * Reset password
   */
  resetPassword: async (
    data: ResetPasswordRequest
  ): Promise<ApiResponse<ResetPasswordResponse>> => {
    const response = await apiClient.post<ApiResponse<ResetPasswordResponse>>(
      "/auth/reset-password",
      data
    );
    return response.data;
  },

  /**
   * Set user role
   */
  setRole: async (
    data: SetRoleRequest
  ): Promise<ApiResponse<SetRoleResponse>> => {
    const response = await apiClient.patch<ApiResponse<SetRoleResponse>>(
      "/user/role",
      data
    );
    return response.data;
  },
};


