from __future__ import annotations

from typing import Any

import pandas as pd


class CorrelationService:
    """
    Enterprise Correlation Analysis Service.
    """

    @staticmethod
    def analyze(
        dataframe: pd.DataFrame,
        method: str = "pearson"
    ) -> dict[str, Any]:

        numeric_df = dataframe.select_dtypes(include=["number"])

        correlation_matrix = numeric_df.corr(method=method)

        return {
            "method": method,
            "correlation_matrix": correlation_matrix.round(3).to_dict()
        }

    @staticmethod
    def strong_correlations(
        dataframe: pd.DataFrame,
        threshold: float = 0.7
    ) -> list[dict[str, Any]]:

        numeric_df = dataframe.select_dtypes(include=["number"])

        corr = numeric_df.corr()

        results = []

        columns = corr.columns

        for i in range(len(columns)):
            for j in range(i + 1, len(columns)):

                value = corr.iloc[i, j]

                if abs(value) >= threshold:

                    results.append(
                        {
                            "column_1": columns[i],
                            "column_2": columns[j],
                            "correlation": round(float(value), 3),
                            "strength": (
                                "Positive"
                                if value > 0
                                else "Negative"
                            )
                        }
                    )

        return sorted(
            results,
            key=lambda x: abs(x["correlation"]),
            reverse=True
        )