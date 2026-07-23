/**
 * ==========================================================
 * Analysis Feature Types
 * ==========================================================
 * Shared interfaces used by the Analysis feature.
 * ==========================================================
 */

/* -------------------------------------------------------------------------- */
/*                               Descriptive Stats                            */
/* -------------------------------------------------------------------------- */

export interface NumericColumnStatistics {
  count: number;
  missing_values: number;
  unique_values: number;

  sum: number;
  mean: number;
  median: number;
  mode: number | string;

  minimum: number;
  maximum: number;
  range: number;

  variance: number;
  standard_deviation: number;
  coefficient_of_variation: number;

  skewness: number;
  kurtosis: number;

  q1: number;
  q2: number;
  q3: number;

  iqr: number;
}

export type DescriptiveStatisticsResponse = Record<
  string,
  NumericColumnStatistics
>;

/* -------------------------------------------------------------------------- */
/*                              Correlation                                   */
/* -------------------------------------------------------------------------- */

export type CorrelationMatrix = Record<
  string,
  Record<string, number>
>;

export interface CorrelationResponse {
  method: string;

  numeric_columns: string[];

  total_numeric_columns: number;

  correlation_matrix: CorrelationMatrix;

  strong_correlations: StrongCorrelation[];
}

/* -------------------------------------------------------------------------- */
/*                           Strong Correlations                              */
/* -------------------------------------------------------------------------- */

export interface StrongCorrelation {
  column_1: string;

  column_2: string;

  correlation: number;

  absolute_correlation: number;

  direction: string;

  interpretation: string;
}

export type StrongCorrelationResponse = StrongCorrelation[];

/* -------------------------------------------------------------------------- */
/*                          Categorical Analysis                              */
/* -------------------------------------------------------------------------- */

export interface CategoricalColumnAnalysis {
  total_records: number;

  unique_values: number;

  missing_values: number;

  missing_percentage: number;

  most_frequent: string;

  least_frequent: string;

  most_frequent_count: number;

  frequency: Record<string, number>;

  percentage: Record<string, number>;

  top_categories: Record<string, number>;

  bottom_categories: Record<string, number>;

  cardinality: string;

  binary_column: boolean;

  constant_column: boolean;
}

export type CategoricalResponse = Record<
  string,
  CategoricalColumnAnalysis
>;

/* -------------------------------------------------------------------------- */
/*                           Distribution Analysis                            */
/* -------------------------------------------------------------------------- */

export interface OutlierInformation {
  count: number;

  lower_bound: number;

  upper_bound: number;
}

export interface DistributionStatistics {
  count: number;

  mean: number;

  median: number;

  standard_deviation: number;

  variance: number;

  minimum: number;

  maximum: number;

  range: number;

  q1: number;

  q3: number;

  iqr: number;

  skewness: number;

  skewness_type: string;

  kurtosis: number;

  kurtosis_type: string;

  coefficient_of_variation: number;

  normal_distribution: boolean;

  outliers: OutlierInformation;
}

export type DistributionResponse = Record<
  string,
  DistributionStatistics
>;

/* -------------------------------------------------------------------------- */
/*                           Time Series                                      */
/* -------------------------------------------------------------------------- */

export interface TimeSeriesResponse {
  has_datetime: boolean;

  message: string;
}

/* -------------------------------------------------------------------------- */
/*                             AI Insights                                    */
/* -------------------------------------------------------------------------- */

export type AnalysisInsightsResponse = string[];

/* -------------------------------------------------------------------------- */
/*                             Summary                                        */
/* -------------------------------------------------------------------------- */

export interface AnalysisSummaryResponse {
  descriptive: DescriptiveStatisticsResponse;

  correlation: CorrelationResponse;

  categorical: CategoricalResponse;

  distribution: DistributionResponse;

  timeseries: TimeSeriesResponse;

  insights: AnalysisInsightsResponse;
}