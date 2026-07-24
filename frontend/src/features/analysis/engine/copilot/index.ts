import type { AICopilot } from "./types";

export function generateCopilot(
  datasetScore: number,
  mlReadiness: number,
  confidence: number,
  models: number
): AICopilot {
  let status = "Needs Improvement";
  let risk: AICopilot["risk"] = "High";
  let overallAssessment =
    "The dataset requires significant preprocessing before machine learning.";
  let nextAction =
    "Clean missing values and improve feature quality.";

  if (
    datasetScore >= 80 &&
    mlReadiness >= 75
  ) {
    status = "Ready for Machine Learning";

    risk = "Low";

    overallAssessment =
      "The dataset is suitable for machine learning after minor preprocessing.";

    nextAction =
      "Apply feature scaling before training your model.";
  } else if (
    datasetScore >= 60 &&
    mlReadiness >= 60
  ) {
    status = "Partially Ready";

    risk = "Medium";

    overallAssessment =
      "The dataset is usable, but additional preprocessing is recommended.";

    nextAction =
      "Handle missing values and normalize numerical features.";
  }

  const suggestedModel =
    models > 0
      ? "Random Forest"
      : "No suitable model available";

  const readiness = Math.round(
    (datasetScore +
      mlReadiness +
      confidence) /
      3
  );

  return {
    overallAssessment,

    nextAction,

    suggestedModel,

    readiness,

    risk,

    status,
  };
}