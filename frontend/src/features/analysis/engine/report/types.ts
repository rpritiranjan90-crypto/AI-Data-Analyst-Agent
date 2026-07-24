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

  executiveSummary: ReportSection;

  datasetHealth: ReportSection;

  featureEngineering: ReportSection;

  modelRecommendations: ReportSection;

  conclusion: ReportSection;
}