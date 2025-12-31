/**
 * Profile Hooks (TanStack Query)
 * React Query hooks for profile operations
 */

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { profileService } from "./profile.service";
import type { UpdateProfileRequest } from "./types";
import { useToastStore } from "../../../stores/toast-store";
import { authKeys } from "../auth/auth.hooks";

/**
 * Query Keys
 */
export const profileKeys = {
  all: ["profile"] as const,
  picture: () => [...profileKeys.all, "picture"] as const,
};

/**
 * Upload Profile Picture Mutation
 */
export function useUploadProfilePicture() {
  const queryClient = useQueryClient();
  const showToast = useToastStore((state) => state.showToast);

  return useMutation({
    mutationFn: async (file: File) => {
      const response = await profileService.uploadProfilePicture(file);
      // Throw error if API returns status: false to trigger onError callback
      if (!response.status) {
        throw new Error(response.message || "Failed to upload profile picture");
      }
      return response;
    },
    onSuccess: (response) => {
      showToast(
        response.message || "Profile picture uploaded successfully",
        "success"
      );
      // Invalidate user queries to refetch updated profile
      queryClient.invalidateQueries({ queryKey: authKeys.user() });
      queryClient.invalidateQueries({ queryKey: profileKeys.picture() });
    },
    onError: (error) => {
      console.error("Upload profile picture error:", error);
      const errorMessage =
        (error as any)?.message ||
        (error as { response?: { data?: { message?: string } } })?.response
          ?.data?.message || 
        "Failed to upload profile picture";
      showToast(errorMessage, "error");
    },
  });
}

/**
 * Update Profile Mutation
 */
export function useUpdateProfile() {
  const queryClient = useQueryClient();
  const showToast = useToastStore((state) => state.showToast);

  return useMutation({
    mutationFn: async (data: UpdateProfileRequest) => {
      const response = await profileService.updateProfile(data);
      // Throw error if API returns status: false to trigger onError callback
      if (!response.status) {
        throw new Error(response.message || "Failed to update profile");
      }
      return response;
    },
    onSuccess: (response) => {
      showToast(
        response.message || "Profile updated successfully",
        "success"
      );
      // Invalidate user queries to refetch updated profile
      queryClient.invalidateQueries({ queryKey: authKeys.user() });
      queryClient.invalidateQueries({ queryKey: profileKeys.all });
    },
    onError: (error) => {
      console.error("Update profile error:", error);
      const errorMessage =
        (error as any)?.message ||
        (error as { response?: { data?: { message?: string } } })?.response
          ?.data?.message || 
        "Failed to update profile";
      showToast(errorMessage, "error");
    },
  });
}

