import { apiClient } from "../..";
import { AggregatorResponse } from "./types";

export const dashboardService = {
  getAggregatorData: async (): Promise<AggregatorResponse> => {
    try {
      const response = await apiClient.get<AggregatorResponse>(
        "/proposal/aggregate/vendor"
      );
      return response.data;
    } catch (error) {
      if (error && typeof error === "object" && "response" in error) {
        const axiosError = error as { response?: { data?: unknown } };
        throw axiosError.response?.data || error;
      }
      throw error;
    }
  },
};
