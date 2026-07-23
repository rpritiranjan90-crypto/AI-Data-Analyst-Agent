import {
  createContext,
  useContext,
  type ReactNode,
} from "react";

import type { AnalysisSummaryResponse } from "../types/analysis";

const AnalysisContext = createContext<AnalysisSummaryResponse | null>(null);

interface AnalysisProviderProps {
  data: AnalysisSummaryResponse;
  children: ReactNode;
}

export function AnalysisProvider({
  data,
  children,
}: AnalysisProviderProps) {
  return (
    <AnalysisContext.Provider value={data}>
      {children}
    </AnalysisContext.Provider>
  );
}

export function useAnalysisData() {
  const context = useContext(AnalysisContext);

  if (!context) {
    throw new Error(
      "useAnalysisData must be used inside AnalysisProvider"
    );
  }

  return context;
}