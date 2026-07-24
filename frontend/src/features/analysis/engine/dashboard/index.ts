import type { DashboardSummary } from "./types";

export function generateDashboardSummary(
  datasetScore: number,
  mlReadiness: number,
  confidence: number,
  estimatedSuccess: number,
  bestModel: string,
  risk: string,
  nextAction: string
): DashboardSummary {
  let overallStatus: DashboardSummary["overallStatus"] =
    "Needs Improvement";

  const average = Math.round(
    (datasetScore +
      mlReadiness +
      confidence +
      estimatedSuccess) / 4
  );

  if (average >= 90) {
    overallStatus = "Excellent";
  } else if (average >= 75) {
    overallStatus = "Good";
  } else if (average >= 60) {
    overallStatus = "Average";
  }

  return {
    datasetScore,
    mlReadiness,
    confidence,
    estimatedSuccess,
    overallStatus,
    bestModel,
    risk,
    nextAction,
  };
}