export type RiskLevel =
  | "Low"
  | "Medium"
  | "High";

export interface AICopilot {
  overallAssessment: string;

  nextAction: string;

  suggestedModel: string;

  readiness: number;

  risk: RiskLevel;

  status: string;
}