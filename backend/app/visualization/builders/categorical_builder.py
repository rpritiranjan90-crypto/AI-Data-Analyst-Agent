from __future__ import annotations

import pandas as pd

from app.visualization.chart_utils import ChartUtils


class CategoricalBuilder:
    """
    Shared data preparation for categorical visualizations.

    Supported charts:
        - Bar Chart
        - Pie Chart
        - Donut Chart
        - Count Plot
        - Treemap
        - Sunburst
    """

    def __new__(cls):
        raise TypeError(
            f"{cls.__name__} is a utility class and cannot be instantiated."
        )

    @staticmethod
    def prepare(
        dataframe: pd.DataFrame,
        column: str,
        top_n: int = 10,
    ) -> pd.Series:
        """
        Prepare categorical data for visualization.

        Steps:
            1. Validate the requested column.
            2. Remove missing values.
            3. Count category frequencies.
            4. Return the top N categories.

        Args:
            dataframe: Source DataFrame.
            column: Categorical column.
            top_n: Maximum number of categories to return.

        Returns:
            pd.Series:
                Index -> category names
                Values -> category counts
        """

        ChartUtils.validate_columns(
            dataframe,
            column,
        )

        cleaned_df = ChartUtils.remove_missing(
            dataframe,
            [column],
        )

        return ChartUtils.top_n(
            cleaned_df,
            column,
            top_n,
        )