import { ApiResponse } from "../..";

export type AggregatorData = {
  aggregatedProposals: {
    sent: number;
    received: number;
    withdrawn: number;
    accepted: number;
    declined: number;
  };
};

export type AggregatorResponse = ApiResponse<AggregatorData>;
