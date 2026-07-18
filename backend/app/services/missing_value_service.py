from __future__ import annotations

from typing import Any

import pandas as pd

from app.services.cleaning_history import CleaningHistory
from app.services.dataset_cache import DatasetCache


class MissingValueService:
    """
    Enterprise Missing Value Manager.
    """

    @staticmethod
    def fill(
        dataframe: pd.DataFrame,
        column: str,
        method: str,
        value: Any = None
    ) -> pd.DataFrame:

        if column not in dataframe.columns:
            raise ValueError(
                f"Column '{column}' not found."
            )

        df = dataframe.copy()

        method = method.lower()

        if method == "mean":

            df[column] = df[column].fillna(
                df[column].mean()
            )

        elif method == "median":

            df[column] = df[column].fillna(
                df[column].median()
            )

        elif method == "mode":

            df[column] = df[column].fillna(
                df[column].mode()[0]
            )

        elif method == "constant":

            df[column] = df[column].fillna(
                value
            )

        elif method == "ffill":

            df[column] = df[column].ffill()

        elif method == "bfill":

            df[column] = df[column].bfill()

        else:

            raise ValueError(
                f"Unsupported method: {method}"
            )

        DatasetCache.set_dataset(
            df,
            DatasetCache.get_filename()
        )

        CleaningHistory.add(
            "Missing Value Cleaning",
            f"{column} filled using {method}"
        )

        return df

    @staticmethod
    def drop_rows(
        dataframe: pd.DataFrame
    ) -> pd.DataFrame:

        before = len(dataframe)

        df = dataframe.dropna()

        removed = before - len(df)

        DatasetCache.set_dataset(
            df,
            DatasetCache.get_filename()
        )

        CleaningHistory.add(
            "Drop Missing Rows",
            f"Removed {removed} rows"
        )

        return df

    @staticmethod
    def drop_columns(
        dataframe: pd.DataFrame
    ) -> pd.DataFrame:

        before = len(dataframe.columns)

        df = dataframe.dropna(
            axis=1
        )

        removed = before - len(df.columns)

        DatasetCache.set_dataset(
            df,
            DatasetCache.get_filename()
        )

        CleaningHistory.add(
            "Drop Missing Columns",
            f"Removed {removed} columns"
        )

        return df