from __future__ import annotations

from typing import Any

import pandas as pd


class DescriptiveService:
    """
    Enterprise descriptive statistics service.
    """

    @staticmethod
    def analyze(
        dataframe: pd.DataFrame
    ) -> dict[str, Any]:

        numeric_df = dataframe.select_dtypes(include=["number"])

        result = {}

        for column in numeric_df.columns:

            series = numeric_df[column]

            result[column] = {

                "count": int(series.count()),

                "sum": round(float(series.sum()), 2),

                "mean": round(float(series.mean()), 2),

                "median": round(float(series.median()), 2),

                "mode": (
                    round(float(series.mode().iloc[0]), 2)
                    if not series.mode().empty
                    else None
                ),

                "minimum": round(float(series.min()), 2),

                "maximum": round(float(series.max()), 2),

                "range": round(
                    float(series.max() - series.min()),
                    2
                ),

                "variance": round(float(series.var()), 2),

                "standard_deviation": round(float(series.std()), 2),

                "q1": round(float(series.quantile(0.25)), 2),

                "q2": round(float(series.quantile(0.50)), 2),

                "q3": round(float(series.quantile(0.75)), 2)
            }

        return result