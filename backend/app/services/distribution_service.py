from __future__ import annotations

from typing import Any

import pandas as pd


class DistributionService:
    """
    Enterprise Distribution Analysis Service.

    Performs comprehensive distribution analysis for
    all numeric columns.
    """

    @staticmethod
    def analyze(
        dataframe: pd.DataFrame,
    ) -> dict[str, Any]:

        numeric_df = dataframe.select_dtypes(
            include=["number"]
        )

        if numeric_df.empty:
            return {
                "message": "No numeric columns found in the dataset."
            }

        result: dict[str, Any] = {}

        for column in numeric_df.columns:

            series = numeric_df[column]

            q1 = float(series.quantile(0.25))
            q3 = float(series.quantile(0.75))
            iqr = q3 - q1

            lower_bound = q1 - (1.5 * iqr)
            upper_bound = q3 + (1.5 * iqr)

            outliers = series[
                (series < lower_bound)
                | (series > upper_bound)
            ]

            skewness = float(series.skew())
            kurtosis = float(series.kurt())

            # -----------------------------
            # Skewness Interpretation
            # -----------------------------

            if abs(skewness) < 0.5:
                skew_type = "Approximately Symmetric"

            elif abs(skewness) < 1:
                skew_type = (
                    "Moderately Positively Skewed"
                    if skewness > 0
                    else "Moderately Negatively Skewed"
                )

            else:
                skew_type = (
                    "Highly Positively Skewed"
                    if skewness > 0
                    else "Highly Negatively Skewed"
                )

            # -----------------------------
            # Kurtosis Interpretation
            # -----------------------------

            if kurtosis > 3:
                kurtosis_type = "Leptokurtic"

            elif kurtosis < 3:
                kurtosis_type = "Platykurtic"

            else:
                kurtosis_type = "Mesokurtic"

            result[column] = {

                "count": int(series.count()),

                "mean": round(float(series.mean()), 2),

                "median": round(float(series.median()), 2),

                "standard_deviation": round(
                    float(series.std()),
                    2,
                ),

                "variance": round(
                    float(series.var()),
                    2,
                ),

                "minimum": round(
                    float(series.min()),
                    2,
                ),

                "maximum": round(
                    float(series.max()),
                    2,
                ),

                "range": round(
                    float(series.max() - series.min()),
                    2,
                ),

                "q1": round(q1, 2),

                "q3": round(q3, 2),

                "iqr": round(iqr, 2),

                "skewness": round(
                    skewness,
                    3,
                ),

                "skewness_type": skew_type,

                "kurtosis": round(
                    kurtosis,
                    3,
                ),

                "kurtosis_type": kurtosis_type,

                "coefficient_of_variation": (
                    round(
                        (series.std() / series.mean()) * 100,
                        2,
                    )
                    if series.mean() != 0
                    else None
                ),

                "normal_distribution": (
                    abs(skewness) < 0.5
                ),

                "outliers": {
                    "count": int(len(outliers)),
                    "lower_bound": round(lower_bound, 2),
                    "upper_bound": round(upper_bound, 2),
                },
            }

        return result