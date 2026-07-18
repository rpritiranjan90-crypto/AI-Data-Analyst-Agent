from __future__ import annotations

import numpy as np
import pandas as pd

from app.visualization.chart_utils import ChartUtils


class RelationshipBuilder:
    """
    Shared data preparation for relationship-based visualizations.

    Supported charts:
        - Scatter Plot
        - Bubble Chart
        - Line Chart
        - Area Chart
        - Radar Chart
        - 3D Scatter Plot

    Responsibilities:
        • Validate required columns
        • Validate numeric columns
        • Remove missing values
        • Remove infinite values
        • Optional sorting
        • Bubble size scaling
        • Correlation analysis
        • Covariance analysis
    """

    def __new__(cls):
        raise TypeError(
            f"{cls.__name__} is a utility class and cannot be instantiated."
        )

    @staticmethod
    def prepare(
        dataframe: pd.DataFrame,
        *columns: str,
        sort_by: str |None = None,
    ) -> pd.DataFrame:
        """
        Prepare data for relationship charts.
        """

        ChartUtils.validate_columns(
            dataframe,
            *columns,
        )

        ChartUtils.validate_numeric(
            dataframe,
            *columns,
        )

        data = ChartUtils.remove_missing(
            dataframe,
            list(columns),
        ).copy()

        data = (
            data[list(columns)]
            .replace([np.inf, -np.inf], np.nan)
            .dropna()
        )

        if sort_by:

            if sort_by not in data.columns:
                raise ValueError(
                    f"Sort column '{sort_by}' not found."
                )

            data = data.sort_values(
                by=sort_by
            )

        return data.reset_index(drop=True)

    @staticmethod
    def scale_bubble_sizes(
        values: pd.Series,
        min_size: int = 40,
        max_size: int = 1000,
    ) -> pd.Series:
        """
        Scale bubble sizes to a display-friendly range.
        """

        minimum = values.min()
        maximum = values.max()

        if minimum == maximum:
            return pd.Series(
                [300] * len(values),
                index=values.index,
            )

        return (
            (values - minimum)
            / (maximum - minimum)
            * (max_size - min_size)
            + min_size
        )

    @staticmethod
    def correlation(
        dataframe: pd.DataFrame,
        x_column: str,
        y_column: str,
    ) -> float:
        """
        Calculate Pearson correlation coefficient.
        """

        data = RelationshipBuilder.prepare(
            dataframe,
            x_column,
            y_column,
        )

        return float(
            data[x_column].corr(
                data[y_column]
            )
        )

    @staticmethod
    def covariance(
        dataframe: pd.DataFrame,
        x_column: str,
        y_column: str,
    ) -> float:
        """
        Calculate covariance.
        """

        data = RelationshipBuilder.prepare(
            dataframe,
            x_column,
            y_column,
        )

        return float(
            data[x_column].cov(
                data[y_column]
            )
        )

    @staticmethod
    def summary(
        dataframe: pd.DataFrame,
    ) -> dict:
        """
        Return summary statistics.
        """

        return {
            "rows": len(dataframe),
            "columns": list(dataframe.columns),
            "missing_values": int(
                dataframe.isna().sum().sum()
            ),
        }