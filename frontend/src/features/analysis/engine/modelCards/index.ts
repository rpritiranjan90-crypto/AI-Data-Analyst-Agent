import type { ModelCard } from "./types";

export function generateModelCards(
  models: {
    name: string;
    score: number;
    reason: string;
  }[]
): ModelCard[] {
  return models
    .sort((a, b) => b.score - a.score)
    .map((model, index) => {
      let suitability: ModelCard["suitability"] = "Fair";

      if (model.score >= 90) {
        suitability = "Excellent";
      } else if (model.score >= 75) {
        suitability = "Good";
      }

      let confidence = Math.min(
        98,
        model.score + 5
      );

      let bestFor = "General Machine Learning";

      const lowerName = model.name.toLowerCase();

      if (lowerName.includes("random")) {
        bestFor = "Classification & Regression";
      } else if (lowerName.includes("xgboost")) {
        bestFor = "High Accuracy Prediction";
      } else if (lowerName.includes("logistic")) {
        bestFor = "Binary Classification";
      } else if (lowerName.includes("svm")) {
        bestFor = "High-Dimensional Data";
      } else if (lowerName.includes("decision")) {
        bestFor = "Interpretable Models";
      }

      return {
        rank: index + 1,

        name: model.name,

        score: model.score,

        confidence,

        suitability,

        bestFor,

        reason: model.reason,

        recommended: index === 0,
      };
    });
}