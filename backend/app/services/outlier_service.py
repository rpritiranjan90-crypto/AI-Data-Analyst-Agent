from __future__ import annotations

from typing import Any

import numpy as np
import pandas as pd

from app.services.cleaning_history import CleaningHistory
from app.services.dataset_cache import DatasetCache


class OutlierService:
    """
    Enterprise Outlier Management Service.

    Provides utilities for detecting and removing outliers
    using IQR and Z-Score methods.
    """

    @staticmethod
    def _validate_numeric_column(
        dataframe: pd.DataFrame,
        column: str,
    ) -> None:
        """
        Validate that a column exists and is numeric.
        """

        if column not in dataframe.columns:
            raise ValueError(
                f"Column '{column}' not found."
            )

        if not pd.api.types.is_numeric_dtype(
            dataframe[column]
        ):
            raise ValueError(
                f"Column '{column}' must be numeric."
            )

    @staticmethod
    def remove_iqr(
        dataframe: pd.DataFrame,
        column: str,
    ) -> dict[str, Any]:
        """
        Remove outliers using the IQR method.
        """

        OutlierService._validate_numeric_column(
            dataframe,
            column,
        )

        df = dataframe.copy()

        q1 = df[column].quantile(0.25)
        q3 = df[column].quantile(0.75)

        iqr = q3 - q1

        lower = q1 - (1.5 * iqr)
        upper = q3 + (1.5 * iqr)

        before = len(df)

        df = df[
            (df[column] >= lower)
            & (df[column] <= upper)
        ]

        removed = before - len(df)

        DatasetCache.set_dataset(
            df,
            DatasetCache.get_filename(),
        )

        CleaningHistory.add(
            "IQR Outlier Removal",
            f"{removed} rows removed from '{column}'",
        )

        return {
            "success": True,
            "method": "IQR",
            "column": column,
            "rows_before": before,
            "rows_after": len(df),
            "outliers_removed": removed,
            "lower_bound": round(float(lower), 2),
            "upper_bound": round(float(upper), 2),
            "message": "Outliers removed successfully using IQR.",
        }

    @staticmethod
    def remove_zscore(
        dataframe: pd.DataFrame,
        column: str,
        threshold: float = 3.0,
    ) -> dict[str, Any]:
        """
        Remove outliers using the Z-Score method.
        """

        OutlierService._validate_numeric_column(
            dataframe,
            column,
        )

        if threshold <= 0:
            raise ValueError(
                "Threshold must be greater than zero."
            )

        df = dataframe.copy()

        std = df[column].std()

        if std == 0:
            raise ValueError(
                "Cannot calculate Z-score because the standard deviation is zero."
            )

        z_scores = (
            df[column] - df[column].mean()
        ) / std

        before = len(df)

        df = df[
            np.abs(z_scores) <= threshold
        ]

        removed = before - len(df)

        DatasetCache.set_dataset(
            df,
            DatasetCache.get_filename(),
        )

        CleaningHistory.add(
            "Z-Score Outlier Removal",
            f"{removed} rows removed from '{column}'",
        )

        return {
            "success": True,
            "method": "Z-Score",
            "column": column,
            "threshold": threshold,
            "rows_before": before,
            "rows_after": len(df),
            "outliers_removed": removed,
            "message": "Outliers removed successfully using Z-score.",
        }

    @staticmethod
    def count_outliers_iqr(
        dataframe: pd.DataFrame,
        column: str,
    ) -> dict[str, Any]:
        """
        Count outliers using the IQR method.
        """

        OutlierService._validate_numeric_column(
            dataframe,
            column,
        )

        q1 = dataframe[column].quantile(0.25)
        q3 = dataframe[column].quantile(0.75)

        iqr = q3 - q1

        lower = q1 - (1.5 * iqr)
        upper = q3 + (1.5 * iqr)

        outliers = (
            (dataframe[column] < lower)
            | (dataframe[column] > upper)
        )

        return {
            "column": column,
            "method": "IQR",
            "outlier_count": int(outliers.sum()),
            "lower_bound": round(float(lower), 2),
            "upper_bound": round(float(upper), 2),
        }

    @staticmethod
    def count_outliers_zscore(
        dataframe: pd.DataFrame,
        column: str,
        threshold: float = 3.0,
    ) -> dict[str, Any]:
        """
        Count outliers using the Z-Score method.
        """

        OutlierService._validate_numeric_column(
            dataframe,
            column,
        )

        if threshold <= 0:
            raise ValueError(
                "Threshold must be greater than zero."
            )

        std = dataframe[column].std()

        if std == 0:
            raise ValueError(
                "Cannot calculate Z-score because the standard deviation is zero."
            )

        z_scores = (
            dataframe[column] - dataframe[column].mean()
        ) / std

        outliers = np.abs(z_scores) > threshold

        return {
            "column": column,
            "method": "Z-Score",
            "threshold": threshold,
            "outlier_count": int(outliers.sum()),
        }