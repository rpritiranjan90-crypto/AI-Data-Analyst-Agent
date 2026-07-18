from __future__ import annotations

import pandas as pd

from app.services.cleaning_history import CleaningHistory
from app.services.dataset_cache import DatasetCache


class DatatypeService:
    """
    Enterprise Datatype Conversion Manager.
    """

    @staticmethod
    def convert(
        dataframe: pd.DataFrame,
        column: str,
        target_type: str
    ) -> pd.DataFrame:

        if column not in dataframe.columns:
            raise ValueError(
                f"Column '{column}' not found."
            )

        df = dataframe.copy()

        target_type = target_type.lower()

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

                df[column] = pd.to_datetime(df[column])

            else:

                raise ValueError(
                    f"Unsupported datatype: {target_type}"
                )

        except Exception as error:

            raise ValueError(
                f"Conversion failed: {error}"
            )

        DatasetCache.set_dataset(
            df,
            DatasetCache.get_filename()
        )

        CleaningHistory.add(
            "Datatype Conversion",
            f"{column} converted to {target_type}"
        )

        return df

    @staticmethod
    def detect(
        dataframe: pd.DataFrame
    ) -> dict:

        return {
            column: str(dtype)
            for column, dtype in dataframe.dtypes.items()
        }