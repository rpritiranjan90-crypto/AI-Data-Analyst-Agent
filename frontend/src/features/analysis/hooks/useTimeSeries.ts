import { useQuery } from "@tanstack/react-query";

import analysisService from "../services/analysisService";
import { analysisKeys } from "../utils/queryKeys";

export function useTimeSeries() {
  return useQuery({
    queryKey: analysisKeys.timeSeries(),

    queryFn: () => analysisService.getTimeSeries(),

    staleTime: 1000 * 60 * 5,

    gcTime: 1000 * 60 * 30,

    retry: 2,

    refetchOnWindowFocus: false,
  });
}