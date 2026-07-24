import type { AIReport } from "./types";
import type { AnalysisSummaryResponse } from "../../types/analysis";

import AnalysisEngine from "../intelligence/AnalysisEngine";

import { generateExecutiveSummary } from "../executiveSummary";
import { generateFeatureEngineering } from "../featureEngineering";
import { generateCopilot } from "../copilot";
import { generateFeatureCards } from "../featureCards";
import { generateModelCards } from "../modelCards";
import { generateFindings } from "../findings";
import { generateInsights } from "../insights";

export function generateAIReport(
  data: AnalysisSummaryResponse,
): AIReport {
  const intelligence =
    AnalysisEngine.analyze(data);

  const executiveSummary =
    generateExecutiveSummary(data);

  const featureEngineering =
    generateFeatureEngineering(data);

  const copilot = generateCopilot(
    intelligence.datasetHealth.score,
    intelligence.mlReadiness.score,
    intelligence.confidence.score,
    intelligence.models.length,
  );

  const insights = generateInsights(
    intelligence.datasetHealth.score,
    intelligence.mlReadiness.score,
    intelligence.confidence.score,
  );

  const findings = generateFindings(
    intelligence.datasetHealth.score,
    intelligence.mlReadiness.score,
    intelligence.confidence.score,
    intelligence.models.length,
  );

  const featureCards = generateFeatureCards(
    intelligence.datasetHealth.score,
    intelligence.mlReadiness.score,
  );

  const modelCards =
    generateModelCards(
      intelligence.models,
    );

  return {
    title: "AI Dataset Analysis Report",

    generatedAt: new Date().toLocaleString(),

    metrics: [
      {
        label: "Dataset Score",
        value:
          intelligence.datasetHealth.score,
      },
      {
        label: "ML Readiness",
        value:
          intelligence.mlReadiness.score,
      },
      {
        label: "Confidence",
        value:
          intelligence.confidence.score,
      },
      {
        label: "Recommended Models",
        value:
          intelligence.models.length,
      },
    ],

    copilot,

    insights,

    findings,

    featureCards,

    modelCards,

    executiveSummary: {
      title: "Executive Summary",
      content:
        executiveSummary.summary,
    },

    datasetHealth: {
      title: "Dataset Health",
      content:
        `Dataset Score: ${intelligence.datasetHealth.score}/100\n` +
        `ML Readiness: ${intelligence.mlReadiness.score}/100\n` +
        `Confidence: ${intelligence.confidence.score}/100 (${intelligence.confidence.level})`,
    },

    featureEngineering: {
      title: "Feature Engineering",
      content:
        featureEngineering
          .map(
            (item) =>
              `• ${item.title}: ${item.action}`,
          )
          .join("\n"),
    },

    modelRecommendations: {
      title: "Recommended Models",
      content:
        intelligence.models
          .map(
            (model) =>
              `• ${model.name} (${model.score}/100) - ${model.reason}`,
          )
          .join("\n"),
    },

    conclusion: {
      title: "Conclusion",
      content:
        `The dataset achieved a health score of ${intelligence.datasetHealth.score}/100, an ML readiness score of ${intelligence.mlReadiness.score}/100, and a confidence score of ${intelligence.confidence.score}/100. Based on the analysis, the recommended preprocessing steps and model selection should be completed before production deployment.`,
    },
  };
}