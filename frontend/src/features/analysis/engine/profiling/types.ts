export type DatasetQuality =
  | "Excellent"
  | "Good"
  | "Fair"
  | "Poor";

export interface DatasetProfile {
  /* Dataset */

  rows: number;
  columns: number;
  memoryUsageMB: number;

  /* Structure */

  numericColumns: number;
  categoricalColumns: number;

  /* Quality */

  missingValues: number;
  duplicateRows: number;

  missingPercentage: number;
  duplicatePercentage: number;

  /* Scores */

  datasetScore: number;
  readinessScore: number;

  quality: DatasetQuality;

  /* AI */

  recommendations: string[];
  strengths: string[];
  warnings: string[];
}