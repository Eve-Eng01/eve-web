/**
 * Onboarding Service
 * API service functions for onboarding endpoints
 */

import { apiClient } from "../../client";
import { ApiResponse } from "../../config";
import type {
  CreateOnboardingRequest,
  CreateOnboardingResponse,
  UpdateOnboardingRequest,
  UpdateOnboardingResponse,
} from "./types";

/**
 * Onboarding Service Endpoints
 */
export const onboardingService = {
  /**
   * Create onboarding profile (organizer or vendor)
   */
  createProfile: async (
    data: CreateOnboardingRequest
  ): Promise<ApiResponse<CreateOnboardingResponse>> => {
    const response = await apiClient.post<ApiResponse<CreateOnboardingResponse>>(
      "/onboarding",
      data
    );
    return response.data;
  },

  /**
   * Update onboarding profile (steps 3 onwards)
   */
  updateProfile: async (
    data: UpdateOnboardingRequest
  ): Promise<ApiResponse<UpdateOnboardingResponse>> => {
    const response = await apiClient.patch<ApiResponse<UpdateOnboardingResponse>>(
      "/onboarding",
      data
    );
    return response.data;
  },
};

