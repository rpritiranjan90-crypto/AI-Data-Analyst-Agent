from __future__ import annotations

from typing import Optional
import pandas as pd


class DatasetCache:
    """
    Stores the active dataset in memory.

    Every service (analysis, cleaning, charts, reports, AI)
    reads from this cache instead of reading the file again.
    """

    _dataset: Optional[pd.DataFrame] = None
    _filename: Optional[str] = None

    @classmethod
    def set_dataset(
        cls,
        dataframe: pd.DataFrame,
        filename: str
    ) -> None:

        cls._dataset = dataframe.copy()
        cls._filename = filename

    @classmethod
    def get_dataset(cls) -> Optional[pd.DataFrame]:

        return cls._dataset

    @classmethod
    def get_filename(cls) -> Optional[str]:

        return cls._filename

    @classmethod
    def clear(cls) -> None:

        cls._dataset = None
        cls._filename = None

    @classmethod
    def has_dataset(cls) -> bool:

        return cls._dataset is not None