import type { AnalysisSummaryResponse } from "../types/analysis";

import { calculateDatasetScore } from "./scoring";
import { calculateMLReadiness } from "./mlReadiness";

export interface ConfidenceResult {
  score: number;
  level: "High" | "Medium" | "Low";
  reasons: string[];
}

export function calculateConfidence(
  data: AnalysisSummaryResponse
): ConfidenceResult {

  const dataset = calculateDatasetScore(data);
  const ml = calculateMLReadiness(data, dataset);

  const reasons = [...dataset.reasons];

  let confidence = Math.round(
    (dataset.confidence + ml.confidence) / 2
  );

  let level: ConfidenceResult["level"];

  if (confidence >= 90) {
    level = "High";
  } else if (confidence >= 75) {
    level = "Medium";
  } else {
    level = "Low";
  }

  return {
    score: confidence,
    level,
    reasons,
  };
}