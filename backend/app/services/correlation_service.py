from __future__ import annotations

from typing import Any

import pandas as pd


class CorrelationService:
    """
    Enterprise Correlation Analysis Service.

    Supports Pearson, Spearman, and Kendall correlation methods.
    """

    VALID_METHODS = {"pearson", "spearman", "kendall"}

    @staticmethod
    def analyze(
        dataframe: pd.DataFrame,
        method: str = "pearson",
    ) -> dict[str, Any]:
        """
        Generate a correlation matrix for all numeric columns.

        Args:
            dataframe: Input dataframe.
            method: Correlation method.

        Returns:
            Correlation analysis result.
        """

        method = method.lower()

        if method not in CorrelationService.VALID_METHODS:
            raise ValueError(
                f"Unsupported correlation method '{method}'. "
                f"Supported methods: {', '.join(CorrelationService.VALID_METHODS)}"
            )

        numeric_df = dataframe.select_dtypes(include=["number"])

        if numeric_df.shape[1] < 2:
            return {
                "message": "At least two numeric columns are required for correlation analysis."
            }

        correlation_matrix = numeric_df.corr(method=method)

        return {
            "method": method,
            "numeric_columns": numeric_df.columns.tolist(),
            "total_numeric_columns": numeric_df.shape[1],
            "correlation_matrix": correlation_matrix.round(3).to_dict(),
        }

    @staticmethod
    def strong_correlations(
        dataframe: pd.DataFrame,
        threshold: float = 0.70,
    ) -> list[dict[str, Any]]:
        """
        Return strongly correlated column pairs.

        Args:
            dataframe: Input dataframe.
            threshold: Minimum absolute correlation.

        Returns:
            List of strong correlations sorted by strength.
        """

        numeric_df = dataframe.select_dtypes(include=["number"])

        if numeric_df.shape[1] < 2:
            return []

        corr = numeric_df.corr()

        results: list[dict[str, Any]] = []

        columns = corr.columns

        for i in range(len(columns)):
            for j in range(i + 1, len(columns)):

                value = float(corr.iloc[i, j])

                if abs(value) < threshold:
                    continue

                absolute = abs(value)

                if absolute >= 0.90:
                    interpretation = "Very Strong"
                elif absolute >= 0.70:
                    interpretation = "Strong"
                elif absolute >= 0.50:
                    interpretation = "Moderate"
                elif absolute >= 0.30:
                    interpretation = "Weak"
                else:
                    interpretation = "Very Weak"

                results.append(
                    {
                        "column_1": columns[i],
                        "column_2": columns[j],
                        "correlation": round(value, 3),
                        "absolute_correlation": round(absolute, 3),
                        "direction": "Positive" if value > 0 else "Negative",
                        "interpretation": interpretation,
                    }
                )

        return sorted(
            results,
            key=lambda item: item["absolute_correlation"],
            reverse=True,
        )