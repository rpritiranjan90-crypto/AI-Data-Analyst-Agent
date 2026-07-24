export type TrainingComplexity =
  | "Low"
  | "Medium"
  | "High";

export interface AIInsights {
  overallHealth: string;

  strongestArea: string;

  weakestArea: string;

  nextAction: string;

  estimatedSuccess: number;

  trainingComplexity: TrainingComplexity;
}