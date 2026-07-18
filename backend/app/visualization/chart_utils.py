from __future__ import annotations

from typing import Iterable

import pandas as pd


class ChartUtils:
    """
    Common utilities used by all chart services.
    """

    @staticmethod
    def validate_columns(
        dataframe: pd.DataFrame,
        *columns: str
    ) -> None:

        missing = [
            column
            for column in columns
            if column not in dataframe.columns
        ]

        if missing:
            raise ValueError(
                f"Missing column(s): {', '.join(missing)}"
            )

    @staticmethod
    def validate_numeric(
        dataframe: pd.DataFrame,
        *columns: str
    ) -> None:

        for column in columns:

            if not pd.api.types.is_numeric_dtype(
                dataframe[column]
            ):
                raise ValueError(
                    f"Column '{column}' must be numeric."
                )

    @staticmethod
    def remove_missing(
        dataframe: pd.DataFrame,
        columns: Iterable[str]
    ) -> pd.DataFrame:

        return dataframe.dropna(
            subset=list(columns)
        )

    @staticmethod
    def top_n(
        dataframe: pd.DataFrame,
        column: str,
        limit: int = 10
    ) -> pd.Series:

        return (
            dataframe[column]
            .value_counts()
            .head(limit)
        )

    @staticmethod
    def normalize_series(
        series: pd.Series
    ) -> pd.Series:

        minimum = series.min()
        maximum = series.max()

        if minimum == maximum:

            return pd.Series(
                [0.5] * len(series),
                index=series.index
            )

        return (
            series - minimum
        ) / (
            maximum - minimum
        )