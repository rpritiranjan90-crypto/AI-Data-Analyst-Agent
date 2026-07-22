import { useQuery } from "@tanstack/react-query";

import analysisService from "../services/analysisService";
import { analysisKeys } from "../utils/queryKeys";

export function useCorrelation(
  method: "pearson" | "spearman" | "kendall" = "pearson"
) {
  return useQuery({
    queryKey: analysisKeys.correlation(method),

    queryFn: () => analysisService.getCorrelation(method),

    staleTime: 1000 * 60 * 5,

    gcTime: 1000 * 60 * 30,

    retry: 2,

    refetchOnWindowFocus: false,
  });
}