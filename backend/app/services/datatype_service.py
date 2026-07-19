from __future__ import annotations

from typing import Any

import pandas as pd

from app.services.cleaning_history import CleaningHistory
from app.services.dataset_cache import DatasetCache


class DatatypeService:
    """
    Enterprise Datatype Conversion Service.

    Handles datatype conversions for dataset columns and
    provides datatype detection utilities.
    """

    SUPPORTED_TYPES = {
        "int",
        "float",
        "string",
        "bool",
        "datetime",
    }

    @staticmethod
    def convert(
        dataframe: pd.DataFrame,
        column: str,
        target_type: str,
    ) -> dict[str, Any]:
        """
        Convert a dataframe column to the specified datatype.

        Args:
            dataframe: Input dataframe.
            column: Target column.
            target_type: Desired datatype.

        Returns:
            Conversion summary.
        """

        if column not in dataframe.columns:
            raise ValueError(
                f"Column '{column}' not found."
            )

        target_type = target_type.lower()

        if target_type not in DatatypeService.SUPPORTED_TYPES:
            raise ValueError(
                f"Unsupported datatype '{target_type}'. "
                f"Supported types: {', '.join(sorted(DatatypeService.SUPPORTED_TYPES))}"
            )

        df = dataframe.copy()

        original_dtype = str(df[column].dtype)

        try:

            if target_type == "int":

                df[column] = df[column].astype("Int64")

            elif target_type == "float":

                df[column] = df[column].astype(float)

            elif target_type == "string":

                df[column] = df[column].astype(str)

            elif target_type == "bool":

                df[column] = df[column].astype(bool)

            elif target_type == "datetime":

                df[column] = pd.to_datetime(
                    df[column],
                    errors="raise",
                )

        except Exception as error:
            raise ValueError(
                f"Failed to convert column '{column}' "
                f"from '{original_dtype}' to '{target_type}': {error}"
            ) from error

        DatasetCache.set_dataset(
            df,
            DatasetCache.get_filename(),
        )

        CleaningHistory.add(
            "Datatype Conversion",
            f"{column} converted from {original_dtype} to {target_type}",
        )

        return {
            "success": True,
            "column": column,
            "old_datatype": original_dtype,
            "new_datatype": str(df[column].dtype),
            "message": "Datatype converted successfully.",
        }

    @staticmethod
    def detect(
        dataframe: pd.DataFrame,
    ) -> dict[str, str]:
        """
        Detect datatypes of all dataframe columns.

        Args:
            dataframe: Input dataframe.

        Returns:
            Dictionary mapping column names to datatypes.
        """

        return {
            column: str(dtype)
            for column, dtype in dataframe.dtypes.items()
        }