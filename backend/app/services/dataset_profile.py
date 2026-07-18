from __future__ import annotations

from typing import Any

import pandas as pd


def generate_profile(
    dataframe: pd.DataFrame
) -> dict[str, Any]:
    """
    Generate a complete profile of the dataset.
    """

    numeric_columns = list(
        dataframe.select_dtypes(
            include=["number"]
        ).columns
    )

    categorical_columns = list(
        dataframe.select_dtypes(
            include=["object", "category"]
        ).columns
    )

    datetime_columns = list(
        dataframe.select_dtypes(
            include=["datetime"]
        ).columns
    )

    boolean_columns = list(
        dataframe.select_dtypes(
            include=["bool"]
        ).columns
    )

    profile = {

        "rows": len(dataframe),

        "columns": len(dataframe.columns),

        "numeric_columns": numeric_columns,

        "categorical_columns": categorical_columns,

        "datetime_columns": datetime_columns,

        "boolean_columns": boolean_columns,

        "missing_values": dataframe.isnull().sum().to_dict(),

        "unique_values": {
            column: int(dataframe[column].nunique())
            for column in dataframe.columns
        },

        "data_types": {
            column: str(dtype)
            for column, dtype in dataframe.dtypes.items()
        }
    }

    return profile