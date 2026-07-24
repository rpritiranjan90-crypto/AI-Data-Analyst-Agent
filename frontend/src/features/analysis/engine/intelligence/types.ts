import type { AnalysisSummaryResponse } from "../../types/analysis";


export interface DatasetHealth {
  score: number;
  level: "Excellent" | "Good" | "Average" | "Poor";
}

export interface MLReadiness {
  score: number;
  level: "High" | "Medium" | "Low";
}

export interface ConfidenceResult {
  score: number;
  level: string;
}

export interface RiskAssessment {
  level: "Low" | "Medium" | "High";
  score: number;
}

export interface ExecutiveInsight {
  title: string;
  description: string;
}

export interface AnalysisIntelligence {
  raw: AnalysisSummaryResponse;

  datasetHealth: DatasetHealth;

  mlReadiness: MLReadiness;

  confidence: ConfidenceResult;

  risk: RiskAssessment;

 models: {
  name: string;
  score: number;
  reason: string;
}[];

  insights: ExecutiveInsight[];

  strengths: string[];

  risks: string[];

  recommendations: string[];

  findings: string[];
}