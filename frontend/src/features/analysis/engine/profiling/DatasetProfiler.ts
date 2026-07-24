import type { DatasetProfile } from "./types";

import {
  calculateDatasetScore,
  calculatePercentage,
  calculateReadinessScore,
  generateRecommendations,
  generateStrengths,
  generateWarnings,
  getQualityLabel,
} from "./rules";

interface DatasetProfilerInput {
  metadata: {
    rows: number;
    columns: number;
    memory_usage_mb: number;
    missing_values: number;
    duplicate_rows: number;
  };

  correlation: {
    total_numeric_columns: number;
  };

  categorical: Record<string, unknown>;
}

export class DatasetProfiler {
  static build(
    input: DatasetProfilerInput,
  ): DatasetProfile {
    const {
      metadata,
      correlation,
      categorical,
    } = input;

    const missingPercentage =
      calculatePercentage(
        metadata.missing_values,
        metadata.rows,
      );

    const duplicatePercentage =
      calculatePercentage(
        metadata.duplicate_rows,
        metadata.rows,
      );

    const datasetScore =
      calculateDatasetScore(
        missingPercentage,
        duplicatePercentage,
      );

    const readinessScore =
      calculateReadinessScore(
        datasetScore,
        correlation.total_numeric_columns,
        metadata.columns,
      );

    const quality =
      getQualityLabel(datasetScore);

    return {
      rows: metadata.rows,
      columns: metadata.columns,

      memoryUsageMB:
        metadata.memory_usage_mb,

      numericColumns:
        correlation.total_numeric_columns,

      categoricalColumns:
        Object.keys(categorical).length,

      missingValues:
        metadata.missing_values,

      duplicateRows:
        metadata.duplicate_rows,

      missingPercentage,

      duplicatePercentage,

      datasetScore,

      readinessScore,

      quality,

      strengths:
        generateStrengths(
          datasetScore,
          missingPercentage,
          duplicatePercentage,
        ),

      warnings:
        generateWarnings(
          missingPercentage,
          duplicatePercentage,
        ),

      recommendations:
        generateRecommendations(
          quality,
          missingPercentage,
          duplicatePercentage,
        ),
    };
  }
}

export default DatasetProfiler;