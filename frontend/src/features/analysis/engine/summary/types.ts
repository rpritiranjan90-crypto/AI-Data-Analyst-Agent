export interface ExecutiveSummaryInput {
  datasetScore: number;
  mlReadiness: number;
  confidence: number;
  modelCount: number;

  missingValues?: number;
  duplicateRows?: number;
  outlierCount?: number;
  strongCorrelations?: number;
}

export interface ExecutiveSummaryOutput {
  health: string;
  risk: string;
  verdict: string;

  observations: string[];

  recommendations: string[];

  summary: string;
}