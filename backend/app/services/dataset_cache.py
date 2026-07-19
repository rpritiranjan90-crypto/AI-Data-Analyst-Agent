from __future__ import annotations

from datetime import datetime
from typing import Any, Optional

import pandas as pd


class DatasetCache:
    """
    Enterprise Dataset Cache.

    Stores the active dataset in memory so that all modules
    (analysis, visualization, ML, reporting, AI)
    work with a single shared dataset.
    """

    _dataset: Optional[pd.DataFrame] = None
    _filename: Optional[str] = None
    _uploaded_at: Optional[datetime] = None

    @classmethod
    def set_dataset(
        cls,
        dataframe: pd.DataFrame,
        filename: str,
    ) -> None:
        """
        Cache a dataset.

        Args:
            dataframe: Dataset to cache.
            filename: Original filename.
        """

        cls._dataset = dataframe.copy(deep=True)
        cls._filename = filename
        cls._uploaded_at = datetime.now()

    @classmethod
    def get_dataset(
        cls,
    ) -> Optional[pd.DataFrame]:
        """
        Return a copy of the cached dataset.
        """

        if cls._dataset is None:
            return None

        return cls._dataset.copy(deep=True)

    @classmethod
    def get_filename(
        cls,
    ) -> Optional[str]:
        """
        Return the cached filename.
        """

        return cls._filename

    @classmethod
    def get_upload_time(
        cls,
    ) -> Optional[datetime]:
        """
        Return upload timestamp.
        """

        return cls._uploaded_at

    @classmethod
    def get_cache_info(
        cls,
    ) -> dict[str, Any]:
        """
        Return cache metadata.
        """

        if cls._dataset is None:
            return {
                "loaded": False
            }

        return {

            "loaded": True,

            "filename": cls._filename,

            "rows": len(cls._dataset),

            "columns": len(cls._dataset.columns),

            "uploaded_at": (
                cls._uploaded_at.isoformat()
                if cls._uploaded_at
                else None
            ),
        }

    @classmethod
    def clear(
        cls,
    ) -> None:
        """
        Clear cached dataset.
        """

        cls._dataset = None
        cls._filename = None
        cls._uploaded_at = None

    @classmethod
    def has_dataset(
        cls,
    ) -> bool:
        """
        Check whether a dataset is cached.
        """

        return cls._dataset is not None