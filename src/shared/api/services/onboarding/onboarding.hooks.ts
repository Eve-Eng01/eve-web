/**
 * Onboarding Hooks (TanStack Query)
 * React Query hooks for onboarding operations
 */

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { onboardingService } from "./onboarding.service";
import type { CreateOnboardingRequest } from "./types";
import { useToastStore } from "../../../stores/toast-store";
import { useAuthStore } from "../../../stores/auth-store";

/**
 * Query Keys
 */
export const onboardingKeys = {
  all: ["onboarding"] as const,
  profile: () => [...onboardingKeys.all, "profile"] as const,
};

/**
 * Create Onboarding Profile Mutation
 */
export function useCreateOnboardingProfile() {
  const navigate = useNavigate();
  const showToast = useToastStore((state) => state.showToast);
  const { setUser } = useAuthStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateOnboardingRequest) =>
      onboardingService.createProfile(data),
    onSuccess: (response) => {
      if (response.status && response.data) {
        // Update user's onboarded status
        const currentUser = useAuthStore.getState().user;
        if (currentUser) {
          setUser({
            ...currentUser,
            isOnboarded: true,
          });
        }

        // Invalidate onboarding queries
        queryClient.invalidateQueries({ queryKey: onboardingKeys.all });

        // Show success message
        const roleMessage =
          response.data.profile[0]?.organizer_id
            ? "Event Organizer profile created successfully!"
            : "Vendor profile created successfully!";
        showToast(response.message || roleMessage, "success");

        // Navigate to success page or appropriate dashboard
        navigate({ to: "/status/success" });
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

