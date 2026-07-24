import type { DatasetQuality } from "./types";

export function calculatePercentage(
  value: number,
  total: number,
): number {
  if (total <= 0) return 0;

  return Number(((value / total) * 100).toFixed(2));
}

export function calculateDatasetScore(
  missingPercentage: number,
  duplicatePercentage: number,
): number {
  let score = 100;

  score -= missingPercentage * 0.6;
  score -= duplicatePercentage * 0.4;

  return Math.max(0, Math.min(100, Math.round(score)));
}

export function calculateReadinessScore(
  datasetScore: number,
  numericColumns: number,
  totalColumns: number,
): number {
  if (totalColumns === 0) return 0;

  const numericRatio =
    numericColumns / totalColumns;

  const score =
    datasetScore * 0.7 +
    numericRatio * 100 * 0.3;

  return Math.round(score);
}

export function getQualityLabel(
  score: number,
): DatasetQuality {
  if (score >= 90) return "Excellent";
  if (score >= 75) return "Good";
  if (score >= 60) return "Fair";
  return "Poor";
}

export function generateStrengths(
  score: number,
  missingPercentage: number,
  duplicatePercentage: number,
): string[] {
  const strengths: string[] = [];

  if (score >= 90) {
    strengths.push(
      "Excellent overall dataset quality.",
    );
  }

  if (missingPercentage < 5) {
    strengths.push(
      "Very few missing values detected.",
    );
  }

  if (duplicatePercentage === 0) {
    strengths.push(
      "No duplicate rows detected.",
    );
  }

  return strengths;
}

export function generateWarnings(
  missingPercentage: number,
  duplicatePercentage: number,
): string[] {
  const warnings: string[] = [];

  if (missingPercentage >= 10) {
    warnings.push(
      "High percentage of missing values.",
    );
  }

  if (duplicatePercentage >= 5) {
    warnings.push(
      "Dataset contains a significant number of duplicate rows.",
    );
  }

  return warnings;
}

export function generateRecommendations(
  quality: DatasetQuality,
  missingPercentage: number,
  duplicatePercentage: number,
): string[] {
  const recommendations: string[] = [];

  switch (quality) {
    case "Excellent":
      recommendations.push(
        "Dataset is ready for advanced analytics and machine learning.",
      );
      break;

    case "Good":
      recommendations.push(
        "Perform minor preprocessing before model training.",
      );
      break;

    case "Fair":
      recommendations.push(
        "Clean missing values and validate duplicates before analysis.",
      );
      break;

    case "Poor":
      recommendations.push(
        "Perform comprehensive data cleaning before using this dataset.",
      );
      break;
  }

  if (missingPercentage >= 10) {
    recommendations.push(
      "Review columns with high missing-value percentages.",
    );
  }

  if (duplicatePercentage > 0) {
    recommendations.push(
      "Review and remove duplicate records where appropriate.",
    );
  }

  return recommendations;
}