/**
 * Payout Service
 * API service functions for payout-related endpoints
 */

import { apiClient } from "../../client";
import { ApiResponse } from "../../config";
import type {
  CreatePayoutAccountRequest,
  CreatePayoutAccountResponse,
  UpdatePayoutAccountRequest,
  UpdatePayoutAccountResponse,
  GetPayoutAccountsResponse,
  GetPayoutAccountResponse,
  DeletePayoutAccountResponse,
} from "./types";

/**
 * Payout Service Endpoints
 */
export const payoutService = {
  /**
   * Get all payout accounts for the authenticated user
   */
  getPayoutAccounts: async (): Promise<
    ApiResponse<GetPayoutAccountsResponse>
  > => {
    const response = await apiClient.get<
      ApiResponse<GetPayoutAccountsResponse>
    >("/payouts/");
    return response.data;
  },

  /**
   * Get a payout account by ID
   */
  getPayoutAccount: async (
    payoutId: string
  ): Promise<ApiResponse<GetPayoutAccountResponse>> => {
    const response = await apiClient.get<ApiResponse<GetPayoutAccountResponse>>(
      `/payouts/${payoutId}`
    );
    return response.data;
  },

  /**
   * Create a new payout account
   */
  createPayoutAccount: async (
    data: CreatePayoutAccountRequest
  ): Promise<ApiResponse<CreatePayoutAccountResponse>> => {
    const response = await apiClient.post<
      ApiResponse<CreatePayoutAccountResponse>
    >("/payouts/", data);
    return response.data;
  },

  /**
   * Update a payout account
   */
  updatePayoutAccount: async (
    payoutId: string,
    data: UpdatePayoutAccountRequest
  ): Promise<ApiResponse<UpdatePayoutAccountResponse>> => {
    const response = await apiClient.patch<
      ApiResponse<UpdatePayoutAccountResponse>
    >(`/payouts/${payoutId}`, data);
    return response.data;
  },

  /**
   * Delete a payout account
   */
  deletePayoutAccount: async (
    payoutId: string
  ): Promise<ApiResponse<DeletePayoutAccountResponse>> => {
    const response = await apiClient.delete<
      ApiResponse<DeletePayoutAccountResponse>
    >(`/payouts/${payoutId}`);
    return response.data;
  },
};

