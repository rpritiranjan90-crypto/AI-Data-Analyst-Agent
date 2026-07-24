import { useMemo } from "react";

import { useAnalysisData } from "../context/AnalysisContext";

import { generateAIReport } from "../engine/report";

export function useAIReport() {
  const analysis = useAnalysisData();

  return useMemo(() => {
    return generateAIReport(analysis);
  }, [analysis]);
}