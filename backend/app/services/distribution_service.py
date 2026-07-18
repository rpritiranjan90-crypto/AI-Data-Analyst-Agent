from __future__ import annotations

from typing import Any

import pandas as pd


class DistributionService:
    """
    Enterprise Distribution Analysis Service.
    """

    @staticmethod
    def analyze(
        dataframe: pd.DataFrame
    ) -> dict[str, Any]:

        numeric_df = dataframe.select_dtypes(
            include=["number"]
        )

        result = {}

        for column in numeric_df.columns:

            series = numeric_df[column]

            skewness = float(series.skew())

            kurtosis = float(series.kurt())

            if abs(skewness) < 0.5:
                skew_type = "Approximately Symmetric"

            elif skewness > 0:
                skew_type = "Positively Skewed"

            else:
                skew_type = "Negatively Skewed"

            if kurtosis > 3:
                kurtosis_type = "Leptokurtic"

            elif kurtosis < 3:
                kurtosis_type = "Platykurtic"

            else:
                kurtosis_type = "Mesokurtic"

            result[column] = {

                "skewness": round(
                    skewness,
                    3
                ),

                "skewness_type": skew_type,

                "kurtosis": round(
                    kurtosis,
                    3
                ),

                "kurtosis_type": kurtosis_type,

                "normal_distribution": (
                    abs(skewness) < 0.5
                )
            }

        return result