from __future__ import annotations

import numpy as np
import pandas as pd


class MatrixBuilder:
    """
    Shared data preparation for matrix-based visualizations.

    Supported charts:
        - Heatmap
        - Correlation Matrix
        - Covariance Matrix
        - Cluster Heatmap (Future)

    Responsibilities:
        • Select numeric columns
        • Remove invalid values
        • Generate correlation matrix
        • Generate covariance matrix
        • Generate missing-value matrix
    """

    def __new__(cls):
        raise TypeError(
            f"{cls.__name__} is a utility class and cannot be instantiated."
        )

    @staticmethod
    def numeric_dataframe(
        dataframe: pd.DataFrame,
    ) -> pd.DataFrame:
        """
        Return a cleaned numeric DataFrame.
        """

        numeric_df = dataframe.select_dtypes(
            include=np.number,
        ).copy()

        if numeric_df.empty:
            raise ValueError(
                "No numeric columns found."
            )

        numeric_df = (
            numeric_df
            .replace([np.inf, -np.inf], np.nan)
            .dropna()
        )

        return numeric_df

    @classmethod
    def correlation_matrix(
        cls,
        dataframe: pd.DataFrame,
    ) -> pd.DataFrame:
        """
        Generate a Pearson correlation matrix.
        """

        return cls.numeric_dataframe(
            dataframe
        ).corr(
            method="pearson"
        )

    @classmethod
    def covariance_matrix(
        cls,
        dataframe: pd.DataFrame,
    ) -> pd.DataFrame:
        """
        Generate a covariance matrix.
        """

        return cls.numeric_dataframe(
            dataframe
        ).cov()

    @staticmethod
    def missing_values_matrix(
        dataframe: pd.DataFrame,
    ) -> pd.DataFrame:
        """
        Return a missing-value indicator matrix.
        """

        return dataframe.isna().astype(int)

    @classmethod
    def summary(
        cls,
        dataframe: pd.DataFrame,
    ) -> dict:
        """
        Return summary information for matrix-based charts.
        """

        numeric_df = cls.numeric_dataframe(
            dataframe
        )

        return {
            "rows": int(numeric_df.shape[0]),
            "columns": int(numeric_df.shape[1]),
            "column_names": list(numeric_df.columns),
            "missing_values": int(
                numeric_df.isna().sum().sum()
            ),
        }