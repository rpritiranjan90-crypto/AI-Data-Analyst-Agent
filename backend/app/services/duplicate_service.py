from __future__ import annotations

from typing import Any

import pandas as pd

from app.services.cleaning_history import CleaningHistory
from app.services.dataset_cache import DatasetCache


class DuplicateService:
    """
    Enterprise Duplicate Row Management Service.

    Provides utilities for detecting, counting,
    viewing, and removing duplicate rows.
    """

    @staticmethod
    def get_duplicate_count(
        dataframe: pd.DataFrame,
    ) -> dict[str, Any]:
        """
        Return duplicate row statistics.

        Args:
            dataframe: Input dataframe.

        Returns:
            Dictionary containing duplicate statistics.
        """

        duplicates = int(dataframe.duplicated().sum())

        return {
            "duplicate_rows": duplicates,
            "has_duplicates": duplicates > 0,
        }

    @staticmethod
    def remove_duplicates(
        dataframe: pd.DataFrame,
    ) -> dict[str, Any]:
        """
        Remove duplicate rows.

        Args:
            dataframe: Input dataframe.

        Returns:
            Cleaning summary.
        """

        before = len(dataframe)

        df = dataframe.drop_duplicates()

        removed = before - len(df)

        DatasetCache.set_dataset(
            df,
            DatasetCache.get_filename(),
        )

        CleaningHistory.add(
            "Duplicate Removal",
            f"Removed {removed} duplicate rows",
        )

        return {
            "success": True,
            "rows_before": before,
            "rows_after": len(df),
            "duplicates_removed": removed,
            "message": "Duplicate rows removed successfully.",
        }

    @staticmethod
    def get_duplicates(
        dataframe: pd.DataFrame,
    ) -> dict[str, Any]:
        """
        Retrieve duplicate rows.

        Args:
            dataframe: Input dataframe.

        Returns:
            Duplicate rows and summary.
        """

        duplicates = dataframe[
            dataframe.duplicated()
        ]

        return {
            "duplicate_count": len(duplicates),
            "duplicates": duplicates.to_dict(
                orient="records"
            ),
        }