/**
 * Payout Hooks (TanStack Query)
 * React Query hooks for payout operations
 */

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { payoutService } from "./payout.service";
import type {
  CreatePayoutAccountRequest,
  UpdatePayoutAccountRequest,
} from "./types";
import { useToastStore } from "../../../stores/toast-store";
import { extractPayoutErrorMessage } from "./payout-error-handler";

/**
 * Query Keys
 */
export const payoutKeys = {
  all: ["payouts"] as const,
  lists: () => [...payoutKeys.all, "list"] as const,
  list: () => [...payoutKeys.lists()] as const,
  details: () => [...payoutKeys.all, "detail"] as const,
  detail: (id: string) => [...payoutKeys.details(), id] as const,
};

/**
 * Get Payout Accounts Query
 */
export function useGetPayoutAccounts(enabled = true) {
  return useQuery({
    queryKey: payoutKeys.list(),
    queryFn: async () => {
      const response = await payoutService.getPayoutAccounts();
      if (!response.status) {
        throw new Error(response.message || "Failed to fetch payout accounts");
      }
      return response;
    },
    enabled,
    staleTime: 30000, // 30 seconds
    gcTime: 5 * 60 * 1000, // 5 minutes (formerly cacheTime)
    retry: 2, // Retry failed requests 2 times
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000), // Exponential backoff
  });
}

/**
 * Get Payout Account by ID Query
 */
export function useGetPayoutAccount(payoutId: string, enabled = true) {
  return useQuery({
    queryKey: payoutKeys.detail(payoutId),
    queryFn: async () => {
      const response = await payoutService.getPayoutAccount(payoutId);
      if (!response.status) {
        throw new Error(response.message || "Failed to fetch payout account");
      }
      return response;
    },
    enabled: enabled && !!payoutId,
    staleTime: 30000, // 30 seconds
  });
}

/**
 * Create Payout Account Mutation
 */
export function useCreatePayoutAccount() {
  const queryClient = useQueryClient();
  const showToast = useToastStore((state) => state.showToast);

  return useMutation({
    mutationFn: async (data: CreatePayoutAccountRequest) => {
      const response = await payoutService.createPayoutAccount(data);
      if (!response.status) {
        throw new Error(response.message || "Failed to create payout account");
      }
      return response;
    },
    onSuccess: (response) => {
      showToast(
        response.message || "Payout account created successfully",
        "success"
      );
      // Invalidate payout accounts list to refetch
      queryClient.invalidateQueries({ queryKey: payoutKeys.lists() });
    },
    onError: (error) => {
      console.error("Create payout account error:", error);
      const errorMessage = extractPayoutErrorMessage(error);
      showToast(errorMessage, "error");
    },
  });
}

/**
 * Update Payout Account Mutation
 */
export function useUpdatePayoutAccount() {
  const queryClient = useQueryClient();
  const showToast = useToastStore((state) => state.showToast);

  return useMutation({
    mutationFn: async ({
      payoutId,
      data,
    }: {
      payoutId: string;
      data: UpdatePayoutAccountRequest;
    }) => {
      const response = await payoutService.updatePayoutAccount(payoutId, data);
      if (!response.status) {
        throw new Error(response.message || "Failed to update payout account");
      }
      return response;
    },
    onSuccess: (response, variables) => {
      showToast(
        response.message || "Payout account updated successfully",
        "success"
      );
      // Invalidate payout accounts list to refetch with updated data
      queryClient.invalidateQueries({ queryKey: payoutKeys.lists() });
      // Remove specific detail query from cache since we're updating the list
      queryClient.removeQueries({
        queryKey: payoutKeys.detail(variables.payoutId),
      });
    },
    onError: (error) => {
      console.error("Update payout account error:", error);
      const errorMessage = extractPayoutErrorMessage(error);
      showToast(errorMessage, "error");
    },
  });
}

/**
 * Delete Payout Account Mutation
 */
export function useDeletePayoutAccount() {
  const queryClient = useQueryClient();
  const showToast = useToastStore((state) => state.showToast);

  return useMutation({
    mutationFn: async (payoutId: string) => {
      const response = await payoutService.deletePayoutAccount(payoutId);
      if (!response.status) {
        throw new Error(response.message || "Failed to delete payout account");
      }
      return response;
    },
    onSuccess: (response) => {
      showToast(
        response.message || "Payout account deleted successfully",
        "success"
      );
      // Invalidate payout accounts list to refetch
      queryClient.invalidateQueries({ queryKey: payoutKeys.lists() });
    },
    onError: (error) => {
      console.error("Delete payout account error:", error);
      const errorMessage = extractPayoutErrorMessage(error);
      showToast(errorMessage, "error");
    },
  });
}

