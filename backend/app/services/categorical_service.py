from __future__ import annotations

from typing import Any

import pandas as pd


class CategoricalService:
    """
    Enterprise Categorical Analysis Service.
    """

    @staticmethod
    def analyze(
        dataframe: pd.DataFrame
    ) -> dict[str, Any]:

        categorical_df = dataframe.select_dtypes(
            include=["object", "category", "bool"]
        )

        result = {}

        for column in categorical_df.columns:

            value_counts = dataframe[column].value_counts()

            percentages = (
                dataframe[column]
                .value_counts(normalize=True)
                .mul(100)
                .round(2)
            )

            result[column] = {

                "unique_values": int(
                    dataframe[column].nunique()
                ),

                "most_frequent": (
                    value_counts.index[0]
                    if not value_counts.empty
                    else None
                ),

                "least_frequent": (
                    value_counts.index[-1]
                    if not value_counts.empty
                    else None
                ),

                "frequency": {
                    str(key): int(value)
                    for key, value in value_counts.items()
                },

                "percentage": {
                    str(key): float(value)
                    for key, value in percentages.items()
                },

                "cardinality": (
                    "High"
                    if dataframe[column].nunique() > 20
                    else "Low"
                )
            }

        return result