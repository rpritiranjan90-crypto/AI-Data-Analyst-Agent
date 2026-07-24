export type DashboardStatus =
  | "Excellent"
  | "Good"
  | "Average"
  | "Needs Improvement";

export interface DashboardSummary {
  datasetScore: number;

  mlReadiness: number;

  confidence: number;

  estimatedSuccess: number;

  overallStatus: DashboardStatus;

  bestModel: string;

  risk: string;

  nextAction: string;
}