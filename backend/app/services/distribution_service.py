from __future__ import annotations

from typing import Any
import numpy as np
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
            series = numeric_df[column].dropna()
            if series.empty:
                continue

            q1 = float(series.quantile(0.25)) if len(series) > 0 else 0.0
            q3 = float(series.quantile(0.75)) if len(series) > 0 else 0.0
            iqr = q3 - q1

            lower_bound = q1 - (1.5 * iqr)
            upper_bound = q3 + (1.5 * iqr)

            outliers = series[
                (series < lower_bound)
                | (series > upper_bound)
            ]

            raw_skew = float(series.skew()) if len(series) >= 3 else 0.0
            raw_kurt = float(series.kurt()) if len(series) >= 4 else 0.0

            skewness = 0.0 if np.isnan(raw_skew) else raw_skew
            kurtosis = 0.0 if np.isnan(raw_kurt) else raw_kurt

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

            mean_val = float(series.mean()) if not series.empty else 0.0
            std_val = float(series.std()) if len(series) > 1 else 0.0
            var_val = float(series.var()) if len(series) > 1 else 0.0
            min_val = float(series.min()) if not series.empty else 0.0
            max_val = float(series.max()) if not series.empty else 0.0

            cv = (
                round((std_val / mean_val) * 100, 2)
                if mean_val != 0 and not np.isnan(mean_val) and not np.isnan(std_val)
                else 0.0
            )

            result[column] = {
                "count": int(len(series)),
                "mean": round(0.0 if np.isnan(mean_val) else mean_val, 2),
                "median": round(float(series.median()), 2) if not series.empty else 0.0,
                "standard_deviation": round(0.0 if np.isnan(std_val) else std_val, 2),
                "variance": round(0.0 if np.isnan(var_val) else var_val, 2),
                "minimum": round(0.0 if np.isnan(min_val) else min_val, 2),
                "maximum": round(0.0 if np.isnan(max_val) else max_val, 2),
                "range": round(0.0 if (np.isnan(max_val) or np.isnan(min_val)) else (max_val - min_val), 2),
                "q1": round(q1, 2),
                "q3": round(q3, 2),
                "iqr": round(iqr, 2),
                "skewness": round(skewness, 3),
                "skewness_type": skew_type,
                "kurtosis": round(kurtosis, 3),
                "kurtosis_type": kurtosis_type,
                "coefficient_of_variation": cv,
                "normal_distribution": (abs(skewness) < 0.5),
                "outliers": {
                    "count": int(len(outliers)),
                    "lower_bound": round(lower_bound, 2),
                    "upper_bound": round(upper_bound, 2),
                },
            }

        return result