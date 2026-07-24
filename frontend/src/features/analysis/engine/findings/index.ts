import type { AIFinding } from "./types";

export function generateFindings(
  datasetScore: number,
  mlReadiness: number,
  confidence: number,
  models: number
): AIFinding[] {
  const findings: AIFinding[] = [];

  // Dataset Quality
  if (datasetScore >= 80) {
    findings.push({
      type: "success",
      title: "High Dataset Quality",
      description: `Dataset quality score is ${datasetScore}/100. The dataset is clean and suitable for advanced analytics.`,
    });
  } else if (datasetScore >= 60) {
    findings.push({
      type: "warning",
      title: "Moderate Dataset Quality",
      description:
        "Some preprocessing is recommended before model training.",
    });
  } else {
    findings.push({
      type: "error",
      title: "Poor Dataset Quality",
      description:
        "Significant preprocessing is required before using this dataset.",
    });
  }

  // ML Readiness
  if (mlReadiness >= 75) {
    findings.push({
      type: "success",
      title: "Ready for Machine Learning",
      description:
        "The dataset is well prepared for supervised machine learning.",
    });
  } else {
    findings.push({
      type: "warning",
      title: "Machine Learning Preparation Needed",
      description:
        "Feature engineering and preprocessing are recommended.",
    });
  }

  // Confidence
  if (confidence >= 80) {
    findings.push({
      type: "success",
      title: "High AI Confidence",
      description: `Confidence score is ${confidence}/100.`,
    });
  } else {
    findings.push({
      type: "info",
      title: "Moderate AI Confidence",
      description:
        "Additional data validation could improve confidence.",
    });
  }

  // Models
  findings.push({
    type: "info",
    title: "Model Recommendations",
    description: `${models} machine learning models are recommended for this dataset.`,
  });

  // Scaling Recommendation
  findings.push({
    type: "warning",
    title: "Feature Scaling Recommended",
    description:
      "Standardizing numerical features may improve model performance.",
  });

  return findings;
}