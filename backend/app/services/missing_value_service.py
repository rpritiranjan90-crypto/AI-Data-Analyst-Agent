from __future__ import annotations

from typing import Any

import pandas as pd

from app.services.cleaning_history import CleaningHistory
from app.services.dataset_cache import DatasetCache


class MissingValueService:
    """
    Enterprise Missing Value Cleaning Service.

    Supports multiple imputation strategies and updates
    the active dataset cache after cleaning.
    """

    SUPPORTED_METHODS = {
        "mean",
        "median",
        "mode",
        "constant",
        "ffill",
        "bfill",
    }

    @staticmethod
    def fill(
        dataframe: pd.DataFrame,
        column: str,
        method: str,
        value: Any = None,
    ) -> dict[str, Any]:
        """
        Fill missing values in a column.

        Args:
            dataframe: Input dataframe.
            column: Target column.
            method: Filling strategy.
            value: Constant value (only for constant method).

        Returns:
            Cleaning summary.
        """

        if column not in dataframe.columns:
            raise ValueError(
                f"Column '{column}' not found."
            )

        method = method.lower()

        if method not in MissingValueService.SUPPORTED_METHODS:
            raise ValueError(
                f"Unsupported method '{method}'. "
                f"Supported methods: {', '.join(sorted(MissingValueService.SUPPORTED_METHODS))}"
            )

        df = dataframe.copy()

        before_missing = int(df[column].isna().sum())

        if method == "mean":

            if not pd.api.types.is_numeric_dtype(df[column]):
                raise ValueError(
                    "Mean imputation requires a numeric column."
                )

            df[column] = df[column].fillna(
                df[column].mean()
            )

        elif method == "median":

            if not pd.api.types.is_numeric_dtype(df[column]):
                raise ValueError(
                    "Median imputation requires a numeric column."
                )

            df[column] = df[column].fillna(
                df[column].median()
            )

        elif method == "mode":

            mode = df[column].mode()

            if mode.empty:
                raise ValueError(
                    "Mode could not be calculated."
                )

            df[column] = df[column].fillna(
                mode.iloc[0]
            )

        elif method == "constant":

            if value is None:
                raise ValueError(
                    "A constant value must be provided."
                )

            df[column] = df[column].fillna(value)

        elif method == "ffill":

            df[column] = df[column].ffill()

        elif method == "bfill":

            df[column] = df[column].bfill()

        after_missing = int(df[column].isna().sum())

        DatasetCache.set_dataset(
            df,
            DatasetCache.get_filename(),
        )

        CleaningHistory.add(
            "Missing Value Cleaning",
            f"{column} filled using {method}",
        )

        return {
            "success": True,
            "column": column,
            "method": method,
            "missing_before": before_missing,
            "missing_after": after_missing,
            "filled_values": before_missing - after_missing,
            "message": "Missing values filled successfully.",
        }

    @staticmethod
    def drop_rows(
        dataframe: pd.DataFrame,
    ) -> dict[str, Any]:
        """
        Remove rows containing missing values.
        """

        before = len(dataframe)

        df = dataframe.dropna()

        removed = before - len(df)

        DatasetCache.set_dataset(
            df,
            DatasetCache.get_filename(),
        )

        CleaningHistory.add(
            "Drop Missing Rows",
            f"Removed {removed} rows",
        )

        return {
            "success": True,
            "rows_removed": removed,
            "remaining_rows": len(df),
            "message": "Rows with missing values removed successfully.",
        }

    @staticmethod
    def drop_columns(
        dataframe: pd.DataFrame,
    ) -> dict[str, Any]:
        """
        Remove columns containing missing values.
        """

        before = len(dataframe.columns)

        df = dataframe.dropna(axis=1)

        removed = before - len(df.columns)

        DatasetCache.set_dataset(
            df,
            DatasetCache.get_filename(),
        )

        CleaningHistory.add(
            "Drop Missing Columns",
            f"Removed {removed} columns",
        )
        
        
        return {
            "success": True,
            "columns_removed": removed,
            "remaining_columns": len(df.columns),
            "message": "Columns with missing values removed successfully.",
        }