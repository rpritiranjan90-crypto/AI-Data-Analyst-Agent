from __future__ import annotations

from typing import Any

import pandas as pd


class CategoricalService:
    """
    Enterprise Categorical Analysis Service.

    Performs comprehensive analysis of categorical features.
    """

    @staticmethod
    def analyze(
        dataframe: pd.DataFrame,
    ) -> dict[str, Any]:

        categorical_df = dataframe.select_dtypes(
            include=["object", "category", "bool"]
        )

        if categorical_df.empty:
            return {
                "message": "No categorical columns found in the dataset."
            }

        result: dict[str, Any] = {}

        total_rows = len(dataframe)

        for column in categorical_df.columns:

            series = dataframe[column]

            value_counts = series.value_counts(dropna=False)

            percentages = (
                value_counts
                / len(series)
                * 100
            ).round(2)

            unique_count = int(series.nunique(dropna=True))

            # -------------------------
            # Cardinality
            # -------------------------

            if unique_count > 50:
                cardinality = "High"

            elif unique_count > 20:
                cardinality = "Medium"

            else:
                cardinality = "Low"

            # -------------------------
            # Binary / Constant
            # -------------------------

            is_binary = unique_count == 2

            is_constant = unique_count <= 1

            # -------------------------
            # Top / Bottom Categories
            # -------------------------

            top_categories = {
                str(k): int(v)
                for k, v in value_counts.head(5).items()
            }

            bottom_categories = {
                str(k): int(v)
                for k, v in value_counts.tail(5).items()
            }

            result[column] = {

                "total_records": total_rows,

                "unique_values": unique_count,

                "missing_values": int(
                    series.isna().sum()
                ),

                "missing_percentage": round(
                    (series.isna().sum() / total_rows) * 100,
                    2,
                ),

                "most_frequent": (
                    str(value_counts.index[0])
                    if not value_counts.empty
                    else None
                ),

                "least_frequent": (
                    str(value_counts.index[-1])
                    if not value_counts.empty
                    else None
                ),

                "most_frequent_count": (
                    int(value_counts.iloc[0])
                    if not value_counts.empty
                    else 0
                ),

                "frequency": {
                    str(key): int(value)
                    for key, value in value_counts.items()
                },

                "percentage": {
                    str(key): float(value)
                    for key, value in percentages.items()
                },

                "top_categories": top_categories,

                "bottom_categories": bottom_categories,

                "cardinality": cardinality,

                "binary_column": is_binary,

                "constant_column": is_constant,
            }

        return result