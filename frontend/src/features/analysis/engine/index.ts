import type { AnalysisSummaryResponse } from "../types/analysis";

import {
  calculateDatasetScore,
} from "./scoring";

import {
  calculateMLReadiness,
} from "./mlReadiness";

import {
  generateExecutiveSummary,
} from "./executiveSummary";

import {
  generateFeatureEngineering,
} from "./featureEngineering";

import {
  recommendModels,
} from "./modelRecommendation";

import {
  calculateConfidence,
} from "./confidence";

export function analyzeDataset(
  data: AnalysisSummaryResponse
) {
  const datasetScore =
    calculateDatasetScore(data);

  const mlReadiness =
    calculateMLReadiness(
      data,
      datasetScore
    );

  const executiveSummary =
    generateExecutiveSummary(data);

  const featureEngineering =
    generateFeatureEngineering(data);

  const modelRecommendations =
    recommendModels(data);

  const confidence =
    calculateConfidence(data);

  return {
    datasetScore,
    mlReadiness,
    executiveSummary,
    featureEngineering,
    modelRecommendations,
    confidence,
  };
}