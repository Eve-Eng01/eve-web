/**
 * Profile Service
 * API service functions for profile-related endpoints
 */

import { apiClient } from "../../client";
import { ApiResponse } from "../../config";
import type {
  UploadProfilePictureResponse,
  UpdateProfileRequest,
  UpdateProfileResponse,
} from "./types";

/**
 * Profile Service Endpoints
 */
export const profileService = {
  /**
   * Upload profile picture
   * @param file - Image file (max 10MB)
   */
  uploadProfilePicture: async (
    file: File
  ): Promise<ApiResponse<UploadProfilePictureResponse>> => {
    const formData = new FormData();
    formData.append("media", file);

    const response = await apiClient.post<
      ApiResponse<UploadProfilePictureResponse>
    >("/auth/profile-picture", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  /**
   * Update user profile
   */
  updateProfile: async (
    data: UpdateProfileRequest
  ): Promise<ApiResponse<UpdateProfileResponse>> => {
    const response = await apiClient.patch<
      ApiResponse<UpdateProfileResponse>
    >("/user/profile", data);
    return response.data;
  },
};

