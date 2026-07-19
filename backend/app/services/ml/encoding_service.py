from __future__ import annotations

from typing import Any

import pandas as pd
from sklearn.preprocessing import (
    LabelEncoder,
    OneHotEncoder,
    OrdinalEncoder,
)

from app.services.ml.validation_service import ValidationService


class EncodingService:
    """
    Enterprise Feature Encoding Service.

    This service provides reusable encoding functionality
    for categorical features used in Machine Learning
    preprocessing.

    Supported Encoders
    ------------------
    - LabelEncoder
    - OneHotEncoder
    - OrdinalEncoder
    """

    _label_encoder: LabelEncoder | None = None
    _onehot_encoder: OneHotEncoder | None = None
    _ordinal_encoder: OrdinalEncoder | None = None

    _encoder_name: str | None = None
    _feature_columns: list[str] = []

    @classmethod
    def fit_transform(
        cls,
        dataframe: pd.DataFrame,
        columns: list[str],
        encoder: str = "label",
    ) -> dict[str, Any]:
        """
        Fit and transform categorical columns.

        Args:
            dataframe:
                Input dataframe.

            columns:
                Categorical columns.

            encoder:
                label | onehot | ordinal

        Returns
        -------
        Dictionary containing encoded dataframe.
        """

        ValidationService.validate_dataset(
            dataframe
        )

        ValidationService.validate_categorical_columns(
            dataframe,
            columns,
        )

        ValidationService.validate_encoder(
            encoder
        )

        df = dataframe.copy()

        cls._feature_columns = columns.copy()
        cls._encoder_name = encoder.lower()

        if encoder == "label":

            if len(columns) != 1:
                raise ValueError(
                    "LabelEncoder supports only one column."
                )

            cls._label_encoder = LabelEncoder()

            df[columns[0]] = (
                cls._label_encoder.fit_transform(
                    df[columns[0]].astype(str)
                )
            )

        elif encoder == "ordinal":

            cls._ordinal_encoder = OrdinalEncoder()

            df[columns] = (
                cls._ordinal_encoder.fit_transform(
                    df[columns]
                )
            )

        elif encoder == "onehot":

            cls._onehot_encoder = OneHotEncoder(
                sparse_output=False,
                handle_unknown="ignore",
            )

            encoded = cls._onehot_encoder.fit_transform(
                df[columns]
            )

            encoded_columns = (
                cls._onehot_encoder.get_feature_names_out(
                    columns
                )
            )

            encoded_df = pd.DataFrame(
                encoded,
                columns=encoded_columns,
                index=df.index,
            )

            df = pd.concat(
                [
                    df.drop(columns=columns),
                    encoded_df,
                ],
                axis=1,
            )

        return {
            "success": True,
            "encoder": encoder,
            "columns": columns,
            "dataframe": df,
            "message": "Encoding completed successfully.",
        }

    @classmethod
    def fit_encoder(
        cls,
        dataframe: pd.DataFrame,
        columns: list[str],
        encoder: str = "label",
    ) -> dict[str, Any]:
        """
        Fit an encoder without transforming.

        Useful for prediction pipelines.
        """

        ValidationService.validate_dataset(
            dataframe
        )

        ValidationService.validate_categorical_columns(
            dataframe,
            columns,
        )

        ValidationService.validate_encoder(
            encoder
        )

        cls._feature_columns = columns.copy()
        cls._encoder_name = encoder.lower()

        if encoder == "label":

            if len(columns) != 1:
                raise ValueError(
                    "LabelEncoder supports one column only."
                )

            cls._label_encoder = LabelEncoder()

            cls._label_encoder.fit(
                dataframe[
                    columns[0]
                ].astype(str)
            )

        elif encoder == "ordinal":

            cls._ordinal_encoder = OrdinalEncoder()

            cls._ordinal_encoder.fit(
                dataframe[
                    columns
                ]
            )

        elif encoder == "onehot":

            cls._onehot_encoder = OneHotEncoder(
                sparse_output=False,
                handle_unknown="ignore",
            )

            cls._onehot_encoder.fit(
                dataframe[
                    columns
                ]
            )

        return {
            "success": True,
            "encoder": encoder,
            "columns": columns,
            "message": "Encoder fitted successfully.",
        }
    @classmethod
    def transform(
        cls,
        dataframe: pd.DataFrame,
    ) -> dict[str, Any]:
        """
        Transform a dataframe using the fitted encoder.

        Args:
            dataframe: Input dataframe.

        Returns:
            Dictionary containing transformed dataframe.
        """

        ValidationService.validate_dataset(
            dataframe
        )

        if cls._encoder_name is None:
            raise ValueError(
                "No fitted encoder available."
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

        if cls._encoder_name == "label":

            df[
                cls._feature_columns[0]
            ] = cls._label_encoder.transform(
                df[
                    cls._feature_columns[0]
                ].astype(str)
            )

        elif cls._encoder_name == "ordinal":

            df[
                cls._feature_columns
            ] = cls._ordinal_encoder.transform(
                df[
                    cls._feature_columns
                ]
            )

        elif cls._encoder_name == "onehot":

            encoded = (
                cls._onehot_encoder.transform(
                    df[
                        cls._feature_columns
                    ]
                )
            )

            encoded_columns = (
                cls._onehot_encoder.get_feature_names_out(
                    cls._feature_columns
                )
            )

            encoded_df = pd.DataFrame(
                encoded,
                columns=encoded_columns,
                index=df.index,
            )

            df = pd.concat(
                [
                    df.drop(
                        columns=cls._feature_columns
                    ),
                    encoded_df,
                ],
                axis=1,
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
        Reverse an encoding transformation where supported.
        """

        ValidationService.validate_dataset(
            dataframe
        )

        if cls._encoder_name is None:
            raise ValueError(
                "No fitted encoder available."
            )

        df = dataframe.copy()

        if cls._encoder_name == "label":

            df[
                cls._feature_columns[0]
            ] = cls._label_encoder.inverse_transform(
                df[
                    cls._feature_columns[0]
                ]
            )

        elif cls._encoder_name == "ordinal":

            df[
                cls._feature_columns
            ] = cls._ordinal_encoder.inverse_transform(
                df[
                    cls._feature_columns
                ]
            )

        elif cls._encoder_name == "onehot":

            raise ValueError(
                "Inverse transform for OneHotEncoder "
                "is not supported in this service."
            )

        return {
            "success": True,
            "dataframe": df,
            "message": "Inverse transformation completed successfully.",
        }

    @classmethod
    def has_fitted_encoder(
        cls,
    ) -> bool:
        """
        Check whether an encoder has been fitted.
        """

        return cls._encoder_name is not None

    @classmethod
    def available_encoders(
        cls,
    ) -> list[str]:
        """
        Return all supported encoders.
        """

        return [
            "label",
            "onehot",
            "ordinal",
        ]

    @classmethod
    def get_encoder_info(
        cls,
    ) -> dict[str, Any]:
        """
        Return information about the fitted encoder.
        """

        return {
            "fitted": cls.has_fitted_encoder(),
            "encoder": cls._encoder_name,
            "feature_columns": cls._feature_columns.copy(),
            "feature_count": len(
                cls._feature_columns
            ),
        }

    @classmethod
    def reset_encoder(
        cls,
    ) -> None:
        """
        Remove all fitted encoder information.
        """

        cls._label_encoder = None
        cls._onehot_encoder = None
        cls._ordinal_encoder = None

        cls._encoder_name = None
        cls._feature_columns = []