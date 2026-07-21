from __future__ import annotations

from typing import Any

import pandas as pd
from sklearn.base import BaseEstimator

from app.services.ml.encoding_service import EncodingService
from app.services.ml.ml_artifact_registry import (
    MLArtifactRegistry,
)
from app.services.ml.scaling_service import ScalingService
from app.services.ml.validation_service import (
    ValidationService,
)


class PredictionService:
    """
    Enterprise Prediction Service.

    Responsibilities
    ----------------
    - Prediction
    - Probability prediction
    - Batch prediction
    - Single prediction
    - Automatic preprocessing
    - Feature alignment
    """

    @staticmethod
    def _preprocess(
        dataframe: pd.DataFrame,
    ) -> pd.DataFrame:
        """
        Apply the same preprocessing pipeline
        used during model training.
        """

        ValidationService.validate_dataset(
            dataframe
        )

        df = dataframe.copy()

        # -----------------------------
        # Apply fitted encoder
        # -----------------------------

        if (
            EncodingService.has_fitted_encoder()
        ):

            df = EncodingService.transform(
                df
            )["dataframe"]

        # -----------------------------
        # Feature alignment
        # -----------------------------

        feature_columns = (
            MLArtifactRegistry.get_feature_columns()
        )

        if feature_columns is None:

            raise ValueError(
                "Training feature metadata not found."
            )

        for column in feature_columns:

            if column not in df.columns:

                df[column] = 0

        extra_columns = [

            column

            for column in df.columns

            if column not in feature_columns

        ]

        if extra_columns:

            df = df.drop(
                columns=extra_columns
            )

        df = df[
            feature_columns
        ]

        # -----------------------------
        # Apply fitted scaler
        # -----------------------------

        if (
            ScalingService.has_fitted_scaler()
        ):

            df = ScalingService.transform(
                df
            )["dataframe"]

        return df

    @staticmethod
    def predict(
        model: BaseEstimator,
        dataframe: pd.DataFrame,
    ) -> dict[str, Any]:
        """
        Predict using a trained model.
        """

        df = PredictionService._preprocess(
            dataframe
        )

        predictions = model.predict(
            df
        )

        return {
            "success": True,
            "predictions": predictions.tolist(),
            "prediction_rows": len(
                predictions
            ),
            "message": (
                "Prediction completed successfully."
            ),
        }
    @classmethod
    def predict_registered(
        cls,
        dataframe: pd.DataFrame,
    ) -> dict[str, Any]:
        """
        Predict using the model currently
        stored in the artifact registry.
        """

        model = MLArtifactRegistry.get_model()

        if model is None:

            raise ValueError(
                "No trained model available."
            )

        return cls.predict(
            model=model,
            dataframe=dataframe,
        )

    @staticmethod
    def predict_probability(
        model: BaseEstimator,
        dataframe: pd.DataFrame,
    ) -> dict[str, Any]:
        """
        Predict class probabilities.
        """

        df = PredictionService._preprocess(
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
            df
        )

        return {
            "success": True,
            "probabilities": probabilities.tolist(),
            "rows": len(
                probabilities
            ),
            "message": (
                "Probability prediction completed successfully."
            ),
        }

    @classmethod
    def predict_probability_registered(
        cls,
        dataframe: pd.DataFrame,
    ) -> dict[str, Any]:
        """
        Predict probabilities using the
        registered model.
        """

        model = MLArtifactRegistry.get_model()

        if model is None:

            raise ValueError(
                "No trained model available."
            )

        return cls.predict_probability(
            model=model,
            dataframe=dataframe,
        )

    @staticmethod
    def predict_single(
        model: BaseEstimator,
        data: dict[str, Any],
    ) -> dict[str, Any]:
        """
        Predict a single record.
        """

        dataframe = pd.DataFrame(
            [data]
        )

        result = PredictionService.predict(
            model=model,
            dataframe=dataframe,
        )

        return {
            "success": True,
            "prediction": result[
                "predictions"
            ][0],
            "message": (
                "Single prediction completed successfully."
            ),
        }

    @classmethod
    def predict_single_registered(
        cls,
        data: dict[str, Any],
    ) -> dict[str, Any]:
        """
        Predict a single record using
        the registered model.
        """

        model = MLArtifactRegistry.get_model()

        if model is None:

            raise ValueError(
                "No trained model available."
            )

        return cls.predict_single(
            model=model,
            data=data,
        )
    @classmethod
    def batch_prediction(
        cls,
        dataframe: pd.DataFrame,
    ) -> dict[str, Any]:
        """
        Generate batch predictions using
        the registered model.
        """

        return cls.predict_registered(
            dataframe
        )

    @classmethod
    def prediction_metadata(
        cls,
    ) -> dict[str, Any]:
        """
        Return metadata about the currently
        loaded prediction model.
        """

        model = MLArtifactRegistry.get_model()

        if model is None:

            raise ValueError(
                "No trained model available."
            )

        return {
            "model": model.__class__.__name__,
            "feature_columns": (
                MLArtifactRegistry.get_feature_columns()
            ),
            "feature_count": len(
                MLArtifactRegistry.get_feature_columns()
            ),
            "target_column": (
                MLArtifactRegistry.get_target_column()
            ),
            "registry": (
                MLArtifactRegistry.registry_info()
            ),
        }

    @classmethod
    def prediction_summary(
        cls,
        dataframe: pd.DataFrame,
    ) -> dict[str, Any]:
        """
        Generate prediction summary.
        """

        result = cls.predict_registered(
            dataframe
        )

        metadata = cls.prediction_metadata()

        return {
            "success": True,
            "rows": len(
                dataframe
            ),
            "prediction_rows": result[
                "prediction_rows"
            ],
            "predictions": result[
                "predictions"
            ],
            "metadata": metadata,
        }

    @staticmethod
    def validate_prediction_input(
        dataframe: pd.DataFrame,
    ) -> dict[str, Any]:
        """
        Validate prediction dataset.
        """

        ValidationService.validate_dataset(
            dataframe
        )

        expected = (
            MLArtifactRegistry.get_feature_columns()
        )

        return {
            "success": True,
            "rows": len(
                dataframe
            ),
            "columns": dataframe.columns.tolist(),
            "expected_columns": expected,
            "missing_columns": [
                column
                for column in expected
                if column not in dataframe.columns
            ],
            "extra_columns": [
                column
                for column in dataframe.columns
                if column not in expected
            ],
        }
    @staticmethod
    def available_prediction_methods() -> list[str]:
        """
        Return all supported prediction methods.
        """

        return [
            "predict",
            "predict_registered",
            "predict_probability",
            "predict_probability_registered",
            "predict_single",
            "predict_single_registered",
            "batch_prediction",
        ]

    @classmethod
    def prediction_status(
        cls,
    ) -> dict[str, Any]:
        """
        Return prediction service status.
        """

        model = MLArtifactRegistry.get_model()

        metadata = MLArtifactRegistry.get_metadata()

        feature_columns = (
            MLArtifactRegistry.get_feature_columns()
        )

        return {
            "service": "PredictionService",
            "status": (
                "ready"
                if model is not None
                else "no_model_loaded"
            ),
            "model_loaded": model is not None,
            "model": (
                None
                if model is None
                else model.__class__.__name__
            ),
            "encoder_fitted": (
                EncodingService.has_fitted_encoder()
            ),
            "scaler_fitted": (
                ScalingService.has_fitted_scaler()
            ),
            "feature_count": len(
                feature_columns
            )
            if feature_columns
            else 0,
            "target_column": (
                MLArtifactRegistry.get_target_column()
            ),
            "metadata_available": (
                metadata is not None
            ),
        }

    @classmethod
    def service_status(
        cls,
    ) -> dict[str, Any]:
        """
        Alias for prediction_status().
        """

        return cls.prediction_status()