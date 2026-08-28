from __future__ import annotations

import math
from typing import Any

import numpy as np
import pandas as pd

from app.services.dataset_service import DatasetService


def _to_native(obj: Any) -> Any:
    """Recursively convert numpy / pandas types to native Python for JSON serialization."""
    # None / basic primitives — pass through
    if obj is None or isinstance(obj, (str, bool)):
        return obj
    # Handle float nan / inf — JSON doesn't support these
    if isinstance(obj, float):
        if math.isnan(obj) or math.isinf(obj):
            return None
        return obj
    # numpy integer scalars (np.int64, np.int32, etc.)
    if isinstance(obj, np.integer):
        return int(obj)
    # numpy float scalars
    if isinstance(obj, np.floating):
        val = float(obj)
        if math.isnan(val) or math.isinf(val):
            return None
        return val
    # numpy bool
    if isinstance(obj, np.bool_):
        return bool(obj)
    # numpy arrays
    if isinstance(obj, np.ndarray):
        return [_to_native(v) for v in obj.tolist()]
    # pandas Series — convert via tolist
    if isinstance(obj, pd.Series):
        return [_to_native(v) for v in obj.tolist()]
    # pandas DataFrame — convert to list of records
    if isinstance(obj, pd.DataFrame):
        return [_to_native(rec) for rec in obj.to_dict(orient="records")]
    # dicts
    if isinstance(obj, dict):
        return {str(k): _to_native(v) for k, v in obj.items()}
    # lists / tuples / sets
    if isinstance(obj, (list, tuple, set)):
        return [_to_native(v) for v in obj]
    # fallback: return as-is
    return obj


from app.services.dataset_service import DatasetService
from app.services.ml.evaluation_service import EvaluationService
from app.services.ml.ml_artifact_registry import (
    MLArtifactRegistry,
)
from app.services.ml.model_service import ModelService
from app.services.ml.prediction_service import PredictionService
from app.services.ml.preprocessing_service import (
    PreprocessingService,
)
from app.services.ml.training_service import TrainingService


