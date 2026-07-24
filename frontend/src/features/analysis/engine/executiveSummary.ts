import type { AnalysisSummaryResponse } from "../types/analysis";

import { calculateDatasetScore } from "./scoring";
import { calculateMLReadiness } from "./mlReadiness";

export interface ExecutiveSummaryResult {
  assessment: string;
  score: number;
  summary: string;
}

export function generateExecutiveSummary(
  data: AnalysisSummaryResponse
): ExecutiveSummaryResult {

  const dataset = calculateDatasetScore(data);
  const ml = calculateMLReadiness(data, dataset);

  const assessment =
    dataset.score >= 90
      ? "Excellent"
      : dataset.score >= 80
      ? "Good"
      : dataset.score >= 70
      ? "Fair"
      : "Needs Attention";

  const parts: string[] = [];

  if (dataset.reasons.length > 0) {
    parts.push(...dataset.reasons);
  }

  if (ml.improvements.length > 0) {
    parts.push(...ml.improvements);
  }

  return {
    assessment,
    score: ml.score,
    summary:
      parts.join(" ") ||
      "The dataset is well prepared for analysis and machine learning.",
  };
}