import type { AnalysisSummaryResponse } from "../types/analysis";

import { AI_RULES } from "./rules";

import {
  getMissingPercentage,
} from "./helpers/descriptive";

import {
  getNormalDistributionRatio,
  getTotalOutliers,
} from "./helpers/distribution";

import {
  getStrongCorrelationCount,
} from "./helpers/correlation";

export interface DatasetScoreResult {
  score: number;
  grade: "A" | "B" | "C" | "D" | "F";
  status: string;
  confidence: number;
  reasons: string[];
}

export function calculateDatasetScore(
  data: AnalysisSummaryResponse
): DatasetScoreResult {
  let score = AI_RULES.datasetScore.maxScore;

  const reasons: string[] = [];

  /* ====================================================== */
  /* Missing Values                                          */
  /* ====================================================== */

  const missingPercentage =
    getMissingPercentage(data);

  if (
    missingPercentage >
    AI_RULES.missingValues.highThreshold
  ) {
    score -= AI_RULES.missingValues.highPenalty;

    reasons.push(
      "High percentage of missing values detected."
    );
  } else if (
    missingPercentage >
    AI_RULES.missingValues.mediumThreshold
  ) {
    score -= AI_RULES.missingValues.mediumPenalty;

    reasons.push(
      "Moderate missing values detected."
    );
  } else if (
    missingPercentage >
    AI_RULES.missingValues.lowThreshold
  ) {
    score -= AI_RULES.missingValues.lowPenalty;

    reasons.push(
      "Small amount of missing values detected."
    );
  } else {
    reasons.push(
      "Very low percentage of missing values."
    );
  }

  /* ====================================================== */
  /* Outliers                                                */
  /* ====================================================== */

  const outliers = getTotalOutliers(data);

  if (
    outliers >
    AI_RULES.outliers.highThreshold
  ) {
    score -= AI_RULES.outliers.highPenalty;

    reasons.push(
      "Large number of outliers detected."
    );
  } else if (
    outliers >
    AI_RULES.outliers.mediumThreshold
  ) {
    score -= AI_RULES.outliers.mediumPenalty;

    reasons.push(
      "Moderate number of outliers detected."
    );
  } else {
    reasons.push(
      "Outlier levels are acceptable."
    );
  }

  /* ====================================================== */
  /* Correlation                                             */
  /* ====================================================== */

  const strongCorrelationCount =
    getStrongCorrelationCount(data);

  if (
    strongCorrelationCount >
    AI_RULES.correlation.strongThreshold
  ) {
    score -= AI_RULES.correlation.penalty;

    reasons.push(
      "Many highly correlated features detected."
    );
  } else {
    reasons.push(
      "Correlation levels are acceptable."
    );
  }

  /* ====================================================== */
  /* Distribution                                            */
  /* ====================================================== */

  const normalRatio =
    getNormalDistributionRatio(data);

  if (
    normalRatio <
    AI_RULES.distribution.normalRatioThreshold
  ) {
    score -= AI_RULES.distribution.penalty;

    reasons.push(
      "Several numeric columns are not normally distributed."
    );
  } else {
    reasons.push(
      "Most numeric columns have acceptable distributions."
    );
  }

  /* ====================================================== */
  /* Clamp                                                   */
  /* ====================================================== */

  score = Math.max(
    AI_RULES.datasetScore.minScore,
    Math.min(
      AI_RULES.datasetScore.maxScore,
      Math.round(score)
    )
  );

  /* ====================================================== */
  /* Grade                                                   */
  /* ====================================================== */

  let grade: DatasetScoreResult["grade"] = "F";
  let status = "Needs Improvement";

  if (score >= AI_RULES.datasetScore.grade.A) {
    grade = "A";
    status = "Excellent";
  } else if (
    score >= AI_RULES.datasetScore.grade.B
  ) {
    grade = "B";
    status = "Very Good";
  } else if (
    score >= AI_RULES.datasetScore.grade.C
  ) {
    grade = "C";
    status = "Good";
  } else if (
    score >= AI_RULES.datasetScore.grade.D
  ) {
    grade = "D";
    status = "Fair";
  }

  /* ====================================================== */
  /* Confidence                                              */
  /* ====================================================== */

  const confidence = Math.max(
    AI_RULES.confidence.minimum,
    Math.min(
      AI_RULES.confidence.maximum,
      Math.round(score * 0.96)
    )
  );

  return {
    score,
    grade,
    status,
    confidence,
    reasons,
  };
}