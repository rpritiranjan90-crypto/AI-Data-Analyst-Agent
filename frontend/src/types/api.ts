/**
 * Shared API response and request types used across all service modules.
 * Centralized here to make refactors safe and to provide autocomplete
 * in IDEs across the entire frontend.
 */

// ============================================================================
// Generic Envelope
// ============================================================================

/** Standard success envelope returned by most endpoints. */
export interface SuccessResponse<T = unknown> {
  success: true;
  data?: T;
  message?: string;
}

/** Standard error envelope returned by the exception handler middleware. */
export interface ErrorResponse {
  success: false;
  message: string;
  detail?: string | null;
  code?: string;
}

/** Discriminated union for any API response. */
export type ApiResponse<T = unknown> = SuccessResponse<T> | ErrorResponse;

// ============================================================================
// Health
// ============================================================================

export interface HealthResponse {
  success: boolean;
  status: "healthy" | "degraded" | "unhealthy";
  application: string;
  version: string;
}

// ============================================================================
// Dataset
// ============================================================================

export interface ColumnDetail {
  name: string;
  type: "string" | "number" | "boolean" | "datetime" | "category";
  null_count?: number;
  unique_count?: number;
  sample_values?: unknown[];
}

export interface DatasetMetadata {
  filename: string;
  filepath?: string;
  extension: string;
  rows: number;
  columns: number;
  missing_values: number;
  duplicate_rows: number;
  memory_usage_mb: number;
  file_size_bytes: number;
  column_names: string[];
  columns_detail: ColumnDetail[];
  head?: Record<string, unknown>[];
}

export interface DatasetResponse {
  success: boolean;
  message?: string;
  metadata: DatasetMetadata;
  profile?: Record<string, unknown>;
  statistics?: Record<string, unknown>;
}

export interface DatasetListItem {
  filename: string;
  size_bytes: number;
  uploaded_at: string;
  rows: number | null;
  columns: number | null;
}

export interface DatasetListResponse {
  success: boolean;
  total: number;
  page: number;
  page_size: number;
  has_next: boolean;
  items: DatasetListItem[];
}

// ============================================================================
// Analysis
// ============================================================================

export interface AnalysisSummaryResponse {
  success: boolean;
  rows: number;
  columns: number;
  missing_values: Record<string, number>;
  statistics: Record<string, Record<string, number>>;
}

export interface AnalysisQueryRequest {
  sql: string;
}

export interface AnalysisQueryResponse {
  success: boolean;
  result: Record<string, unknown>[];
  row_count: number;
  sql: string;
}

// ============================================================================
// Cleaning
// ============================================================================

export type FillMethod = "mean" | "median" | "mode" | "constant" | "ffill" | "bfill";
export type OutlierMethod = "iqr" | "zscore";
export type CastType = "int" | "float" | "str" | "datetime" | "category";

export interface FillMissingRequest {
  column: string;
  method: FillMethod;
  constant_value?: string | number;
}

export interface RemoveOutliersRequest {
  column: string;
  method: OutlierMethod;
  threshold: number;
}

export interface DropColumnsRequest {
  columns: string[];
}

export interface CastTypesRequest {
  column: string;
  target_type: CastType;
}

export interface CleaningResult {
  success: boolean;
  message?: string;
  rows_after: number;
  rows_removed: number;
  details: Record<string, unknown>;
}

// ============================================================================
// Visualization
// ============================================================================

export type ChartType =
  | "bar"
  | "line"
  | "scatter"
  | "pie"
  | "histogram"
  | "boxplot"
  | "violin"
  | "heatmap"
  | "countplot"
  | "area"
  | "kde"
  | "pair";

export type Theme = "default" | "dark" | "seaborn" | "ggplot";

export interface ChartRequest {
  chart_type: ChartType;
  x_column: string;
  y_column?: string;
  hue_column?: string;
  title?: string;
  theme?: Theme;
}

export interface ChartResponse {
  success: boolean;
  image_path: string;
  image_url: string;
}

// ============================================================================
// ML
// ============================================================================

export type MLModelType =
  | "random_forest"
  | "linear_regression"
  | "logistic_regression"
  | "decision_tree"
  | "gradient_boosting"
  | "knn"
  | "svm";

export interface MLTrainRequest {
  model_type: MLModelType;
  target_column: string;
  test_size: number;
  random_seed?: number;
}

export interface MLTrainResponse {
  success: boolean;
  model_id: string;
  metrics: {
    accuracy?: number;
    r2_score?: number;
    mse?: number;
    rmse?: number;
    confusion_matrix?: number[][];
  };
  feature_importance?: Record<string, number>;
}

// ============================================================================
// AI
// ============================================================================

export interface AIInsightResponse {
  success: boolean;
  summary: string;
  findings: string[];
  recommendations: string[];
  sql?: string;
  chart_recommendation?: string;
}

export interface ChatRequest {
  message: string;
}

export interface ChatResponse {
  success: boolean;
  response: string;
  sql?: string;
  data?: Record<string, unknown>[];
}

// ============================================================================
// Reports
// ============================================================================

