from __future__ import annotations

from typing import Any

import pandas as pd


class QualityService:
    """
    Enterprise Dataset Quality Assessment Service.

    Evaluates the overall quality of a dataset using multiple quality metrics.
    """

    @staticmethod
    def calculate(
        dataframe: pd.DataFrame,
    ) -> dict[str, Any]:
        """
        Calculate dataset quality metrics.

        Args:
            dataframe: Input dataframe.

        Returns:
            Dictionary containing quality metrics and overall rating.
        """

        total_rows = len(dataframe)
        total_columns = len(dataframe.columns)
        total_cells = total_rows * total_columns

        # -----------------------------
        # Missing Values
        # -----------------------------

        missing_values = int(
            dataframe.isnull().sum().sum()
        )

        missing_percentage = (
            (missing_values / total_cells) * 100
            if total_cells
            else 0
        )

        # -----------------------------
        # Duplicate Rows
        # -----------------------------

        duplicate_rows = int(
            dataframe.duplicated().sum()
        )

        duplicate_percentage = (
            (duplicate_rows / total_rows) * 100
            if total_rows
            else 0
        )

        # -----------------------------
        # Constant Columns
        # -----------------------------

        constant_columns = [
            column
            for column in dataframe.columns
            if dataframe[column].nunique(dropna=False) <= 1
        ]

        constant_column_count = len(constant_columns)

        # -----------------------------
        # Duplicate Columns
        # -----------------------------

        duplicate_columns = []

        columns = dataframe.columns.tolist()

        for i in range(len(columns)):
            for j in range(i + 1, len(columns)):
                if dataframe[columns[i]].equals(dataframe[columns[j]]):
                    duplicate_columns.append(columns[j])

        duplicate_column_count = len(duplicate_columns)

        # -----------------------------
        # Completeness
        # -----------------------------

        completeness = (
            (
                (total_cells - missing_values)
                / total_cells
            )
            * 100
            if total_cells
            else 100
        )

        # -----------------------------
        # Quality Score
        # -----------------------------

        quality_score = (
            100
            - missing_percentage
            - duplicate_percentage
            - (constant_column_count * 2)
            - (duplicate_column_count * 2)
        )

        quality_score = round(max(0, quality_score), 2)

        # -----------------------------
        # Rating
        # -----------------------------

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

            "rows": total_rows,

            "columns": total_columns,

            "missing_values": missing_values,

            "missing_percentage": round(
                missing_percentage,
                2,
            ),

            "duplicate_rows": duplicate_rows,

            "duplicate_percentage": round(
                duplicate_percentage,
                2,
            ),

            "constant_columns": constant_columns,

            "constant_column_count": constant_column_count,

            "duplicate_columns": duplicate_columns,

            "duplicate_column_count": duplicate_column_count,

            "completeness_percentage": round(
                completeness,
                2,
            ),
        }