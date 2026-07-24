import type { FeatureCard } from "./types";

export function generateFeatureCards(
  datasetScore: number,
  mlReadiness: number
): FeatureCard[] {
  const cards: FeatureCard[] = [];

  cards.push({
    title: "Scale Numerical Features",
    description:
      "Standardize or normalize numerical columns before training ML models.",
    priority: mlReadiness < 80 ? "High" : "Medium",
    impact: "High",
    recommended: true,
  });

  cards.push({
    title: "Encode Categorical Features",
    description:
      "Convert categorical values into machine-learning-friendly numeric representations.",
    priority: "Medium",
    impact: "Medium",
    recommended: true,
  });

  if (datasetScore < 80) {
    cards.push({
      title: "Handle Missing Values",
      description:
        "Impute or remove missing values to improve data quality and model performance.",
      priority: "High",
      impact: "High",
      recommended: true,
    });
  }

  cards.push({
    title: "Detect Outliers",
    description:
      "Review extreme values that could negatively affect model training.",
    priority: "Medium",
    impact: "Medium",
    recommended: datasetScore < 90,
  });

  cards.push({
    title: "Remove Highly Correlated Features",
    description:
      "Reduce redundancy by eliminating highly correlated predictor variables.",
    priority: "Low",
    impact: "Medium",
    recommended: true,
  });

  return cards;
}