export type ReportFormat = "pdf" | "pptx";
export type ReportSection = "summary" | "cleaning" | "visualization" | "ml" | "ai_insights";

export interface ReportRequest {
  format: ReportFormat;
  sections: ReportSection[];
  title?: string;
}

export interface ReportResponse {
  success: boolean;
  file_path: string;
  download_url: string;
}

// ============================================================================
// Admin / Governance / Readiness
// ============================================================================

export interface AdminStats {
  total_requests: number;
  total_uploads: number;
  total_cleaning_ops: number;
  total_charts_generated: number;
  total_ml_runs: number;
  total_reports_generated: number;
  uptime_seconds: number;
  environment: string;
  version: string;
}

export interface AuditLogEntry {
  id: string;
  user: string;
  action: string;
  target: string;
  status: "Success" | "Failed" | "Pending";
  time_ago: string;
  timestamp: string;
}

export interface AuditLogResponse {
  success: boolean;
  total: number;
  page: number;
  page_size: number;
  has_next: boolean;
  entries: AuditLogEntry[];
}

export interface GovernanceStats {
  total_calls: number;
  total_tokens_estimated: number;
  total_cost_estimated: number;
  calls_by_endpoint: Record<string, number>;
  token_consumption?: {
    last_hour: number;
    last_24h: number;
    total_all_time: number;
    model: string;
    estimated_cost_usd: number;
  };
  request_metrics?: {
    total_requests: number;
    requests_last_hour: number;
    requests_last_24h: number;
    avg_latency_ms: number;
    success_rate_pct: number;
    error_count_last_24h: number;
    error_rate_pct: number;
  };
  safety_policies?: {
    prompt_injection_shield: boolean;
    sql_read_only_sandbox: boolean;
    dde_formula_sanitization: boolean;
    output_validation: boolean;
  };
  ai_provider_status?: {
    status: "available" | "unavailable";
    provider: string;
    model: string;
    message: string;
  };
  uptime_seconds: number;
  platform: Record<string, string>;
}

export interface ReadinessCheck {
  name: string;
  passed: boolean;
  message: string;
  weight: number;
  category: string;
}

export interface ReadinessResponse {
  success: boolean;
  total_score: number;
  max_score: number;
  score: number;
  checks: ReadinessCheck[];
  environment: string;
}

// ============================================================================
// Recommendation
// ============================================================================

export type RecommendationPriority = "high" | "medium" | "low";
export type RecommendationCategory = "cleaning" | "visualization" | "ml" | "feature_engineering" | "exploration";

export interface ChartRecommendation {
  chart_type: ChartType;
  x_column?: string;
  y_column?: string;
  rationale: string;
  priority: RecommendationPriority;
}

export interface Recommendation {
  id: string;
  category: RecommendationCategory;
  title: string;
  description: string;
  priority: RecommendationPriority;
  impact: string;
  action_path?: string;
  action_label?: string;
}

export interface RecommendationResponse {
  success: boolean;
  dataset_filename?: string;
  recommendations: Recommendation[];
  chart_recommendations: ChartRecommendation[];
  insights: string[];
}

// ============================================================================
// Scenario Simulator
// ============================================================================

export interface ScenarioInput {
  name: string;
  revenue_change_pct: number;
  cost_change_pct: number;
  marketing_change_pct: number;
  churn_change_pct: number;
}

export interface ScenarioResult {
  name: string;
  baseline_revenue: number;
  projected_revenue: number;
  baseline_profit: number;
  projected_profit: number;
  delta_pct: number;
  risk_score: number;
}

export interface ScenarioSimulationRequest {
  dataset_filename?: string;
  scenarios: ScenarioInput[];
}

export interface ScenarioSimulationResponse {
  success: boolean;
  baseline: ScenarioResult;
  results: ScenarioResult[];
  notes: string[];
}

// ============================================================================
// RAG / Knowledge
// ============================================================================

export interface RAGDocument {
  id: string;
  filename: string;
  extension: string;
  size_bytes: number;
  chunks: number;
  uploaded_at: string;
}

export interface RAGDocumentListResponse {
  success: boolean;
  total: number;
  documents: RAGDocument[];
}

export interface RAGQueryRequest {
  query: string;
  top_k?: number;
}

export interface RAGQueryResult {
  document_id: string;
  filename: string;
  chunk_index: number;
  content: string;
  similarity: number;
}

export interface RAGQueryResponse {
  success: boolean;
  answer: string;
  sources: RAGQueryResult[];
  model: string;
}

// ============================================================================
// Analysis — additional types
// ============================================================================

export interface AnalysisDescriptiveResponse {
  success: boolean;
  statistics: Record<string, Record<string, number>>;
  columns: string[];
}

export interface AnalysisMissingValuesResponse {
  success: boolean;
  total_missing: number;
  by_column: Record<string, number>;
  missing_pct: Record<string, number>;
}

export interface AnalysisColumnTypesResponse {
  success: boolean;
  column_types: Record<string, ColumnDetail["type"]>;
}

export interface AnalysisCorrelationResponse {
  success: boolean;
  columns: string[];
  matrix: number[][];
}
