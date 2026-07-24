import {
  getDatasetHealth,
  getRiskLevel,
  getVerdict,
} from "./rules";

import type {
  ExecutiveSummaryInput,
  ExecutiveSummaryOutput,
} from "./types";

export class ExecutiveSummaryEngine {
  static generate(
    input: ExecutiveSummaryInput,
  ): ExecutiveSummaryOutput {
    const health = getDatasetHealth(
      input.datasetScore,
    );

    const risk = getRiskLevel(input);

    const verdict = getVerdict(input);

    const observations: string[] = [];

    const recommendations: string[] = [];

    // Dataset Health
    if (input.datasetScore >= 90) {
      observations.push(
        "Dataset quality is excellent and suitable for advanced analytics.",
      );
    } else if (input.datasetScore >= 75) {
      observations.push(
        "Dataset quality is good with only minor improvements recommended.",
      );
    } else {
      observations.push(
        "Dataset quality requires further preprocessing.",
      );
    }

    // ML Readiness
    if (input.mlReadiness >= 90) {
      observations.push(
        "Machine learning readiness is high.",
      );
    } else if (input.mlReadiness >= 75) {
      observations.push(
        "Machine learning readiness is acceptable.",
      );
    } else {
      observations.push(
        "Additional feature engineering is recommended before model training.",
      );
    }

    // Confidence
    if (input.confidence >= 90) {
      observations.push(
        "Analysis confidence is very high.",
      );
    } else {
      observations.push(
        "Review data quality to improve confidence.",
      );
    }

    // Missing Values
    if ((input.missingValues ?? 0) > 0) {
      recommendations.push(
        "Handle missing values before training predictive models.",
      );
    }

    // Outliers
    if ((input.outlierCount ?? 0) > 20) {
      recommendations.push(
        "Investigate and treat significant outliers.",
      );
    }

    // Correlations
    if ((input.strongCorrelations ?? 0) > 5) {
      recommendations.push(
        "Review highly correlated features to reduce multicollinearity.",
      );
    }

    // Default recommendations
    if (recommendations.length === 0) {
      recommendations.push(
        "Dataset is suitable for predictive modeling.",
      );

      recommendations.push(
        "Validate models using cross-validation.",
      );

      recommendations.push(
        "Monitor model performance after deployment.",
      );
    }

    const summary = [
      `Dataset Health: ${health}`,
      `Risk Level: ${risk}`,
      `Verdict: ${verdict}`,
    ].join("\n");

    return {
      health,
      risk,
      verdict,
      observations,
      recommendations,
      summary,
    };
  }
}

export default ExecutiveSummaryEngine;