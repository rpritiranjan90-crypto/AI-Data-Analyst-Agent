export interface DatasetMetadata {
  filename: string;
  extension: string;
  rows: number;
  columns: number;
  column_names: string[];
  memory_usage_mb: number;
  missing_values: number;
  duplicate_rows: number;
  upload_time?: string;
  filepath?: string;
}

export interface ColumnDetail {
  name: string;
  dtype: string;
  non_null_count: number;
  null_count: number;
  null_percentage: number;
  unique_count: number;
  sample_values?: (string | number | boolean | null)[];
}

export interface DatasetProfile {
  columns: ColumnDetail[];
  numeric_columns: string[];
  categorical_columns: string[];
  datetime_columns: string[];
  missing_values_by_column: Record<string, number>;
  data_types: Record<string, string>;
  head?: Record<string, any>[];
}

export interface DatasetResponse {
  success: boolean;
  message: string;
  metadata: DatasetMetadata;
  profile?: DatasetProfile;
  statistics?: Record<string, any>;
  preview?: Record<string, any>[];
}

export interface CleaningOptions {
  filename?: string;
  missing_strategy?: "drop" | "fill_mean" | "fill_median" | "fill_mode" | "fill_value";
  fill_value?: string | number;
  remove_duplicates?: boolean;
  columns_to_drop?: string[];
}

export interface ChartConfig {
  chart_type: string;
  x_column: string;
  y_column?: string;
  title?: string;
  theme?: string;
  color?: string;
  width?: number;
  height?: number;
  dpi?: number;
}

export interface MLPipelineConfig {
  filename?: string;
  target_column: string;
  feature_columns?: string[];
  problem_type: "classification" | "regression";
  model_type: string;
  test_size?: number;
}

export interface ReportConfig {
  filename?: string;
  title?: string;
  include_charts?: boolean;
  include_ai_summary?: boolean;
}
