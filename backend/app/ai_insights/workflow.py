from __future__ import annotations

from typing import Any

import pandas as pd

from app.services.dataset_service import DatasetService


def detect_outliers(df: pd.DataFrame) -> dict[str, int]:
    """
    Detect outliers using the IQR method.
    """

    outliers: dict[str, int] = {}

    numeric_df = df.select_dtypes(include=["number"])

    for column in numeric_df.columns:

        series = numeric_df[column].dropna()

        q1 = series.quantile(0.25)
        q3 = series.quantile(0.75)

        iqr = q3 - q1

        lower = q1 - 1.5 * iqr
        upper = q3 + 1.5 * iqr

        outliers[column] = int(
            ((series < lower) | (series > upper)).sum()
        )

    return outliers


def detect_correlations(
    df: pd.DataFrame,
) -> list[dict]:
    """
    Detect strong correlations between numeric columns.
    """

    numeric_df = df.select_dtypes(include=["number"])

    if numeric_df.shape[1] < 2:
        return []

    correlation_matrix = numeric_df.corr(
        numeric_only=True
    )

    strong_correlations: list[dict] = []

    columns = correlation_matrix.columns

    for i in range(len(columns)):
        for j in range(i + 1, len(columns)):

            correlation = correlation_matrix.iloc[i, j]

            if abs(correlation) >= 0.70:

                strong_correlations.append(
                    {
                        "column_1": columns[i],
                        "column_2": columns[j],
                        "correlation": round(
                            float(correlation),
                            2,
                        ),
                    }
                )

    return strong_correlations


class AIInsightsWorkflow:
    """
    Enterprise AI Insights Workflow.
    """

    def __init__(self) -> None:

        self._dataset_service = DatasetService()

        self._report: dict[str, Any] = {
            "success": True,
            "dataset_summary": {},
            "statistics": {},
            "quality": {},
            "insights": [],
            "recommendations": [],
            "warnings": [],
            "errors": [],
        }

    def _dataset(self) -> pd.DataFrame:
        """
        Return active dataset.
        """

        return self._dataset_service.get_dataset()

    def _warning(self, message: str) -> None:

        self._report["warnings"].append(message)

    def _error(self, message: str) -> None:

        self._report["success"] = False
        self._report["errors"].append(message)

    def _add_insight(self, insight: str) -> None:

        self._report["insights"].append(insight)

    def _add_recommendation(
        self,
        recommendation: str,
    ) -> None:

        self._report["recommendations"].append(
            recommendation
        )

    def _dataset_summary(self) -> None:
        """
        Dataset summary.
        """

        dataframe = self._dataset()

        self._report["dataset_summary"] = {
            "rows": len(dataframe),
            "columns": len(dataframe.columns),
            "shape": list(dataframe.shape),
            "memory_usage": int(
                dataframe.memory_usage(
                    deep=True
                ).sum()
            ),
        }

    def _basic_statistics(self) -> None:
        """
        Basic statistics.
        """

        dataframe = self._dataset()

        numeric_columns = dataframe.select_dtypes(
            include="number"
        ).columns.tolist()

        categorical_columns = dataframe.select_dtypes(
            exclude="number"
        ).columns.tolist()

        missing_values = int(
            dataframe.isna().sum().sum()
        )

        duplicate_rows = int(
            dataframe.duplicated().sum()
        )

        self._report["statistics"] = {
            "numeric_columns": numeric_columns,
            "categorical_columns": categorical_columns,
            "missing_values": missing_values,
            "duplicate_rows": duplicate_rows,
        }

    def _quality_assessment(self) -> None:
        """
        Dataset quality assessment.
        """

        dataframe = self._dataset()

        outliers = detect_outliers(dataframe)

        correlations = detect_correlations(
            dataframe
        )

        self._report["quality"] = {
            "outliers": outliers,
            "strong_correlations": correlations,
        }

        total_outliers = sum(outliers.values())

        if total_outliers == 0:

            self._add_insight(
                "No significant outliers detected."
            )

        else:

            self._add_insight(
                f"{total_outliers} potential outliers detected."
            )

        if correlations:

            self._add_insight(
                f"{len(correlations)} strong correlations detected."
            )

    def _generate_recommendations(self) -> None:
        """
        Generate AI recommendations.
        """

        statistics = self._report["statistics"]
        quality = self._report["quality"]

        numeric_columns = statistics[
            "numeric_columns"
        ]

        categorical_columns = statistics[
            "categorical_columns"
        ]

        missing_values = statistics[
            "missing_values"
        ]

        duplicate_rows = statistics[
            "duplicate_rows"
        ]

        if missing_values == 0:

            self._add_recommendation(
                "No missing values detected."
            )

        else:

            self._add_recommendation(
                f"Dataset contains {missing_values} missing values."
            )

        if duplicate_rows == 0:

            self._add_recommendation(
                "No duplicate rows detected."
            )

        else:

            self._add_recommendation(
                f"Dataset contains {duplicate_rows} duplicate rows."
            )

        if sum(
            quality["outliers"].values()
        ) == 0:

            self._add_recommendation(
                "No significant outliers detected."
            )

        else:

            self._add_recommendation(
                "Review detected outliers before training ML models."
            )

        if quality["strong_correlations"]:

            self._add_recommendation(
                "Strong correlations found. Review highly correlated features."
            )

        if numeric_columns:

            self._add_recommendation(
                "Use Histogram, Box Plot and KDE Plot for numerical analysis."
            )

        if categorical_columns:

            self._add_recommendation(
                "Use Count Plot and Pie Chart for categorical analysis."
            )

        if len(numeric_columns) >= 2:

            self._add_recommendation(
                "Use Scatter Plot and Correlation Heatmap for relationship analysis."
            )

    def execute(self) -> dict[str, Any]:
        """
        Execute workflow.
        """

        try:

            self._dataset_summary()

            self._basic_statistics()

            self._quality_assessment()

            self._generate_recommendations()

            self._report["summary"] = {
                "total_insights": len(
                    self._report["insights"]
                ),
                "total_recommendations": len(
                    self._report["recommendations"]
                ),
                "warnings": len(
                    self._report["warnings"]
                ),
                "errors": len(
                    self._report["errors"]
                ),
            }

            return self._report

        except Exception as error:

            self._error(str(error))

            return self._report