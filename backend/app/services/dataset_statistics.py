from __future__ import annotations

from typing import Any

import pandas as pd


def generate_statistics(
    dataframe: pd.DataFrame
) -> dict[str, Any]:
    """
    Generate detailed statistics for all numeric columns.
    """

    numeric_df = dataframe.select_dtypes(include=["number"])

    statistics = {}

    for column in numeric_df.columns:

        series = numeric_df[column]

        statistics[column] = {

            "count": int(series.count()),

            "mean": round(float(series.mean()), 2),

            "median": round(float(series.median()), 2),

            "mode": (
                round(float(series.mode().iloc[0]), 2)
                if not series.mode().empty
                else None
            ),

            "minimum": round(float(series.min()), 2),

            "maximum": round(float(series.max()), 2),

            "standard_deviation": round(float(series.std()), 2),

            "variance": round(float(series.var()), 2),

            "q1": round(float(series.quantile(0.25)), 2),

            "q2": round(float(series.quantile(0.50)), 2),

            "q3": round(float(series.quantile(0.75)), 2),

            "skewness": round(float(series.skew()), 2),

            "kurtosis": round(float(series.kurt()), 2)
        }

    return statistics