/**
 * Onboarding Hooks (TanStack Query)
 * React Query hooks for onboarding operations
 */

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { onboardingService } from "./onboarding.service";
import type { CreateOnboardingRequest, UpdateOnboardingRequest } from "./types";
import { useToastStore } from "../../../stores/toast-store";
import { useAuthStore } from "../../../stores/auth-store";
import { authKeys } from "../auth/auth.hooks";

/**
 * Query Keys
 */
export const onboardingKeys = {
  all: ["onboarding"] as const,
  profile: () => [...onboardingKeys.all, "profile"] as const,
};

/**
 * Create Onboarding Profile Mutation Options
 */
interface CreateOnboardingProfileOptions {
  /**
   * Whether to automatically navigate to success page on completion
   * @default true
   */
  autoNavigate?: boolean;
}

/**
 * Create Onboarding Profile Mutation
 */
export function useCreateOnboardingProfile(
  options: CreateOnboardingProfileOptions = {}
) {
  const { autoNavigate = true } = options;
  const navigate = useNavigate();
  const showToast = useToastStore((state) => state.showToast);
  const { setUser } = useAuthStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateOnboardingRequest) =>
      onboardingService.createProfile(data),
    onSuccess: (response) => {
      // Handle both boolean status and string "true" status
      const isSuccess = response.status === true || response.status === "true" as any;
      
      if (isSuccess && response.data) {
        // Update user's onboarded status
        const currentUser = useAuthStore.getState().user;
        if (currentUser) {
          setUser({
            ...currentUser,
            isOnboarded: true,
          });
        }

        // Invalidate onboarding queries and user queries
        queryClient.invalidateQueries({ queryKey: onboardingKeys.all });
        queryClient.invalidateQueries({ queryKey: authKeys.user() });

        // Show success message
        const roleMessage =
          response.data.profile[0]?.organizer_id
            ? "Event Organizer profile created successfully!"
            : "Vendor profile created successfully!";
        showToast(response.message || roleMessage, "success");

        // Navigate to success page if autoNavigate is enabled (default for organizers)
        if (autoNavigate) {
          navigate({ to: "/status/success" });
        }
      }
    },
    onError: (error) => {
      console.error("Onboarding error:", error);
      const errorMessage =
        (error as { response?: { data?: { message?: string } } })
          ?.response?.data?.message ||
        "Failed to create profile. Please try again.";
      showToast(errorMessage, "error");
    },
  });
}

/**
 * Update Onboarding Profile Mutation Options
 */
interface UpdateOnboardingProfileOptions {
  /**
   * Callback to be called on success
   */
  onSuccess?: () => void;
  /**
   * Whether to show a success toast
   * @default true
   */
  showSuccessToast?: boolean;
  /**
   * Custom success message
   */
  successMessage?: string;
  /**
   * Whether to navigate to success page on completion
   * @default false (only true when completed flag is set)
   */
  autoNavigate?: boolean;
}

/**
 * Update Onboarding Profile Mutation
 * Used for steps 3 onwards in the onboarding process
 */
export function useUpdateOnboardingProfile(
  options: UpdateOnboardingProfileOptions = {}
) {
  const {
    onSuccess: onSuccessCallback,
    showSuccessToast = true,
    successMessage,
    autoNavigate = false,
  } = options;
  const navigate = useNavigate();
  const showToast = useToastStore((state) => state.showToast);
  const { setUser } = useAuthStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateOnboardingRequest) =>
      onboardingService.updateProfile(data),
    onSuccess: (response, variables) => {
      // Handle both boolean status and string "true" status
      const isSuccess = response.status === true || response.status === "true" as any;
      
      if (isSuccess) {
        // If completed flag is true, update user's onboarded status
        if (variables.completed) {
          const currentUser = useAuthStore.getState().user;
          if (currentUser) {
            setUser({
              ...currentUser,
              isOnboarded: true,
            });
          }
        }

        // Invalidate onboarding queries and user queries
        queryClient.invalidateQueries({ queryKey: onboardingKeys.all });
        queryClient.invalidateQueries({ queryKey: authKeys.user() });

        // Show success message
        if (showSuccessToast) {
          const message =
            successMessage ||
            response.message ||
            (variables.completed
              ? "Profile completed successfully!"
              : "Profile updated successfully!");
          showToast(message, "success");
        }

        // Call custom success callback
        if (onSuccessCallback) {
          onSuccessCallback();
        }

        // Navigate to success page if autoNavigate is enabled or completed is true
        if (autoNavigate || variables.completed) {
          navigate({ to: "/status/success" });
        }
      }
    },
    onError: (error) => {
      console.error("Update onboarding error:", error);
      const errorMessage =
        (error as { response?: { data?: { message?: string } } })
          ?.response?.data?.message ||
        "Failed to update profile. Please try again.";
      showToast(errorMessage, "error");
    },
  });
}

