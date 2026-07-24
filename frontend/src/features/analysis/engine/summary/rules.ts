import type { ExecutiveSummaryInput } from "./types";

export function getDatasetHealth(
  score: number,
): string {
  if (score >= 90) return "Excellent";
  if (score >= 75) return "Good";
  if (score >= 60) return "Average";

  return "Poor";
}

export function getRiskLevel(
  input: ExecutiveSummaryInput,
): string {
  let riskScore = 0;

  if ((input.missingValues ?? 0) > 0) {
    riskScore++;
  }

  if ((input.outlierCount ?? 0) > 20) {
    riskScore++;
  }

  if (input.datasetScore < 70) {
    riskScore++;
  }

  if (input.confidence < 75) {
    riskScore++;
  }

  if (riskScore === 0) return "Low";
  if (riskScore <= 2) return "Medium";

  return "High";
}

export function getVerdict(
  input: ExecutiveSummaryInput,
): string {
  if (
    input.datasetScore >= 90 &&
    input.mlReadiness >= 90 &&
    input.confidence >= 90
  ) {
    return "Production Ready";
  }

  if (
    input.datasetScore >= 75 &&
    input.mlReadiness >= 75
  ) {
    return "Ready with Minor Improvements";
  }

  return "Needs Additional Preparation";
}