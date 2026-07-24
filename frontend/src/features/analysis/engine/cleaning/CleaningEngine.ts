import type {
  AnalysisSummaryResponse,
  CategoricalColumnAnalysis,
} from "../../types/analysis";

import type {
  CleaningReport,
  CleaningSuggestion,
} from "./types";

import {
  calculateCleaningScore,
  createSuggestion,
  getCardinalityPriority,
  getDuplicatePriority,
  getMissingPriority,
  isReadyForML,
} from "./rules";

interface CleaningEngineInput {
  analysis: AnalysisSummaryResponse;
  metadata: {
    missing_values: number;
    duplicate_rows: number;
    rows: number;
  };
}

export class CleaningEngine {
  static analyze(
    input: CleaningEngineInput,
  ): CleaningReport {
    const {
      analysis,
      metadata,
    } = input;

    const suggestions: CleaningSuggestion[] = [];

    /* Missing Values */

    const missingPercentage =
      metadata.rows === 0
        ? 0
        : (metadata.missing_values /
            metadata.rows) *
          100;

    if (metadata.missing_values > 0) {
      suggestions.push(
        createSuggestion({
          id: "missing-values",

          category: "missing-values",

          priority:
            getMissingPriority(
              missingPercentage,
            ),

          title: "Missing Values Detected",

          description: `${metadata.missing_values} missing values were found.`,

          recommendation:
            "Impute numeric columns with median and categorical columns with mode.",

          impact:
            "Improves model quality and reduces information loss.",

          affectedColumns: [],
        }),
      );
    }

    /* Duplicate Rows */

    if (metadata.duplicate_rows > 0) {
      suggestions.push(
        createSuggestion({
          id: "duplicates",

          category: "duplicates",

          priority:
            getDuplicatePriority(
              metadata.duplicate_rows,
            ),

          title: "Duplicate Rows",

          description: `${metadata.duplicate_rows} duplicate rows detected.`,

          recommendation:
            "Review and remove duplicate records before training models.",

          impact:
            "Prevents biased model learning.",

          affectedColumns: [],
        }),
      );
    }

    /* Constant Columns */

    Object.entries(
      analysis.categorical,
    ).forEach(
      ([column, values]: [
        string,
        CategoricalColumnAnalysis,
      ]) => {
        if (values.constant_column) {
          suggestions.push(
            createSuggestion({
              id: `constant-${column}`,

              category:
                "constant-columns",

              priority: "warning",

              title:
                "Constant Column",

              description: `${column} contains only one unique value.`,

              recommendation:
                "Consider removing this column.",

              impact:
                "Constant features add no predictive value.",

              affectedColumns: [
                column,
              ],
            }),
          );
        }

        if (
          values.unique_values >=
          100
        ) {
          suggestions.push(
            createSuggestion({
              id: `cardinality-${column}`,

              category:
                "high-cardinality",

              priority:
                getCardinalityPriority(
                  values.unique_values,
                ),

              title:
                "High Cardinality",

              description: `${column} has ${values.unique_values} unique values.`,

              recommendation:
                "Consider frequency encoding or target encoding.",

              impact:
                "Can improve model efficiency and reduce overfitting.",

              affectedColumns: [
                column,
              ],
            }),
          );
        }
      },
    );

    const critical =
      suggestions.filter(
        (s) =>
          s.priority ===
          "critical",
      ).length;

    const warnings =
      suggestions.filter(
        (s) =>
          s.priority ===
          "warning",
      ).length;

    return {
      summary: {
        score:
          calculateCleaningScore(
            critical,
            warnings,
          ),

        criticalIssues:
          critical,

        warnings,

        suggestions:
          suggestions.length,

        readyForML:
          isReadyForML(
            critical,
          ),
      },

      suggestions,
    };
  }
}

export default CleaningEngine;