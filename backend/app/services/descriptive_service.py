from __future__ import annotations

from typing import Any

import pandas as pd


class DescriptiveService:
    """
    Enterprise descriptive statistics service.

    Generates comprehensive descriptive statistics for all numeric columns
    in the dataset.
    """

    @staticmethod
    def analyze(
        dataframe: pd.DataFrame,
    ) -> dict[str, Any]:
        """
        Analyze all numeric columns in the dataframe.

        Args:
            dataframe: Input pandas DataFrame.

        Returns:
            Dictionary containing descriptive statistics for each numeric column.
        """

        numeric_df = dataframe.select_dtypes(include=["number"])

        if numeric_df.empty:
            return {
                "message": "No numeric columns found in the dataset."
            }

        result: dict[str, Any] = {}

        for column in numeric_df.columns:

            series = numeric_df[column]

            q1 = float(series.quantile(0.25))
            q2 = float(series.quantile(0.50))
            q3 = float(series.quantile(0.75))

            mean = float(series.mean())
            std = float(series.std())

            coefficient_of_variation = (
                round((std / mean) * 100, 2)
                if mean != 0
                else None
            )

            mode = (
                round(float(series.mode().iloc[0]), 2)
                if not series.mode().empty
                else None
            )

            result[column] = {

                "count": int(series.count()),

                "missing_values": int(series.isna().sum()),

                "unique_values": int(series.nunique()),

                "sum": round(float(series.sum()), 2),

                "mean": round(mean, 2),

                "median": round(float(series.median()), 2),

                "mode": mode,

                "minimum": round(float(series.min()), 2),

                "maximum": round(float(series.max()), 2),

                "range": round(
                    float(series.max() - series.min()),
                    2,
                ),

                "variance": round(float(series.var()), 2),

                "standard_deviation": round(std, 2),

                "coefficient_of_variation": coefficient_of_variation,

                "skewness": round(float(series.skew()), 2),

                "kurtosis": round(float(series.kurt()), 2),

                "q1": round(q1, 2),

                "q2": round(q2, 2),

                "q3": round(q3, 2),

                "iqr": round(q3 - q1, 2),
            }

        return result