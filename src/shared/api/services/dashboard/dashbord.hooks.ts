import { useQuery } from "@tanstack/react-query";
import { dashboardService } from "./dashboard.service";

export const useGetAggregatorData = () => {
  return useQuery({
    queryKey: ["aggregator-data"],
    queryFn: () => dashboardService.getAggregatorData(),
  });
};
