from __future__ import annotations

import numpy as np
import pandas as pd

from app.visualization.chart_utils import ChartUtils


class TimeSeriesBuilder:
    """
    Shared preparation logic for time-series charts.

    Used by:
        • Line Chart
        • Area Chart
        • Forecast Charts
        • Rolling Average
        • Moving Average
        • Trend Analysis

    Responsibilities
    ----------------
    • Validate datetime column
    • Validate value column
    • Remove missing values
    • Remove infinite values
    • Sort by datetime
    • Optional resampling
    """

    @staticmethod
    def prepare(
        dataframe: pd.DataFrame,
        date_column: str,
        value_column: str,
        sort: bool = True
    ) -> pd.DataFrame:
        """
        Prepare time-series data.
        """

        ChartUtils.validate_columns(
            dataframe,
            date_column,
            value_column
        )

        ChartUtils.validate_numeric(
            dataframe,
            value_column
        )

        data = dataframe[
            [date_column, value_column]
        ].copy()

        data[date_column] = pd.to_datetime(
            data[date_column],
            errors="coerce"
        )

        data = data.replace(
            [np.inf, -np.inf],
            np.nan
        )

        data = data.dropna()

        if sort:
            data = data.sort_values(
                by=date_column
            )

        return data.reset_index(drop=True)

    @staticmethod
    def resample(
        dataframe: pd.DataFrame,
        date_column: str,
        value_column: str,
        frequency: str = "D",
        aggregation: str = "mean"
    ) -> pd.DataFrame:
        """
        Resample time-series data.

        frequency examples:
            D  -> Daily
            W  -> Weekly
            M  -> Monthly
            Q  -> Quarterly
            Y  -> Yearly
        """

        data = TimeSeriesBuilder.prepare(
            dataframe,
            date_column,
            value_column
        )

        data = data.set_index(
            date_column
        )

        result = (
            data[value_column]
            .resample(frequency)
            .agg(aggregation)
            .dropna()
        )

        return result.reset_index()

    @staticmethod
    def rolling_average(
        dataframe: pd.DataFrame,
        value_column: str,
        window: int = 7
    ) -> pd.Series:
        """
        Calculate rolling average.
        """

        return (
            dataframe[value_column]
            .rolling(window=window)
            .mean()
        )

    @staticmethod
    def percentage_change(
        dataframe: pd.DataFrame,
        value_column: str
    ) -> pd.Series:
        """
        Calculate percentage change.
        """

        return (
            dataframe[value_column]
            .pct_change()
        )

    @staticmethod
    def cumulative_sum(
        dataframe: pd.DataFrame,
        value_column: str
    ) -> pd.Series:
        """
        Calculate cumulative sum.
        """

        return (
            dataframe[value_column]
            .cumsum()
        )

    @staticmethod
    def summary(
        dataframe: pd.DataFrame,
        date_column: str
    ) -> dict:
        """
        Return summary statistics.
        """

        return {
            "rows": int(len(dataframe)),
            "start_date": dataframe[date_column].min(),
            "end_date": dataframe[date_column].max(),
            "duration_days": (
                dataframe[date_column].max()
                - dataframe[date_column].min()
            ).days
        }
