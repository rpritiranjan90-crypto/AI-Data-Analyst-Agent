import { useQuery } from "@tanstack/react-query";

import analysisService from "../services/analysisService";
import { analysisKeys } from "../utils/queryKeys";

export function useAnalysisInsights() {
  return useQuery({
    queryKey: analysisKeys.insights(),

    queryFn: () => analysisService.getInsights(),

    staleTime: 1000 * 60 * 5,

    gcTime: 1000 * 60 * 30,

    retry: 2,

    refetchOnWindowFocus: false,
  });
}