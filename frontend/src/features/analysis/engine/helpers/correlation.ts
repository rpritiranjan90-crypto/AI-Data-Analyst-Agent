import type { AnalysisSummaryResponse } from "../../types/analysis";

export function getStrongCorrelationCount(
  data: AnalysisSummaryResponse
): number {
  return data.correlation.strong_correlations.length;
}

export function hasStrongCorrelations(
  data: AnalysisSummaryResponse
): boolean {
  return (
    getStrongCorrelationCount(data) > 0
  );
}

export function getAverageCorrelation(
  data: AnalysisSummaryResponse
): number {
  const correlations =
    data.correlation.strong_correlations;

  if (correlations.length === 0) {
    return 0;
  }

  const total = correlations.reduce(
    (sum, item) => sum + item.absolute_correlation,
    0
  );

  return total / correlations.length;
}