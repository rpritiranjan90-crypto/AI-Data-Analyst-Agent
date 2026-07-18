from __future__ import annotations

import pandas as pd

from app.services.cleaning_history import CleaningHistory
from app.services.dataset_cache import DatasetCache


class DuplicateService:
    """
    Enterprise Duplicate Row Manager.
    """

    @staticmethod
    def get_duplicate_count(
        dataframe: pd.DataFrame
    ) -> int:

        return int(
            dataframe.duplicated().sum()
        )

    @staticmethod
    def remove_duplicates(
        dataframe: pd.DataFrame
    ) -> pd.DataFrame:

        before = len(dataframe)

        df = dataframe.drop_duplicates()

        removed = before - len(df)

        DatasetCache.set_dataset(
            df,
            DatasetCache.get_filename()
        )

        CleaningHistory.add(
            "Duplicate Removal",
            f"Removed {removed} duplicate rows"
        )

        return df

    @staticmethod
    def get_duplicates(
        dataframe: pd.DataFrame
    ) -> pd.DataFrame:

        return dataframe[
            dataframe.duplicated()
        ]