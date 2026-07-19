from __future__ import annotations

from typing import Any

import pandas as pd
from sklearn.preprocessing import (
    MaxAbsScaler,
    MinMaxScaler,
    Normalizer,
    RobustScaler,
    StandardScaler,
)

from app.services.ml.validation_service import ValidationService


class ScalingService:
    """
    Enterprise Feature Scaling Service.

    This service provides feature scaling utilities for
    machine learning preprocessing.

    Supported Scalers:
    - StandardScaler
    - MinMaxScaler
    - RobustScaler
    - MaxAbsScaler
    - Normalizer
    """

    _scalers: dict[str, Any] = {
        "standard": StandardScaler,
        "minmax": MinMaxScaler,
        "robust": RobustScaler,
        "maxabs": MaxAbsScaler,
        "normalizer": Normalizer,
    }

    _fitted_scaler: Any | None = None
    _feature_columns: list[str] = []

    @classmethod
    def fit_transform(
        cls,
        dataframe: pd.DataFrame,
        columns: list[str],
        scaler: str = "standard",
    ) -> dict[str, Any]:
        """
        Fit and transform selected columns.

        Args:
            dataframe: Input dataframe.
            columns: Numeric feature columns.
            scaler: Scaling method.

        Returns:
            Dictionary containing scaled dataframe.
        """

        ValidationService.validate_dataset(
            dataframe
        )

        ValidationService.validate_numeric_columns(
            dataframe,
            columns,
        )

        ValidationService.validate_scaler(
            scaler
        )

        df = dataframe.copy()

        scaler_instance = cls._scalers[
            scaler
        ]()

        df[columns] = scaler_instance.fit_transform(
            df[columns]
        )

        cls._fitted_scaler = scaler_instance
        cls._feature_columns = columns.copy()

        return {
            "success": True,
            "scaler": scaler,
            "scaled_columns": columns,
            "dataframe": df,
            "message": "Scaling completed successfully.",
        }

    @classmethod
    def transform(
        cls,
        dataframe: pd.DataFrame,
    ) -> dict[str, Any]:
        """
        Transform a dataframe using the fitted scaler.

        Used during prediction.
        """

        ValidationService.validate_dataset(
            dataframe
        )

        if cls._fitted_scaler is None:
            raise ValueError(
                "No fitted scaler available."
            )

        missing = [
            column
            for column in cls._feature_columns
            if column not in dataframe.columns
        ]

        if missing:
            raise ValueError(
                f"Missing feature columns: {missing}"
            )

        df = dataframe.copy()

        df[
            cls._feature_columns
        ] = cls._fitted_scaler.transform(
            df[
                cls._feature_columns
            ]
        )

        return {
            "success": True,
            "dataframe": df,
            "message": "Transformation completed successfully.",
        }
    @classmethod
    def inverse_transform(
        cls,
        dataframe: pd.DataFrame,
    ) -> dict[str, Any]:
        """
        Restore scaled values to their original scale.

        Args:
            dataframe: Scaled dataframe.

        Returns:
            Dictionary containing restored dataframe.
        """

        ValidationService.validate_dataset(
            dataframe
        )

        if cls._fitted_scaler is None:
            raise ValueError(
                "No fitted scaler available."
            )

        missing = [
            column
            for column in cls._feature_columns
            if column not in dataframe.columns
        ]

        if missing:
            raise ValueError(
                f"Missing feature columns: {missing}"
            )

        df = dataframe.copy()

        df[
            cls._feature_columns
        ] = cls._fitted_scaler.inverse_transform(
            df[
                cls._feature_columns
            ]
        )

        return {
            "success": True,
            "dataframe": df,
            "message": "Inverse transformation completed successfully.",
        }

    @classmethod
    def has_fitted_scaler(
        cls,
    ) -> bool:
        """
        Check whether a scaler has been fitted.

        Returns:
            True if a fitted scaler exists.
        """

        return cls._fitted_scaler is not None

    @classmethod
    def get_scaler_info(
        cls,
    ) -> dict[str, Any]:
        """
        Return metadata about the fitted scaler.

        Returns:
            Dictionary containing scaler information.
        """

        if cls._fitted_scaler is None:
            return {
                "fitted": False,
                "scaler": None,
                "feature_columns": [],
            }

        return {
            "fitted": True,
            "scaler": cls._fitted_scaler.__class__.__name__,
            "feature_columns": cls._feature_columns.copy(),
            "feature_count": len(
                cls._feature_columns
            ),
        }

    @classmethod
    def available_scalers(
        cls,
    ) -> list[str]:
        """
        Return the list of supported scalers.
        """

        return sorted(
            cls._scalers.keys()
        )

    @classmethod
    def reset_scaler(
        cls,
    ) -> None:
        """
        Clear the fitted scaler from memory.
        """

        cls._fitted_scaler = None
        cls._feature_columns = []

    @classmethod
    def fit_scaler(
        cls,
        dataframe: pd.DataFrame,
        columns: list[str],
        scaler: str = "standard",
    ) -> dict[str, Any]:
        """
        Fit a scaler without transforming the dataset.

        Useful when the transformation will be applied later.
        """

        ValidationService.validate_dataset(
            dataframe
        )

        ValidationService.validate_numeric_columns(
            dataframe,
            columns,
        )

        ValidationService.validate_scaler(
            scaler
        )

        scaler_instance = cls._scalers[
            scaler
        ]()

        scaler_instance.fit(
            dataframe[columns]
        )

        cls._fitted_scaler = scaler_instance
        cls._feature_columns = columns.copy()

        return {
            "success": True,
            "scaler": scaler,
            "feature_columns": columns,
            "message": "Scaler fitted successfully.",
        }