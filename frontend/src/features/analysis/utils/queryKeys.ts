/**
 * ==========================================================
 * Analysis Query Keys
 * ==========================================================
 * Centralized React Query keys.
 * ==========================================================
 */

export const analysisKeys = {
  all: ["analysis"] as const,

  summary: () => [...analysisKeys.all, "summary"] as const,

  descriptive: () => [...analysisKeys.all, "descriptive"] as const,

  correlation: (
    method: "pearson" | "spearman" | "kendall" = "pearson"
  ) =>
    [...analysisKeys.all, "correlation", method] as const,

  strongCorrelations: () =>
    [...analysisKeys.all, "strong-correlations"] as const,

  categorical: () =>
    [...analysisKeys.all, "categorical"] as const,

  distribution: () =>
    [...analysisKeys.all, "distribution"] as const,

  timeSeries: () =>
    [...analysisKeys.all, "timeseries"] as const,

  insights: () =>
    [...analysisKeys.all, "insights"] as const,
};