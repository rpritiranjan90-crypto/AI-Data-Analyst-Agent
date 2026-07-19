from __future__ import annotations

from typing import Any

import pandas as pd

from app.services.dataset_service import DatasetService


class DatasetAnalysisService:
    """
    Enterprise Dataset Analysis Service.

    Provides high-level analysis of the currently loaded dataset.
    """

    def __init__(self) -> None:
        self._dataset_service = DatasetService()

    def _get_dataset(self) -> pd.DataFrame:
        """
        Return the currently loaded dataset.
        """

        return self._dataset_service.get_dataset()

    def analyze(self) -> dict[str, Any]:
        """
        Basic dataset information.
        """

        df = self._get_dataset()

        return {
            "rows": len(df),
            "columns": len(df.columns),
            "column_names": df.columns.tolist(),
            "data_types": {
                column: str(dtype)
                for column, dtype in df.dtypes.items()
            },
            "missing_values": {
                column: int(df[column].isna().sum())
                for column in df.columns
            },
            "duplicate_rows": int(
                df.duplicated().sum()
            ),
            "memory_usage_kb": round(
                df.memory_usage(deep=True).sum()
                / 1024,
                2,
            ),
        }

    def summary(self) -> dict[str, Any]:
        """
        Complete dataset summary.
        """

        df = self._get_dataset()

        return {
            "rows": len(df),
            "columns": len(df.columns),
            "column_names": df.columns.tolist(),
            "data_types": {
                column: str(dtype)
                for column, dtype in df.dtypes.items()
            },
            "missing_values": {
                column: int(df[column].isna().sum())
                for column in df.columns
            },
            "duplicate_rows": int(
                df.duplicated().sum()
            ),
            "memory_usage_kb": round(
                df.memory_usage(deep=True).sum()
                / 1024,
                2,
            ),
            "summary_statistics": (
                df.describe(
                    include="all",
                )
                .fillna("")
                .to_dict()
            ),
        }


__all__ = [
    "DatasetAnalysisService",
]