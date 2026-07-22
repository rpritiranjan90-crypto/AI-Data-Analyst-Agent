import { useQuery } from "@tanstack/react-query";

import analysisService from "../services/analysisService";
import { analysisKeys } from "../utils/queryKeys";

export function useCategorical() {
  return useQuery({
    queryKey: analysisKeys.categorical(),

    queryFn: () => analysisService.getCategorical(),

    staleTime: 1000 * 60 * 5,

    gcTime: 1000 * 60 * 30,

    retry: 2,

    refetchOnWindowFocus: false,
  });
}