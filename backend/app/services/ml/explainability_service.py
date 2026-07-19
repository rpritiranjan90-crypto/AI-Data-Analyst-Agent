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


class ExplainabilityService:
    """
    Enterprise Explainability Service.

    Provides model interpretation utilities including
    feature importance, coefficients, prediction
    explanations, and model metadata.

    Future Enhancements
    -------------------
    - SHAP
    - LIME
    - Partial Dependence Plots
    - Permutation Importance
    """

    @staticmethod
    def feature_importance(
        model: BaseEstimator,
        feature_names: list[str],
    ) -> dict[str, Any]:
        """
        Return feature importance for supported models.
        """

        if not hasattr(
            model,
            "feature_importances_",
        ):
            raise ValueError(
                "Model does not support feature importance."
            )

        importance = model.feature_importances_

        ranking = sorted(
            zip(
                feature_names,
                importance,
            ),
            key=lambda item: item[1],
            reverse=True,
        )

        return {
            "success": True,
            "feature_importance": [
                {
                    "feature": feature,
                    "importance": float(score),
                }
                for feature, score in ranking
            ],
        }

    @staticmethod
    def coefficients(
        model: BaseEstimator,
        feature_names: list[str],
    ) -> dict[str, Any]:
        """
        Return model coefficients for linear models.
        """

        if not hasattr(
            model,
            "coef_",
        ):
            raise ValueError(
                "Model does not expose coefficients."
            )

        coefficients = model.coef_

        if hasattr(
            coefficients,
            "flatten",
        ):
            coefficients = coefficients.flatten()

        ranking = sorted(
            zip(
                feature_names,
                coefficients,
            ),
            key=lambda item: abs(item[1]),
            reverse=True,
        )

        return {
            "success": True,
            "coefficients": [
                {
                    "feature": feature,
                    "coefficient": float(value),
                }
                for feature, value in ranking
            ],
        }

    @classmethod
    def registered_feature_importance(
        cls,
    ) -> dict[str, Any]:
        """
        Return feature importance using the registered model.
        """

        model = MLArtifactRegistry.get_model()

        if model is None:
            raise ValueError(
                "No trained model available."
            )

        feature_columns = (
            MLArtifactRegistry.get_feature_columns()
        )

        return cls.feature_importance(
            model,
            feature_columns,
        )
    @classmethod
    def registered_coefficients(
        cls,
    ) -> dict[str, Any]:
        """
        Return coefficients for the registered model.
        """

        model = MLArtifactRegistry.get_model()

        if model is None:
            raise ValueError(
                "No trained model available."
            )

        feature_columns = (
            MLArtifactRegistry.get_feature_columns()
        )

        return cls.coefficients(
            model,
            feature_columns,
        )

    @staticmethod
    def prediction_explanation(
        model: BaseEstimator,
        dataframe: pd.DataFrame,
    ) -> dict[str, Any]:
        """
        Generate predictions with a basic explanation.
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
            "rows": len(predictions),
            "model": model.__class__.__name__,
            "explanation": (
                "Predictions generated using the trained "
                "machine learning model."
            ),
        }

    @classmethod
    def registered_prediction_explanation(
        cls,
        dataframe: pd.DataFrame,
    ) -> dict[str, Any]:
        """
        Generate prediction explanations using the
        registered model.
        """

        model = MLArtifactRegistry.get_model()

        if model is None:
            raise ValueError(
                "No trained model available."
            )

        return cls.prediction_explanation(
            model,
            dataframe,
        )

    @staticmethod
    def model_summary(
        model: BaseEstimator,
    ) -> dict[str, Any]:
        """
        Return basic information about a model.
        """

        return {
            "model_name": model.__class__.__name__,
            "module": model.__class__.__module__,
            "parameters": model.get_params(),
        }

    @classmethod
    def registered_model_summary(
        cls,
    ) -> dict[str, Any]:
        """
        Return summary of the registered model.
        """

        model = MLArtifactRegistry.get_model()

        if model is None:
            raise ValueError(
                "No trained model available."
            )

        return cls.model_summary(
            model,
        )

    @classmethod
    def global_explanation(
        cls,
    ) -> dict[str, Any]:
        """
        Generate a global explanation for the
        registered model.
        """

        model = MLArtifactRegistry.get_model()

        if model is None:
            raise ValueError(
                "No trained model available."
            )

        summary = cls.model_summary(
            model
        )

        return {
            "model": summary,
            "explanation": (
                "Global explanation describing the "
                "overall behavior of the trained model."
            ),
        }

    @classmethod
    def local_explanation(
        cls,
        dataframe: pd.DataFrame,
    ) -> dict[str, Any]:
        """
        Generate a local explanation for supplied
        prediction samples.
        """

        explanation = (
            cls.registered_prediction_explanation(
                dataframe
            )
        )

        return {
            "prediction": explanation,
            "note": (
                "Detailed local explanations using SHAP "
                "or LIME can be integrated in future "
                "versions."
            ),
        }
    @classmethod
    def model_metadata(
        cls,
    ) -> dict[str, Any]:
        """
        Return metadata for the registered model.
        """

        model = MLArtifactRegistry.get_model()

        if model is None:
            raise ValueError(
                "No trained model available."
            )

        feature_columns = (
            MLArtifactRegistry.get_feature_columns()
        )

        target_column = (
            MLArtifactRegistry.get_target_column()
        )

        metadata = (
            MLArtifactRegistry.get_metadata()
        )

        return {
            "model_name": model.__class__.__name__,
            "feature_count": len(
                feature_columns
            )
            if feature_columns
            else 0,
            "feature_columns": feature_columns,
            "target_column": target_column,
            "dataset_metadata": metadata,
        }

    @staticmethod
    def available_explanations() -> list[str]:
        """
        Return all supported explainability methods.
        """

        return [
            "feature_importance",
            "coefficients",
            "prediction_explanation",
            "global_explanation",
            "local_explanation",
            "model_summary",
            "model_metadata",
        ]

    @classmethod
    def explainability_summary(
        cls,
    ) -> dict[str, Any]:
        """
        Return a summary of the explainability service.
        """

        return {
            "service": "ExplainabilityService",
            "supported_methods": (
                cls.available_explanations()
            ),
            "registered_model": (
                cls.registered_model_summary()
            ),
            "metadata": (
                cls.model_metadata()
            ),
        }

    @classmethod
    def service_status(
        cls,
    ) -> dict[str, Any]:
        """
        Return ExplainabilityService status.
        """

        model = MLArtifactRegistry.get_model()

        return {
            "service": "ExplainabilityService",
            "status": "ready",
            "model_loaded": model is not None,
            "model_name": (
                None
                if model is None
                else model.__class__.__name__
            ),
            "available_explanations": (
                cls.available_explanations()
            ),
        }