import type { AICopilot } from "../copilot/types";
import type { FeatureCard } from "../featureCards/types";
import type { AIFinding } from "../findings/types";
import type { AIInsights } from "../insights/types";
import type { ModelCard } from "../modelCards/types";

export interface ReportMetric {
  label: string;
  value: string | number;
}

export interface ReportSection {
  title: string;
  content: string;
}

export interface AIReport {
  title: string;

  generatedAt: string;

  metrics: ReportMetric[];

  copilot: AICopilot;

  insights: AIInsights;

  findings: AIFinding[];

  featureCards: FeatureCard[];

  modelCards: ModelCard[];

  executiveSummary: ReportSection;

  datasetHealth: ReportSection;

  featureEngineering: ReportSection;

  modelRecommendations: ReportSection;

  conclusion: ReportSection;
}
