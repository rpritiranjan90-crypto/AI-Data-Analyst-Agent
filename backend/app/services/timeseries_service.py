from __future__ import annotations

from typing import Any

import pandas as pd


class TimeSeriesService:
    """
    Enterprise Time Series Analysis Service.
    """

    @staticmethod
    def analyze(
        dataframe: pd.DataFrame
    ) -> dict[str, Any]:

        result = {}

        datetime_columns = dataframe.select_dtypes(
            include=["datetime64[ns]", "datetime64"]
        ).columns

        if len(datetime_columns) == 0:

            return {
                "has_datetime": False,
                "message": "No datetime columns found."
            }

        result["has_datetime"] = True

        result["columns"] = {}

        for column in datetime_columns:

            result["columns"][column] = {

                "start_date": str(
                    dataframe[column].min()
                ),

                "end_date": str(
                    dataframe[column].max()
                ),

                "total_records": int(
                    dataframe[column].count()
                ),

                "missing_dates": int(
                    dataframe[column].isnull().sum()
                ),

                "unique_dates": int(
                    dataframe[column].nunique()
                )
            }

        return result