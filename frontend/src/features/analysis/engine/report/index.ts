import type { AIReport } from "./types";

import type { AnalysisSummaryResponse } from "../../types/analysis";

import { calculateDatasetScore } from "../scoring";
import { calculateMLReadiness } from "../mlReadiness";
import { generateExecutiveSummary } from "../executiveSummary";
import { generateFeatureEngineering } from "../featureEngineering";
import { recommendModels } from "../modelRecommendation";
import { calculateConfidence } from "../confidence";

export function generateAIReport(
  data: AnalysisSummaryResponse
): AIReport {

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

  const models =
    recommendModels(data);

  const confidence =
    calculateConfidence(data);

  return {
    title: "AI Dataset Analysis Report",

    generatedAt: new Date().toLocaleString(),

    metrics: [
      {
        label: "Dataset Score",
        value: `${datasetScore.score}/100`,
      },
      {
        label: "ML Readiness",
        value: `${mlReadiness.score}/100`,
      },
      {
        label: "Confidence",
        value: `${confidence.score}/100`,
      },
      {
        label: "Recommended Models",
        value: models.length,
      },
    ],

    executiveSummary: {
      title: "Executive Summary",
      content: executiveSummary.summary,
    },

    datasetHealth: {
      title: "Dataset Health",
      content:
        `Dataset Score: ${datasetScore.score}/100\n` +
        `ML Readiness: ${mlReadiness.score}/100\n` +
        `Confidence: ${confidence.score}/100 (${confidence.level})`,
    },

    featureEngineering: {
      title: "Feature Engineering",
      content:
        featureEngineering
          .map(
            (item) =>
              `• ${item.title}: ${item.action}`
          )
          .join("\n"),
    },

    modelRecommendations: {
      title: "Recommended Models",
      content:
        models
          .map(
            (model) =>
              `• ${model.name} (${model.score}/100) - ${model.reason}`
          )
          .join("\n"),
    },

    conclusion: {
      title: "Conclusion",
      content:
        `The dataset received a quality score of ${datasetScore.score}/100 with an ML readiness score of ${mlReadiness.score}/100. Based on the current analysis, the recommended preprocessing steps and model selection should be completed before production model training.`,
    },
  };
}