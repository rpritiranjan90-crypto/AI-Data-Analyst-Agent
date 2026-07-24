import type { AnalysisSummaryResponse } from "../types/analysis";

import { calculateDatasetScore } from "./scoring";
import { calculateMLReadiness } from "./mlReadiness";

import { getStrongCorrelationCount } from "./helpers/correlation";
import { getMissingPercentage } from "./helpers/descriptive";

export interface RecommendedModel {
  name: string;
  score: number;
  category: "Classification" | "Regression" | "General";
  reason: string;
}

export function recommendModels(
  data: AnalysisSummaryResponse
): RecommendedModel[] {

  const datasetScore = calculateDatasetScore(data);
  const readiness = calculateMLReadiness(data, datasetScore);

  const missing = getMissingPercentage(data);
  const correlation = getStrongCorrelationCount(data);

  const models: RecommendedModel[] = [];

  let randomForest = 95;
  let xgboost = 93;
  let lightgbm = 90;
  let catboost = 88;
  let logistic = 80;

  if (missing > 10) {
    randomForest -= 3;
    xgboost -= 5;
    logistic -= 8;
  }

  if (correlation > 10) {
    logistic -= 5;
  }

  if (readiness.score < 80) {
    xgboost -= 5;
    logistic -= 5;
  }

  models.push({
    name: "Random Forest",
    score: randomForest,
    category: "General",
    reason:
      "Excellent baseline model for structured datasets."
  });

  models.push({
    name: "XGBoost",
    score: xgboost,
    category: "General",
    reason:
      "High predictive performance for tabular data."
  });

  models.push({
    name: "LightGBM",
    score: lightgbm,
    category: "General",
    reason:
      "Fast and efficient boosting algorithm."
  });

  models.push({
    name: "CatBoost",
    score: catboost,
    category: "General",
    reason:
      "Strong performance with categorical features."
  });

  models.push({
    name: "Logistic Regression",
    score: logistic,
    category: "Classification",
    reason:
      "Simple and interpretable baseline."
  });

  return models.sort((a, b) => b.score - a.score);
}