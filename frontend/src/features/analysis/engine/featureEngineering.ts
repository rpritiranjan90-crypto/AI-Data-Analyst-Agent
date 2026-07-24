import type { AnalysisSummaryResponse } from "../types/analysis";

import { AI_RULES } from "./rules";

import { getMissingPercentage } from "./helpers/descriptive";
import {
  getNormalDistributionRatio,
  getTotalOutliers,
} from "./helpers/distribution";
import { getStrongCorrelationCount } from "./helpers/correlation";

export interface FeatureRecommendation {
  title: string;
  priority: "High" | "Medium" | "Low";
  action: string;
  reason: string;
}

export function generateFeatureEngineering(
  data: AnalysisSummaryResponse
): FeatureRecommendation[] {
  const recommendations: FeatureRecommendation[] = [];

  const missingPercentage = getMissingPercentage(data);
  const outliers = getTotalOutliers(data);
  const correlationCount = getStrongCorrelationCount(data);
  const normalRatio = getNormalDistributionRatio(data);

  // Missing values
  if (missingPercentage > AI_RULES.missingValues.lowThreshold) {
    recommendations.push({
      title: "Missing Values",
      priority:
        missingPercentage > AI_RULES.missingValues.mediumThreshold
          ? "High"
          : "Medium",
      action: "Apply mean, median, or model-based imputation.",
      reason:
        "Missing values can reduce model accuracy and bias training.",
    });
  }

  // Outliers
  if (outliers > AI_RULES.outliers.mediumThreshold) {
    recommendations.push({
      title: "Outlier Treatment",
      priority: "High",
      action: "Review outliers using IQR, Winsorization, or transformation.",
      reason:
        "Extreme values may negatively affect statistical and ML models.",
    });
  }

  // Correlation
  if (correlationCount > AI_RULES.correlation.strongThreshold) {
    recommendations.push({
      title: "Feature Selection",
      priority: "Medium",
      action: "Remove or combine highly correlated features.",
      reason:
        "Reducing multicollinearity improves model stability.",
    });
  }

  // Distribution
  if (normalRatio < AI_RULES.distribution.normalRatioThreshold) {
    recommendations.push({
      title: "Feature Transformation",
      priority: "Medium",
      action:
        "Apply log, Box-Cox, or Yeo-Johnson transformations where appropriate.",
      reason:
        "Reducing skewness can improve model performance.",
    });
  }

  // Default
  if (recommendations.length === 0) {
    recommendations.push({
      title: "Dataset Ready",
      priority: "Low",
      action: "No major preprocessing required.",
      reason:
        "The dataset quality appears suitable for standard machine learning workflows.",
    });
  }

  return recommendations;
}