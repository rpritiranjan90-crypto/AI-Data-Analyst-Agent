from __future__ import annotations

from typing import Any

import numpy as np
import pandas as pd


class DatasetStatisticsService:
    """
    Generate descriptive statistics for datasets.
    """

    def _column_statistics(
        self,
        series: pd.Series,
    ) -> dict[str, Any]:
        """
        Generate descriptive statistics for one numeric column.
        """

        return {
            "count": int(series.count()),
            "mean": float(series.mean()),
            "median": float(series.median()),
            "minimum": float(series.min()),
            "maximum": float(series.max()),
            "variance": float(series.var()),
            "standard_deviation": float(series.std()),
            "q1": float(series.quantile(0.25)),
            "q3": float(series.quantile(0.75)),
            "interquartile_range": float(
                series.quantile(0.75)
                - series.quantile(0.25)
            ),
            "skewness": float(series.skew()),
            "kurtosis": float(series.kurt()),
        }

    def _outlier_summary(
        self,
        dataframe: pd.DataFrame,
    ) -> dict[str, int]:
        """
        Detect outliers using the IQR rule.
        """

        outliers: dict[str, int] = {}

        numeric = dataframe.select_dtypes(
            include="number"
        )

        for column in numeric.columns:

            series = numeric[column].dropna()

            q1 = series.quantile(0.25)
            q3 = series.quantile(0.75)

            iqr = q3 - q1

            lower = q1 - (1.5 * iqr)
            upper = q3 + (1.5 * iqr)

            outliers[column] = int(
                (
                    (series < lower)
                    | (series > upper)
                ).sum()
            )

        return outliers

    def _dataset_summary(
        self,
        dataframe: pd.DataFrame,
    ) -> dict[str, Any]:
        """
        Generate overall dataset summary.
        """

        numeric = dataframe.select_dtypes(
            include="number"
        )

        return {
            "missing_values": int(
                dataframe.isna().sum().sum()
            ),
            "duplicate_rows": int(
                dataframe.duplicated().sum()
            ),
            "zero_values": int(
                (numeric == 0).sum().sum()
            ),
            "infinite_values": int(
                np.isinf(numeric).sum().sum()
            ),
        }

    def _generate_insights(
        self,
        dataframe: pd.DataFrame,
        outliers: dict[str, int],
    ) -> list[str]:
        """
        Generate simple statistical insights.
        """

        insights: list[str] = []

        if dataframe.isna().sum().sum():
            insights.append(
                "Dataset contains missing values."
            )

        duplicates = int(
            dataframe.duplicated().sum()
        )

        if duplicates:
            insights.append(
                f"{duplicates} duplicate rows detected."
            )

        outlier_columns = [
            column
            for column, count in outliers.items()
            if count > 0
        ]

        if outlier_columns:
            insights.append(
                "Outliers detected in: "
                + ", ".join(outlier_columns)
            )

        return insights

    def generate(
        self,
        dataframe: pd.DataFrame,
        include_correlation: bool = True,
    ) -> dict[str, Any]:
        """
        Generate complete statistics.
        """

        numeric = dataframe.select_dtypes(
            include="number"
        )

        statistics = {
            column: self._column_statistics(
                numeric[column]
            )
            for column in numeric.columns
        }

        correlation: dict[str, Any] = {}

        if (
            include_correlation
            and not numeric.empty
        ):
            correlation = (
                numeric.corr(
                    numeric_only=True
                )
                .round(4)
                .to_dict()
            )

        outliers = self._outlier_summary(
            dataframe
        )

        summary = self._dataset_summary(
            dataframe
        )

        insights = self._generate_insights(
            dataframe,
            outliers,
        )

        return {
            "rows": len(dataframe),
            "columns": len(dataframe.columns),
            "numeric_columns": list(
                numeric.columns
            ),
            "statistics": statistics,
            "correlation": correlation,
            "outliers": outliers,
            "summary": summary,
            "insights": insights,
        }


__all__ = [
    "DatasetStatisticsService",
]