class MLPipeline:
    """
    Enterprise Machine Learning Pipeline.

    This workflow orchestrates the complete machine learning
    lifecycle using the existing ML services.

    Responsibilities
    ----------------
    • Load dataset
    • Automatic preprocessing
    • Model creation
    • Model training
    • Model evaluation
    • Prediction
    • Artifact registration
    """

    def __init__(self) -> None:

        self._dataset_service = DatasetService()

        self.reset_report()

    # ---------------------------------------------------------
    # Report Helpers
    # ---------------------------------------------------------

    def reset_report(self) -> None:

        self._report: dict[str, Any] = {
            "success": True,
            "pipeline": "Machine Learning Pipeline",
            "steps": [],
            "warnings": [],
            "errors": [],
            "results": {},
            "summary": {},
        }

    def _step(
        self,
        name: str,
        status: str = "completed",
        details: Any | None = None,
    ) -> None:

        self._report["steps"].append(
            {
                "step": name,
                "status": status,
                "details": details,
            }
        )

    def _warning(
        self,
        message: str,
    ) -> None:

        self._report["warnings"].append(
            message
        )

    def _error(
        self,
        message: str,
    ) -> None:

        self._report["success"] = False

        self._report["errors"].append(
            message
        )

    # ---------------------------------------------------------
    # Dataset
    # ---------------------------------------------------------

    def _dataset(self) -> pd.DataFrame:

        dataframe = self._dataset_service.get_dataset()

        self._step(
            "Dataset Loaded",
            details={
                "rows": len(dataframe),
                "columns": len(dataframe.columns),
            },
        )

        return dataframe

    # ---------------------------------------------------------
    # Problem Detection
    # ---------------------------------------------------------

    def _problem_type(
        self,
        dataframe: pd.DataFrame,
        target: str,
    ) -> str:

        series = dataframe[target]

        if (
            series.dtype == "object"
            or str(series.dtype) == "category"
            or series.nunique() <= 20
        ):

            return "classification"

        return "regression"

    def _default_algorithm(
        self,
        problem_type: str,
    ) -> str:

        defaults = {

            "classification": "random_forest",

            "regression": "random_forest",

        }

        return defaults[problem_type]

    # ---------------------------------------------------------
    # Artifact Summary
    # ---------------------------------------------------------

    def _summary(self) -> None:

        self._report["summary"] = {

            "steps_completed": len(
                self._report["steps"]
            ),

            "warnings": len(
                self._report["warnings"]
            ),

            "errors": len(
                self._report["errors"]
            ),

            "trained": (
                TrainingService.is_trained()
            ),

            "artifacts": (
                MLArtifactRegistry.registry_info()
            ),
        }

    # ---------------------------------------------------------
    # Public Helpers
    # ---------------------------------------------------------

    def status(self) -> dict[str, Any]:

        return {

            "dataset_loaded": (
                self._dataset_service.has_dataset()
            ),

            "trained": (
                TrainingService.is_trained()
            ),

            "prediction": (
                PredictionService.service_status()
            ),

            "artifacts": (
                MLArtifactRegistry.registry_info()
            ),
        }

    def reset(self) -> dict[str, Any]:

        MLArtifactRegistry.clear()

        TrainingService.reset_training()

        self.reset_report()

        return {

            "success": True,

            "message": (
                "ML Pipeline reset successfully."
            ),
        }
        # ---------------------------------------------------------
    # Training Pipeline
    # ---------------------------------------------------------

    def train(
        self,
        target: str,
        algorithm: str | None = None,
        test_size: float = 0.2,
        random_state: int = 42,
    ) -> dict[str, Any]:
        """
        Execute the complete machine learning training pipeline.
        """

        self.reset_report()

        try:

            dataframe = self._dataset()

            problem_type = self._problem_type(
                dataframe,
                target,
            )

            if algorithm is None:
                algorithm = self._default_algorithm(
                    problem_type
                )

            self._step(
                "Problem Type Detection",
                details=problem_type,
            )

            preprocessing = (
                PreprocessingService.automatic_preprocessing(
                    dataframe=dataframe,
                    target=target,
                    test_size=test_size,
                    random_state=random_state,
                )
            )

            self._step(
                "Automatic Preprocessing"
            )

            split = preprocessing["split"]

            x_train = split["x_train"]
            x_test = split["x_test"]
            y_train = split["y_train"]
            y_test = split["y_test"]

            model = ModelService.create(
                algorithm
            )

            self._step(
                "Model Creation",
                details=model.__class__.__name__,
            )

            training = TrainingService.train(
                model=model,
                x_train=x_train,
                y_train=y_train,
            )

            self._step(
                "Model Training"
            )

            predictions = model.predict(
                x_test
            )

            probabilities = None

            if hasattr(
                model,
                "predict_proba",
            ):

                try:

                    probabilities = (
                        model.predict_proba(
                            x_test
                        )
                    )

                except Exception:
                    probabilities = None

            evaluation = EvaluationService.evaluate(
                problem_type=problem_type,
                y_true=y_test,
                y_pred=predictions,
                y_probability=probabilities,
                n_features=len(
                    x_train.columns
                ),
            )

            self._step(
                "Model Evaluation"
            )

            self._report["results"] = {

                "problem_type": problem_type,

                "algorithm": algorithm,

                "model": model.__class__.__name__,

                "preprocessing": preprocessing,

                "training": training,

                "evaluation": evaluation,

                "dataset": {

                    "train_rows": len(
                        x_train
                    ),

                    "test_rows": len(
                        x_test
                    ),

                    "feature_count": len(
                        x_train.columns
                    ),

                },

            }

            self._summary()

            return _to_native(self._report)

        except Exception as error:

            self._error(
                str(error)
            )

            self._summary()

            return _to_native(self._report)

    # ---------------------------------------------------------
    # Cross Validation
    # ---------------------------------------------------------

    def cross_validate(
        self,
        target: str,
        algorithm: str | None = None,
        cv: int = 5,
    ) -> dict[str, Any]:
        """
        Perform model cross validation.
        """

        self.reset_report()

        try:

            dataframe = self._dataset()

            problem_type = self._problem_type(
                dataframe,
                target,
            )

            if algorithm is None:

                algorithm = self._default_algorithm(
                    problem_type
                )

            preprocessing = (
                PreprocessingService.automatic_preprocessing(
                    dataframe=dataframe,
                    target=target,
                )
            )

            split = preprocessing["split"]

            model = ModelService.create(
                algorithm
            )

            result = (
                TrainingService.cross_validate(
                    model=model,
                    x_train=split["x_train"],
                    y_train=split["y_train"],
                    cv=cv,
                )
            )

            self._step(
                "Cross Validation"
            )

            self._report["results"] = {

                "problem_type": problem_type,

                "algorithm": algorithm,

                "cross_validation": result,

            }

            self._summary()

            return _to_native(self._report)

        except Exception as error:

            self._error(
                str(error)
            )

            self._summary()

            return _to_native(self._report)
        # ---------------------------------------------------------
    # Prediction Pipeline
    # ---------------------------------------------------------

    def predict(
        self,
        dataframe: pd.DataFrame,
    ) -> dict[str, Any]:
        """
        Execute prediction using the trained model.
        """

        try:

            result = PredictionService.predict_registered(
                dataframe
            )

            self._step(
                "Prediction"
            )

            return {
                "success": True,
                "result": result,
            }

        except Exception as error:

            self._error(
                str(error)
            )

            return self._report

    def predict_single(
        self,
        data: dict[str, Any],
    ) -> dict[str, Any]:
        """
        Predict a single record.
        """

        try:

            result = (
                PredictionService.predict_single_registered(
                    data
                )
            )

            self._step(
                "Single Prediction"
            )

            return {
                "success": True,
                "result": result,
            }

        except Exception as error:

            self._error(
                str(error)
            )

            return self._report

    def predict_probability(
        self,
        dataframe: pd.DataFrame,
    ) -> dict[str, Any]:
        """
        Predict class probabilities.
        """

        try:

            result = (
                PredictionService.predict_probability_registered(
                    dataframe
                )
            )

            self._step(
                "Probability Prediction"
            )

            return {
                "success": True,
                "result": result,
            }

        except Exception as error:

            self._error(
                str(error)
            )

            return self._report

    # ---------------------------------------------------------
    # Metadata
    # ---------------------------------------------------------

    def metadata(
        self,
    ) -> dict[str, Any]:
        """
        Return metadata of the trained model.
        """

        try:

            return {
                "success": True,
                "metadata": (
                    PredictionService.prediction_metadata()
                ),
            }

        except Exception as error:

            return {
                "success": False,
                "error": str(error),
            }

    # ---------------------------------------------------------
    # Pipeline Information
    # ---------------------------------------------------------

    def available_models(
        self,
    ) -> dict[str, Any]:

        return {
            "success": True,
            "models": (
                ModelService.available_models()
            ),
        }

    def training_summary(
        self,
    ) -> dict[str, Any]:

        return {
            "success": True,
            "summary": (
                TrainingService.training_summary()
            ),
        }

    def artifacts(
        self,
    ) -> dict[str, Any]:

        return {
            "success": True,
            "artifacts": (
                MLArtifactRegistry.registry_info()
            ),
        }

    # ---------------------------------------------------------
    # Execute
    # ---------------------------------------------------------

    def execute(
        self,
        *,
        target: str,
        algorithm: str | None = None,
        test_size: float = 0.2,
        random_state: int = 42,
    ) -> dict[str, Any]:
        """
        Execute the complete ML pipeline.

        This is the main entry point.
        """

        return self.train(
            target=target,
            algorithm=algorithm,
            test_size=test_size,
            random_state=random_state,
        )

    # ---------------------------------------------------------
    # Health Check
    # ---------------------------------------------------------

    def health(
        self,
    ) -> dict[str, Any]:
        """
        Return pipeline health information.
        """

        return {
            "pipeline": "Machine Learning Pipeline",
            "status": "healthy",
            "dataset_loaded": (
                self._dataset_service.has_dataset()
            ),
            "trained": (
                TrainingService.is_trained()
            ),
            "prediction": (
                PredictionService.service_status()
            ),
            "artifacts": (
                MLArtifactRegistry.registry_info()
            ),
        }