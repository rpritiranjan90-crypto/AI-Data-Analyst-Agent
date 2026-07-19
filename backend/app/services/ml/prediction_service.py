from __future__ import annotations

from typing import Any

import pandas as pd
from sklearn.base import BaseEstimator

from app.services.ml.ml_artifact_registry import (
    MLArtifactRegistry,
)
from app.services.ml.validation_service import (
    ValidationService,
)


class PredictionService:
    """
    Enterprise Machine Learning Prediction Service.

    Responsible for generating predictions using trained
    machine learning models stored in the artifact registry.
    """

    @staticmethod
    def predict(
        model: BaseEstimator,
        dataframe: pd.DataFrame,
    ) -> dict[str, Any]:
        """
        Generate predictions.

        Args:
            model:
                Trained model.

            dataframe:
                Prediction dataset.

        Returns:
            Prediction results.
        """

        ValidationService.validate_dataset(
            dataframe
        )

        predictions = model.predict(
            dataframe
        )

        return {
            "success": True,
            "predictions": predictions.tolist(),
            "prediction_rows": len(
                predictions
            ),
            "message": "Prediction completed successfully.",
        }

    @classmethod
    def predict_registered(
        cls,
        dataframe: pd.DataFrame,
    ) -> dict[str, Any]:
        """
        Predict using the model stored in the registry.
        """

        model = MLArtifactRegistry.get_model()

        if model is None:
            raise ValueError(
                "No trained model available."
            )

        return cls.predict(
            model,
            dataframe,
        )

    @staticmethod
    def predict_probability(
        model: BaseEstimator,
        dataframe: pd.DataFrame,
    ) -> dict[str, Any]:
        """
        Predict class probabilities.

        Supported only for classifiers implementing
        predict_proba().
        """

        ValidationService.validate_dataset(
            dataframe
        )

        if not hasattr(
            model,
            "predict_proba",
        ):
            raise ValueError(
                "Model does not support probability prediction."
            )

        probabilities = model.predict_proba(
            dataframe
        )

        return {
            "success": True,
            "probabilities": probabilities.tolist(),
            "rows": len(probabilities),
            "message": "Probability prediction completed successfully.",
        }
    @staticmethod
    def predict_single(
        model: BaseEstimator,
        data: dict[str, Any],
    ) -> dict[str, Any]:
        """
        Predict a single record.

        Args:
            model: Trained model.
            data: Dictionary representing one sample.

        Returns:
            Prediction result.
        """

        dataframe = pd.DataFrame([data])

        result = PredictionService.predict(
            model,
            dataframe,
        )

        return {
            "success": True,
            "prediction": result["predictions"][0],
            "message": "Single prediction completed successfully.",
        }

    @classmethod
    def batch_prediction(
        cls,
        dataframe: pd.DataFrame,
    ) -> dict[str, Any]:
        """
        Generate predictions using the registered model.

        Args:
            dataframe: Dataset for prediction.

        Returns:
            Batch prediction results.
        """

        return cls.predict_registered(
            dataframe
        )

    @classmethod
    def prediction_metadata(
        cls,
    ) -> dict[str, Any]:
        """
        Return metadata about the currently loaded model.

        Returns:
            Prediction metadata.
        """

        model = MLArtifactRegistry.get_model()

        if model is None:
            raise ValueError(
                "No trained model available."
            )

        feature_columns = (
            MLArtifactRegistry.get_feature_columns()
        )

        target = (
            MLArtifactRegistry.get_target_column()
        )

        return {
            "model": model.__class__.__name__,
            "feature_columns": feature_columns,
            "feature_count": len(
                feature_columns
            ),
            "target_column": target,
        }

    @classmethod
    def prediction_summary(
        cls,
        dataframe: pd.DataFrame,
    ) -> dict[str, Any]:
        """
        Generate prediction summary.

        Args:
            dataframe: Input prediction dataset.

        Returns:
            Prediction summary.
        """

        predictions = cls.predict_registered(
            dataframe
        )

        return {
            "rows": len(dataframe),
            "prediction_rows": predictions[
                "prediction_rows"
            ],
            "metadata": cls.prediction_metadata(),
        }

    @staticmethod
    def available_prediction_methods() -> list[str]:
        """
        Return supported prediction methods.
        """

        return [
            "predict",
            "predict_registered",
            "predict_probability",
            "predict_single",
            "batch_prediction",
        ]

    @classmethod
    def prediction_status(
        cls,
    ) -> dict[str, Any]:
        """
        Return the prediction service status.

        Returns:
            Service status.
        """

        model = MLArtifactRegistry.get_model()

        return {
            "ready": model is not None,
            "model": (
                None
                if model is None
                else model.__class__.__name__
            ),
            "registry": MLArtifactRegistry.registry_info(),
        }