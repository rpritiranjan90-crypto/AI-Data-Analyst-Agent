from __future__ import annotations

import numpy as np
import pandas as pd

from app.visualization.chart_utils import ChartUtils


class NumericalBuilder:
    """
    Shared data preparation for numerical visualizations.

    Supported charts:
        - Histogram
        - KDE Plot
        - Box Plot
        - Violin Plot
        - Hexbin Plot
        - Density Plot

    Responsibilities:
        • Validate numeric columns
        • Remove missing values
        • Remove infinite values
        • Optional outlier removal
        • Statistical summaries
        • Normalization
        • Standardization
    """

    def __new__(cls):
        raise TypeError(
            f"{cls.__name__} is a utility class and cannot be instantiated."
        )

    @staticmethod
    def prepare(
        dataframe: pd.DataFrame,
        column: str,
        remove_outliers: bool = False,
    ) -> pd.Series:
        """
        Prepare a numeric series for visualization.

        Args:
            dataframe: Source DataFrame.
            column: Numeric column.
            remove_outliers: Whether to remove outliers using IQR.

        Returns:
            Clean numeric Series.
        """

        ChartUtils.validate_columns(
            dataframe,
            column,
        )

        ChartUtils.validate_numeric(
            dataframe,
            column,
        )

        cleaned_df = ChartUtils.remove_missing(
            dataframe,
            [column],
        )

        series = cleaned_df[column]

        # Remove infinite values
        series = (
            series.replace([np.inf, -np.inf], np.nan)
            .dropna()
        )

        if remove_outliers:
            series = NumericalBuilder.remove_outliers(series)

        return series

    @staticmethod
    def remove_outliers(
        series: pd.Series,
    ) -> pd.Series:
        """
        Remove outliers using the IQR method.
        """

        q1 = series.quantile(0.25)
        q3 = series.quantile(0.75)

        iqr = q3 - q1

        lower = q1 - 1.5 * iqr
        upper = q3 + 1.5 * iqr

        return series[
            (series >= lower)
            & (series <= upper)
        ]

    @staticmethod
    def summary(
        series: pd.Series,
    ) -> dict:
        """
        Return descriptive statistics.
        """

        return {
            "count": int(series.count()),
            "mean": float(series.mean()),
            "median": float(series.median()),
            "std": float(series.std()),
            "min": float(series.min()),
            "max": float(series.max()),
            "q1": float(series.quantile(0.25)),
            "q3": float(series.quantile(0.75)),
        }

    @staticmethod
    def normalize(
        series: pd.Series,
    ) -> pd.Series:
        """
        Normalize values to the range [0, 1].
        """

        minimum = series.min()
        maximum = series.max()

        if minimum == maximum:
            return pd.Series(
                [0.5] * len(series),
                index=series.index,
            )

        return (series - minimum) / (maximum - minimum)

    @staticmethod
    def standardize(
        series: pd.Series,
    ) -> pd.Series:
        """
        Standardize values using z-score normalization.
        """

        std = series.std()

        if std == 0:
            return pd.Series(
                [0.0] * len(series),
                index=series.index,
            )

        return (series - series.mean()) / std