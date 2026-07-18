from __future__ import annotations

from typing import Any

import pandas as pd


class QualityService:
    """
    Calculates the overall dataset quality score.
    """

    @staticmethod
    def calculate(
        dataframe: pd.DataFrame
    ) -> dict[str, Any]:

        total_rows = len(dataframe)
        total_columns = len(dataframe.columns)
        total_cells = total_rows * total_columns

        missing = int(
            dataframe.isnull().sum().sum()
        )

        duplicates = int(
            dataframe.duplicated().sum()
        )

        missing_percentage = (
            (missing / total_cells) * 100
            if total_cells > 0
            else 0
        )

        duplicate_percentage = (
            (duplicates / total_rows) * 100
            if total_rows > 0
            else 0
        )

        quality_score = max(
            0,
            round(
                100
                - missing_percentage
                - duplicate_percentage,
                2
            )
        )

        if quality_score >= 95:
            rating = "Excellent"

        elif quality_score >= 85:
            rating = "Good"

        elif quality_score >= 70:
            rating = "Average"

        else:
            rating = "Poor"

        return {

            "quality_score": quality_score,

            "rating": rating,

            "missing_values": missing,

            "duplicate_rows": duplicates,

            "missing_percentage": round(
                missing_percentage,
                2
            ),

            "duplicate_percentage": round(
                duplicate_percentage,
                2
            )
        }