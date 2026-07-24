import type { AIInsights } from "./types";

export function generateInsights(
  datasetScore: number,
  mlReadiness: number,
  confidence: number
): AIInsights {
  let overallHealth = "Needs Improvement";

  if (datasetScore >= 90) {
    overallHealth = "Excellent";
  } else if (datasetScore >= 75) {
    overallHealth = "Good";
  } else if (datasetScore >= 60) {
    overallHealth = "Average";
  }

  const metrics = [
    {
      label: "Dataset Quality",
      value: datasetScore,
    },
    {
      label: "ML Readiness",
      value: mlReadiness,
    },
    {
      label: "Confidence",
      value: confidence,
    },
  ];

  const strongestArea = metrics.reduce((best, current) =>
    current.value > best.value ? current : best
  ).label;

  const weakestArea = metrics.reduce((worst, current) =>
    current.value < worst.value ? current : worst
  ).label;

  let nextAction = "Review dataset quality.";

  if (datasetScore < 80) {
    nextAction =
      "Clean missing values and improve dataset quality.";
  } else if (mlReadiness < 80) {
    nextAction =
      "Apply feature scaling and encoding before training.";
  } else if (confidence < 80) {
    nextAction =
      "Collect more representative data to improve confidence.";
  } else {
    nextAction =
      "Proceed with model training and validation.";
  }

  const estimatedSuccess = Math.round(
    (datasetScore + mlReadiness + confidence) / 3
  );

  let trainingComplexity: AIInsights["trainingComplexity"] =
    "High";

  if (estimatedSuccess >= 85) {
    trainingComplexity = "Low";
  } else if (estimatedSuccess >= 70) {
    trainingComplexity = "Medium";
  }

  return {
    overallHealth,
    strongestArea,
    weakestArea,
    nextAction,
    estimatedSuccess,
    trainingComplexity,
  };
}