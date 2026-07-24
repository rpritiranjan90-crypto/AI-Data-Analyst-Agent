import type { AnalysisSummaryResponse } from "../types/analysis";

import {
  calculateDatasetScore,
} from "./scoring";

import {
  calculateMLReadiness,
} from "./mlReadiness";

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

  const featureEngineering =
    generateFeatureEngineering(data);

  const modelRecommendations =
    recommendModels(data);

  const confidence =
    calculateConfidence(data);

  return {
    datasetScore,
    mlReadiness,
    featureEngineering,
    modelRecommendations,
    confidence,
  };
}