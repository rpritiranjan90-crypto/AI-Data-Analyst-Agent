from __future__ import annotations

from typing import Any

import pandas as pd


class TimeSeriesService:
    """
    Enterprise Time Series Analysis Service.

    Analyzes datetime columns and provides
    comprehensive time-based statistics.
    """

    @staticmethod
    def analyze(
        dataframe: pd.DataFrame,
    ) -> dict[str, Any]:

        result: dict[str, Any] = {}

        datetime_columns = dataframe.select_dtypes(
            include=["datetime64[ns]", "datetime64"]
        ).columns

        if len(datetime_columns) == 0:
            return {
                "has_datetime": False,
                "message": "No datetime columns found.",
            }

        result["has_datetime"] = True
        result["total_datetime_columns"] = len(datetime_columns)
        result["columns"] = {}

        for column in datetime_columns:

            series = dataframe[column].dropna()

            if series.empty:
                result["columns"][column] = {
                    "message": "Datetime column contains no valid values."
                }
                continue

            start = series.min()
            end = series.max()

            duration = end - start

            duplicate_dates = int(series.duplicated().sum())

            result["columns"][column] = {

                "start_date": str(start),

                "end_date": str(end),

                "duration_days": int(duration.days),

                "total_records": int(series.count()),

                "missing_dates": int(
                    dataframe[column].isnull().sum()
                ),

                "duplicate_dates": duplicate_dates,

                "unique_dates": int(series.nunique()),

                "earliest_year": int(start.year),

                "latest_year": int(end.year),

                "months_covered": int(
                    series.dt.to_period("M").nunique()
                ),

                "quarters_covered": int(
                    series.dt.to_period("Q").nunique()
                ),

                "years_covered": int(
                    series.dt.year.nunique()
                ),

                "weekdays_present": sorted(
                    series.dt.day_name().unique().tolist()
                ),

                "weekends_present": bool(
                    series.dt.dayofweek.isin([5, 6]).any()
                ),

                "is_sorted": bool(
                    series.is_monotonic_increasing
                ),

                "frequency_guess": pd.infer_freq(
                    series.sort_values()
                )
                if len(series) >= 3
                else None,
            }

        return result