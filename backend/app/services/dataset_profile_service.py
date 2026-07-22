from __future__ import annotations

from typing import Any

import pandas as pd

from app.common.logger import get_logger
from app.common.timing import measure_time

logger = get_logger(__name__)


class DatasetProfileService:
    """
    Service responsible for generating a structural
    profile of a dataset.
    """

    @measure_time
    def generate(
        self,
        dataframe: pd.DataFrame,
    ) -> dict[str, Any]:
        """
        Generate a complete structural profile
        of the dataset.
        """

        logger.info("Generating dataset profile.")

        numeric_columns = dataframe.select_dtypes(
            include="number",
        ).columns.tolist()

        categorical_columns = dataframe.select_dtypes(
            include=[
                "object",
                "category",
            ],
        ).columns.tolist()

        datetime_columns = dataframe.select_dtypes(
            include=[
                "datetime",
                "datetimetz",
            ],
        ).columns.tolist()

        boolean_columns = dataframe.select_dtypes(
            include="bool",
        ).columns.tolist()

        profile = {
            "rows": len(dataframe),
            "columns": len(dataframe.columns),
            "numeric_columns": numeric_columns,
            "categorical_columns": categorical_columns,
            "datetime_columns": datetime_columns,
            "boolean_columns": boolean_columns,
            "missing_values": {
                column: int(
                    dataframe[column].isna().sum()
                )
                for column in dataframe.columns
            },
            "unique_values": {
                column: int(
                    dataframe[column].nunique(
                        dropna=True
                    )
                )
                for column in dataframe.columns
            },
            "data_types": {
                column: str(
                    dataframe[column].dtype
                )
                for column in dataframe.columns
            },
        }

        logger.info(
            "Dataset profile generated successfully."
        )

        return profile


__all__ = [
    "DatasetProfileService",
]