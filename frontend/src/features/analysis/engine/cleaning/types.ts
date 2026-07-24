export type CleaningPriority =
  | "critical"
  | "warning"
  | "info";

export type CleaningCategory =
  | "missing-values"
  | "duplicates"
  | "constant-columns"
  | "high-cardinality"
  | "correlation"
  | "outliers"
  | "distribution";

export interface CleaningSuggestion {
  id: string;

  category: CleaningCategory;

  priority: CleaningPriority;

  title: string;

  description: string;

  recommendation: string;

  impact: string;

  affectedColumns: string[];
}

export interface CleaningSummary {
  score: number;

  criticalIssues: number;

  warnings: number;

  suggestions: number;

  readyForML: boolean;
}

export interface CleaningReport {
  summary: CleaningSummary;

  suggestions: CleaningSuggestion[];
}