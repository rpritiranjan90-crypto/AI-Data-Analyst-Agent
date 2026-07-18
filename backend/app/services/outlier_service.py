from __future__ import annotations

import pandas as pd
import numpy as np

from app.services.cleaning_history import CleaningHistory
from app.services.dataset_cache import DatasetCache


class OutlierService:
    """
    Enterprise Outlier Manager.
    """

    @staticmethod
    def remove_iqr(
        dataframe: pd.DataFrame,
        column: str
    ) -> pd.DataFrame:

        if column not in dataframe.columns:
            raise ValueError(
                f"Column '{column}' not found."
            )

        df = dataframe.copy()

        q1 = df[column].quantile(0.25)
        q3 = df[column].quantile(0.75)

        iqr = q3 - q1

        lower = q1 - (1.5 * iqr)
        upper = q3 + (1.5 * iqr)

        before = len(df)

        df = df[
            (df[column] >= lower) &
            (df[column] <= upper)
        ]

        removed = before - len(df)

        DatasetCache.set_dataset(
            df,
            DatasetCache.get_filename()
        )

        CleaningHistory.add(
            "IQR Outlier Removal",
            f"{removed} rows removed from '{column}'"
        )

        return df

    @staticmethod
    def remove_zscore(
        dataframe: pd.DataFrame,
        column: str,
        threshold: float = 3.0
    ) -> pd.DataFrame:

        if column not in dataframe.columns:
            raise ValueError(
                f"Column '{column}' not found."
            )

        df = dataframe.copy()

        z_scores = (
            df[column] - df[column].mean()
        ) / df[column].std()

        before = len(df)

        df = df[
            np.abs(z_scores) <= threshold
        ]

        removed = before - len(df)

        DatasetCache.set_dataset(
            df,
            DatasetCache.get_filename()
        )

        CleaningHistory.add(
            "Z-Score Outlier Removal",
            f"{removed} rows removed from '{column}'"
        )

        return df

    @staticmethod
    def count_outliers_iqr(
        dataframe: pd.DataFrame,
        column: str
    ) -> int:

        q1 = dataframe[column].quantile(0.25)
        q3 = dataframe[column].quantile(0.75)

        iqr = q3 - q1

        lower = q1 - (1.5 * iqr)
        upper = q3 + (1.5 * iqr)

        return int(
            (
                (dataframe[column] < lower) |
                (dataframe[column] > upper)
            ).sum()
        )