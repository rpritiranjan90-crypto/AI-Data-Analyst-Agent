import type { AnalysisSummaryResponse } from "../types/analysis";

import { AI_RULES } from "./rules";
import { calculateDatasetScore, type DatasetScoreResult } from "./scoring";

import { getMissingPercentage } from "./helpers/descriptive";
import {
  getTotalOutliers,
  getNormalDistributionRatio,
} from "./helpers/distribution";
import { getStrongCorrelationCount } from "./helpers/correlation";

export interface MLReadinessResult {
  score: number;
  status: "Ready" | "Almost Ready" | "Needs Preparation";
  confidence: number;
  strengths: string[];
  improvements: string[];
}

export function calculateMLReadiness(
  data: AnalysisSummaryResponse,
  datasetScore?: DatasetScoreResult
): MLReadinessResult {
  const quality = datasetScore ?? calculateDatasetScore(data);

  let score = quality.score;

  const strengths: string[] = [];
  const improvements: string[] = [];

  const missingPercentage = getMissingPercentage(data);
  const outliers = getTotalOutliers(data);
  const correlations = getStrongCorrelationCount(data);
  const normalRatio = getNormalDistributionRatio(data);

  // Missing values
  if (missingPercentage <= AI_RULES.missingValues.lowThreshold) {
    strengths.push("Minimal missing values.");
  } else {
    score -= AI_RULES.mlReadiness.missingPenalty;
    improvements.push(
      "Handle missing values before model training."
    );
  }

  // Outliers
  if (outliers <= AI_RULES.outliers.mediumThreshold) {
    strengths.push("Outlier count is acceptable.");
  } else {
    score -= AI_RULES.mlReadiness.outlierPenalty;
    improvements.push(
      "Review and treat extreme outliers."
    );
  }

  // Correlation
  if (
    correlations <= AI_RULES.correlation.strongThreshold
  ) {
    strengths.push(
      "Feature correlation is within acceptable limits."
    );
  } else {
    score -= AI_RULES.mlReadiness.correlationPenalty;
    improvements.push(
      "Review highly correlated features."
    );
  }

  // Distribution
  if (
    normalRatio >=
    AI_RULES.distribution.normalRatioThreshold
  ) {
    strengths.push(
      "Most numeric features have acceptable distributions."
    );
  } else {
    improvements.push(
      "Consider transforming skewed features."
    );
  }

  score = Math.max(0, Math.min(100, Math.round(score)));

  const confidence = Math.max(
    AI_RULES.confidence.minimum,
    Math.min(
      AI_RULES.confidence.maximum,
      Math.round(score * 0.96)
    )
  );

  let status: MLReadinessResult["status"];

  if (score >= 90) {
    status = "Ready";
  } else if (score >= 75) {
    status = "Almost Ready";
  } else {
    status = "Needs Preparation";
  }

  return {
    score,
    status,
    confidence,
    strengths,
    improvements,
  };
}