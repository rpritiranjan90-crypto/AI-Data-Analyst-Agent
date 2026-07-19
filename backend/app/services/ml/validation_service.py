from __future__ import annotations

from typing import Any

import pandas as pd


class ValidationService:
    """
    Enterprise Machine Learning Validation Service.

    This service provides reusable validation methods used across
    the Machine Learning module. It validates datasets, feature
    columns, target columns, preprocessing parameters, ML algorithms,
    and prediction inputs.

    All ML services should rely on this service instead of implementing
    duplicate validation logic.
    """

    SUPPORTED_SCALERS = {
        "standard",
        "minmax",
        "robust",
        "maxabs",
        "normalizer",
    }

    SUPPORTED_ENCODERS = {
        "label",
        "onehot",
        "ordinal",
    }

    SUPPORTED_REGRESSION_MODELS = {
        "linear_regression",
        "ridge",
        "lasso",
        "elasticnet",
        "decision_tree_regressor",
        "random_forest_regressor",
    }

    SUPPORTED_CLASSIFICATION_MODELS = {
        "logistic_regression",
        "decision_tree_classifier",
        "random_forest_classifier",
        "knn",
        "naive_bayes",
        "svm",
    }

    SUPPORTED_CLUSTERING_MODELS = {
        "kmeans",
        "dbscan",
        "agglomerative",
    }

    @staticmethod
    def validate_dataset(
        dataframe: pd.DataFrame,
    ) -> None:
        """
        Validate that a dataframe exists and is not empty.

        Args:
            dataframe: Input dataframe.

        Raises:
            ValueError: If dataframe is invalid.
        """

        if dataframe is None:
            raise ValueError(
                "Dataset not found."
            )

        if dataframe.empty:
            raise ValueError(
                "Dataset is empty."
            )

    @staticmethod
    def validate_target(
        dataframe: pd.DataFrame,
        target: str,
    ) -> None:
        """
        Validate target column.

        Args:
            dataframe: Input dataframe.
            target: Target column.

        Raises:
            ValueError
        """

        ValidationService.validate_dataset(
            dataframe
        )

        if not target:
            raise ValueError(
                "Target column is required."
            )

        if target not in dataframe.columns:
            raise ValueError(
                f"Target column '{target}' not found."
            )

    @staticmethod
    def validate_features(
        dataframe: pd.DataFrame,
        features: list[str],
    ) -> None:
        """
        Validate feature columns.

        Args:
            dataframe: Input dataframe.
            features: Feature column names.

        Raises:
            ValueError
        """

        ValidationService.validate_dataset(
            dataframe
        )

        if not features:
            raise ValueError(
                "At least one feature column is required."
            )

        missing = [
            column
            for column in features
            if column not in dataframe.columns
        ]

        if missing:
            raise ValueError(
                f"Feature columns not found: {missing}"
            )

    @staticmethod
    def validate_numeric_columns(
        dataframe: pd.DataFrame,
        columns: list[str],
    ) -> None:
        """
        Ensure all columns are numeric.
        """

        ValidationService.validate_features(
            dataframe,
            columns,
        )

        invalid = [
            column
            for column in columns
            if not pd.api.types.is_numeric_dtype(
                dataframe[column]
            )
        ]

        if invalid:
            raise ValueError(
                f"Numeric columns required: {invalid}"
            )

    @staticmethod
    def validate_categorical_columns(
        dataframe: pd.DataFrame,
        columns: list[str],
    ) -> None:
        """
        Ensure columns are categorical.
        """

        ValidationService.validate_features(
            dataframe,
            columns,
        )

        invalid = [
            column
            for column in columns
            if pd.api.types.is_numeric_dtype(
                dataframe[column]
            )
        ]

        if invalid:
            raise ValueError(
                f"Categorical columns required: {invalid}"
            )
    @staticmethod
    def detect_problem_type(
        dataframe: pd.DataFrame,
        target: str,
    ) -> dict[str, Any]:
        """
        Automatically detect the machine learning problem type.

        Rules:
        - Numeric target with many unique values -> Regression
        - Binary target -> Binary Classification
        - Small categorical target -> Multi-class Classification
        """

        ValidationService.validate_target(
            dataframe,
            target,
        )

        target_series = dataframe[target]

        unique_count = target_series.nunique(dropna=True)

        if pd.api.types.is_numeric_dtype(target_series):

            if unique_count <= 10:
                return {
                    "problem_type": "classification",
                    "classification_type": (
                        "binary"
                        if unique_count == 2
                        else "multiclass"
                    ),
                    "classes": unique_count,
                }

            return {
                "problem_type": "regression",
                "classes": unique_count,
            }

        return {
            "problem_type": "classification",
            "classification_type": (
                "binary"
                if unique_count == 2
                else "multiclass"
            ),
            "classes": unique_count,
        }

    @staticmethod
    def validate_test_size(
        test_size: float,
    ) -> None:
        """
        Validate train-test split ratio.
        """

        if not isinstance(test_size, float):
            raise ValueError(
                "Test size must be a float."
            )

        if not 0 < test_size < 1:
            raise ValueError(
                "Test size must be between 0 and 1."
            )

    @staticmethod
    def validate_random_state(
        random_state: int | None,
    ) -> None:
        """
        Validate random state.
        """

        if random_state is None:
            return

        if not isinstance(random_state, int):
            raise ValueError(
                "Random state must be an integer."
            )

    @staticmethod
    def validate_scaler(
        scaler: str,
    ) -> None:
        """
        Validate scaler name.
        """

        scaler = scaler.lower()

        if scaler not in ValidationService.SUPPORTED_SCALERS:
            raise ValueError(
                f"Unsupported scaler '{scaler}'. "
                f"Supported scalers: "
                f"{', '.join(sorted(ValidationService.SUPPORTED_SCALERS))}"
            )

    @staticmethod
    def validate_encoder(
        encoder: str,
    ) -> None:
        """
        Validate encoder name.
        """

        encoder = encoder.lower()

        if encoder not in ValidationService.SUPPORTED_ENCODERS:
            raise ValueError(
                f"Unsupported encoder '{encoder}'. "
                f"Supported encoders: "
                f"{', '.join(sorted(ValidationService.SUPPORTED_ENCODERS))}"
            )

    @staticmethod
    def validate_algorithm(
        algorithm: str,
    ) -> str:
        """
        Validate supported ML algorithm.

        Returns:
            Algorithm category.
        """

        algorithm = algorithm.lower()

        if algorithm in ValidationService.SUPPORTED_REGRESSION_MODELS:
            return "regression"

        if algorithm in ValidationService.SUPPORTED_CLASSIFICATION_MODELS:
            return "classification"

        if algorithm in ValidationService.SUPPORTED_CLUSTERING_MODELS:
            return "clustering"

        raise ValueError(
            f"Unsupported algorithm '{algorithm}'."
        )

    @staticmethod
    def validate_prediction_dataframe(
        dataframe: pd.DataFrame,
        required_columns: list[str],
    ) -> None:
        """
        Validate prediction dataframe.
        """

        ValidationService.validate_dataset(
            dataframe
        )

        missing = [
            column
            for column in required_columns
            if column not in dataframe.columns
        ]

        if missing:
            raise ValueError(
                f"Prediction data is missing columns: {missing}"
            )

    @staticmethod
    def validation_summary(
        dataframe: pd.DataFrame,
    ) -> dict[str, Any]:
        """
        Generate dataset validation summary.
        """

        ValidationService.validate_dataset(
            dataframe
        )

        numeric_columns = dataframe.select_dtypes(
            include="number"
        ).columns.tolist()

        categorical_columns = dataframe.select_dtypes(
            exclude="number"
        ).columns.tolist()

        return {
            "rows": len(dataframe),
            "columns": len(dataframe.columns),
            "numeric_columns": numeric_columns,
            "categorical_columns": categorical_columns,
            "missing_values": int(
                dataframe.isna().sum().sum()
            ),
            "duplicate_rows": int(
                dataframe.duplicated().sum()
            ),
        }