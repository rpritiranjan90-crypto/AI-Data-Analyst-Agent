import type { AnalysisSummaryResponse } from "../../types/analysis";
import type { AnalysisIntelligence } from "./types";

import { calculateDatasetScore } from "../scoring";
import { calculateMLReadiness } from "../mlReadiness";
import { calculateConfidence } from "../confidence";
import { recommendModels } from "../modelRecommendation";

export interface AnalysisEngineOptions {
  metadata?: {
    rows: number;
    columns: number;
    memory_usage_mb: number;
    missing_values: number;
    duplicate_rows: number;
  };
}

function getDatasetLevel(
  score: number,
): "Excellent" | "Good" | "Average" | "Poor" {
  if (score >= 90) return "Excellent";
  if (score >= 75) return "Good";
  if (score >= 60) return "Average";
  return "Poor";
}

function getMLLevel(
  score: number,
): "High" | "Medium" | "Low" {
  if (score >= 90) return "High";
  if (score >= 70) return "Medium";
  return "Low";
}

export class AnalysisEngine {
  static analyze(
    data: AnalysisSummaryResponse,
    _options?: AnalysisEngineOptions,
  ): AnalysisIntelligence {
    const dataset = calculateDatasetScore(data);

    const ml = calculateMLReadiness(
      data,
      dataset,
    );

    const confidence =
      calculateConfidence(data);

    const models =
      recommendModels(data);

    const strengths: string[] = [];

    const risks: string[] = [];

    const recommendations: string[] = [];

    const findings: string[] = [];

    if (dataset.score >= 90) {
      strengths.push(
        "Excellent dataset quality",
      );
    } else if (dataset.score >= 75) {
      strengths.push(
        "Good dataset quality",
      );
    } else {
      risks.push(
        "Dataset quality needs improvement",
      );
    }

    if (ml.score >= 90) {
      strengths.push(
        "Machine learning ready",
      );
    } else {
      recommendations.push(
        "Perform additional preprocessing.",
      );
    }

    if (confidence.score < 80) {
      risks.push(
        "Confidence score is below optimal.",
      );
    }

    if (models.length > 0) {
      findings.push(
        `${models.length} machine learning models recommended.`,
      );
    }

    recommendations.push(
      "Validate models using cross-validation.",
    );

    recommendations.push(
      "Perform feature engineering.",
    );

    return {
      raw: data,

      datasetHealth: {
        score: dataset.score,
        level: getDatasetLevel(
          dataset.score,
        ),
      },

      mlReadiness: {
        score: ml.score,
        level: getMLLevel(
          ml.score,
        ),
      },

      confidence,

      risk: {
        score:
          Math.round(
            100 -
              (
                dataset.score +
                ml.score +
                confidence.score
              ) /
                3,
          ),

        level:
          dataset.score >= 90
            ? "Low"
            : dataset.score >= 70
            ? "Medium"
            : "High",
      },

      models,

      insights: [
        {
          title: "Dataset Quality",
          description: `${getDatasetLevel(
            dataset.score,
          )} (${dataset.score}/100)`,
        },
        {
          title: "ML Readiness",
          description: `${getMLLevel(
            ml.score,
          )} (${ml.score}/100)`,
        },
        {
          title: "Confidence",
          description: `${confidence.level} (${confidence.score}/100)`,
        },
      ],

      strengths,

      risks,

      recommendations,

      findings,
    };
  }
}

export default AnalysisEngine;