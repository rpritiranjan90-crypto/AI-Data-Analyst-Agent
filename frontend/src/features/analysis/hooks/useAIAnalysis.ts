import { useMemo } from "react";

import { useAnalysisData } from "../context/AnalysisContext";
import { analyzeDataset } from "../engine";

export function useAIAnalysis() {
  const analysis = useAnalysisData();

  return useMemo(() => {
    return analyzeDataset(analysis);
  }, [analysis]);
}