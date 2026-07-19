from __future__ import annotations

import time
from typing import Any

import pandas as pd
from sklearn.base import BaseEstimator
from sklearn.model_selection import cross_val_score

from app.services.ml.ml_artifact_registry import (
    MLArtifactRegistry,
)
from app.services.ml.validation_service import (
    ValidationService,
)


class TrainingService:
    """
    Enterprise Machine Learning Training Service.

    Responsible for fitting machine learning models,
    recording training metadata, and storing trained
    artifacts for later prediction.
    """

    _training_summary: dict[str, Any] = {}

    @classmethod
    def train(
        cls,
        model: BaseEstimator,
        x_train: pd.DataFrame,
        y_train: pd.Series,
    ) -> dict[str, Any]:
        """
        Train a machine learning model.

        Args:
            model:
                Model instance.

            x_train:
                Training features.

            y_train:
                Training labels.

        Returns:
            Training summary.
        """

        ValidationService.validate_dataset(
            x_train
        )

        start = time.perf_counter()

        model.fit(
            x_train,
            y_train,
        )

        elapsed = round(
            time.perf_counter() - start,
            4,
        )

        MLArtifactRegistry.set_model(
            model
        )

        MLArtifactRegistry.set_feature_columns(
            list(x_train.columns)
        )

        cls._training_summary = {
            "model": model.__class__.__name__,
            "training_rows": len(
                x_train
            ),
            "features": len(
                x_train.columns
            ),
            "training_time_seconds": elapsed,
        }

        return {
            "success": True,
            "model": model.__class__.__name__,
            "training_time": elapsed,
            "training_rows": len(
                x_train
            ),
            "message": "Model trained successfully.",
        }

    @classmethod
    def fit(
        cls,
        model: BaseEstimator,
        x_train: pd.DataFrame,
        y_train: pd.Series,
    ) -> BaseEstimator:
        """
        Fit and return a model.
        """

        cls.train(
            model,
            x_train,
            y_train,
        )

        return model

    @classmethod
    def cross_validate(
        cls,
        model: BaseEstimator,
        x_train: pd.DataFrame,
        y_train: pd.Series,
        cv: int = 5,
        scoring: str | None = None,
    ) -> dict[str, Any]:
        """
        Perform cross-validation.

        Args:
            model:
                Model instance.

            cv:
                Number of folds.

            scoring:
                Sklearn scoring metric.
        """

        ValidationService.validate_dataset(
            x_train
        )

        scores = cross_val_score(
            model,
            x_train,
            y_train,
            cv=cv,
            scoring=scoring,
        )

        return {
            "success": True,
            "cv": cv,
            "scores": scores.tolist(),
            "mean_score": float(
                scores.mean()
            ),
            "std_score": float(
                scores.std()
            ),
        }
    @classmethod
    def fit_predict(
        cls,
        model: BaseEstimator,
        x_train: pd.DataFrame,
        y_train: pd.Series,
        x_test: pd.DataFrame,
    ) -> dict[str, Any]:
        """
        Train a model and generate predictions.

        Args:
            model: Machine learning model.
            x_train: Training features.
            y_train: Training target.
            x_test: Test features.

        Returns:
            Training result with predictions.
        """

        cls.train(
            model,
            x_train,
            y_train,
        )

        predictions = model.predict(
            x_test
        )

        return {
            "success": True,
            "model": model.__class__.__name__,
            "predictions": predictions.tolist(),
            "prediction_rows": len(
                predictions
            ),
            "message": (
                "Training and prediction completed successfully."
            ),
        }

    @classmethod
    def get_trained_model(
        cls,
    ) -> BaseEstimator:
        """
        Retrieve the trained model from the artifact registry.

        Returns:
            Trained model.

        Raises:
            ValueError:
                If no model has been trained.
        """

        model = MLArtifactRegistry.get_model()

        if model is None:
            raise ValueError(
                "No trained model available."
            )

        return model

    @classmethod
    def training_summary(
        cls,
    ) -> dict[str, Any]:
        """
        Return the latest training summary.
        """

        return cls._training_summary.copy()

    @classmethod
    def is_trained(
        cls,
    ) -> bool:
        """
        Check whether a model has been trained.
        """

        return MLArtifactRegistry.has_artifact(
            "model"
        )

    @classmethod
    def reset_training(
        cls,
    ) -> dict[str, Any]:
        """
        Reset the training state.

        Removes the trained model and clears
        the stored training summary.
        """

        MLArtifactRegistry.remove_artifact(
            "model"
        )

        cls._training_summary = {}

        return {
            "success": True,
            "message": (
                "Training state reset successfully."
            ),
        }

    @classmethod
    def training_status(
        cls,
    ) -> dict[str, Any]:
        """
        Return the current training status.
        """

        return {
            "trained": cls.is_trained(),
            "summary": cls.training_summary(),
            "registry": MLArtifactRegistry.registry_info(),
        }