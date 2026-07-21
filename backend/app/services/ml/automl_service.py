from __future__ import annotations

from typing import Any

import pandas as pd

from app.services.ml.evaluation_service import EvaluationService
from app.services.ml.ml_artifact_registry import MLArtifactRegistry
from app.services.ml.model_service import ModelService
from app.services.ml.preprocessing_service import (
    PreprocessingService,
)
from app.services.ml.training_service import TrainingService
from app.services.ml.validation_service import (
    ValidationService,
)


class AutoMLService:
    """
    Enterprise AutoML Engine.

    Pipeline
    --------
    Validate
        ↓
    Preprocess
        ↓
    Train Multiple Models
        ↓
    Cross Validation
        ↓
    Evaluation
        ↓
    Leaderboard
        ↓
    Best Model
        ↓
    Register Artifact
    """

    DEFAULT_CLASSIFICATION_MODELS = [
        "logistic_regression",
        "decision_tree",
        "random_forest",
        "gradient_boosting",
        "extra_trees",
        "adaboost",
        "knn",
        "naive_bayes",
        "svm",
    ]

    DEFAULT_REGRESSION_MODELS = [
        "linear_regression",
        "ridge",
        "lasso",
        "elasticnet",
        "decision_tree",
        "random_forest",
        "gradient_boosting",
        "extra_trees",
        "adaboost",
    ]

    @staticmethod
    def detect_problem_type(
        dataframe: pd.DataFrame,
        target: str,
    ) -> str:
        """
        Detect the machine learning problem type.
        """

        result = ValidationService.detect_problem_type(
            dataframe,
            target,
        )

        return result["problem_type"]

    @classmethod
    def available_models(
        cls,
        problem_type: str,
    ) -> list[str]:
        """
        Return supported models for the problem type.
        """

        available = ModelService.available_models()

        if problem_type == "classification":
            preferred = cls.DEFAULT_CLASSIFICATION_MODELS

        elif problem_type == "regression":
            preferred = cls.DEFAULT_REGRESSION_MODELS

        else:
            return []

        return [
            model
            for model in preferred
            if model in available.get(problem_type, [])
        ]

    @classmethod
    def _prepare_dataset(
        cls,
        dataframe: pd.DataFrame,
        target: str,
    ):
        """
        Validate and preprocess the dataset.
        """

        ValidationService.validate_dataset(
            dataframe,
        )

        ValidationService.validate_target(
            dataframe,
            target,
        )

        preprocessing = (
            PreprocessingService
            .automatic_preprocessing(
                dataframe,
                target,
            )
        )

        split = preprocessing["split"]

        return (
            split["x_train"],
            split["x_test"],
            split["y_train"],
            split["y_test"],
        )

    @staticmethod
    def _score(
        problem_type: str,
        metrics: dict[str, Any],
    ) -> float:
        """
        Select the primary score used for ranking.
        """

        if problem_type == "classification":
            return float(metrics["accuracy"])

        return float(metrics["r2_score"])
    @classmethod
    def compare_models(
        cls,
        dataframe: pd.DataFrame,
        target: str,
    ) -> dict[str, Any]:
        """
        Train, evaluate and compare multiple machine
        learning models.
        """

        (
            x_train,
            x_test,
            y_train,
            y_test,
        ) = cls._prepare_dataset(
            dataframe,
            target,
        )

        problem_type = cls.detect_problem_type(
            dataframe,
            target,
        )

        algorithms = cls.available_models(
            problem_type,
        )

        leaderboard: list[dict[str, Any]] = []

        best_model = None
        best_algorithm = None
        best_metrics: dict[str, Any] = {}
        best_score = float("-inf")

        for algorithm in algorithms:

            try:

                model = ModelService.create(
                    algorithm,
                )

                TrainingService.train(
                    model=model,
                    x_train=x_train,
                    y_train=y_train,
                )

                predictions = model.predict(
                    x_test,
                )

                evaluation = EvaluationService.evaluate(
                    problem_type=problem_type,
                    y_true=y_test,
                    y_pred=predictions,
                    n_features=len(
                        x_train.columns
                    ),
                )

                metrics = evaluation["metrics"]

                score = cls._score(
                    problem_type,
                    metrics,
                )

                try:

                    cross_validation = (
                        TrainingService.cross_validate(
                            model=model,
                            x_train=x_train,
                            y_train=y_train,
                            cv=5,
                        )
                    )

                except Exception as error:

                    cross_validation = {
                        "success": False,
                        "error": str(error),
                    }

                leaderboard.append(
                    {
                        "algorithm": algorithm,
                        "model": model.__class__.__name__,
                        "score": score,
                        "metrics": metrics,
                        "cross_validation": cross_validation,
                        "status": "success",
                    }
                )

                if score > best_score:

                    best_score = score
                    best_model = model
                    best_algorithm = algorithm
                    best_metrics = metrics

            except Exception as error:

                leaderboard.append(
                    {
                        "algorithm": algorithm,
                        "status": "failed",
                        "score": None,
                        "error": str(error),
                    }
                )

        leaderboard.sort(
            key=lambda item: (
                item["score"]
                if item["score"] is not None
                else float("-inf")
            ),
            reverse=True,
        )
        if best_model is not None:

            MLArtifactRegistry.set_model(
                best_model
            )

            MLArtifactRegistry.set_feature_columns(
                list(
                    x_train.columns
                )
            )

            MLArtifactRegistry.set_target_column(
                target
            )

            if hasattr(
                MLArtifactRegistry,
                "set_metadata",
            ):

                MLArtifactRegistry.set_metadata(
                    {
                        "algorithm": best_algorithm,
                        "problem_type": problem_type,
                        "metrics": best_metrics,
                        "target": target,
                        "feature_count": len(
                            x_train.columns
                        ),
                        "training_rows": len(
                            x_train
                        ),
                    }
                )

        return {
            "success": True,
            "problem_type": problem_type,
            "best_model": (
                None
                if best_model is None
                else best_model.__class__.__name__
            ),
            "best_algorithm": best_algorithm,
            "best_score": best_score,
            "models_tested": len(
                algorithms
            ),
            "leaderboard": leaderboard,
            "message": (
                "AutoML completed successfully."
            ),
        }

    @classmethod
    def classification(
        cls,
        dataframe: pd.DataFrame,
        target: str,
    ) -> dict[str, Any]:
        """
        Execute AutoML for a
        classification dataset.
        """

        problem_type = cls.detect_problem_type(
            dataframe,
            target,
        )

        if problem_type != "classification":

            raise ValueError(
                "Dataset is not a classification problem."
            )

        return cls.compare_models(
            dataframe,
            target,
        )

    @classmethod
    def regression(
        cls,
        dataframe: pd.DataFrame,
        target: str,
    ) -> dict[str, Any]:
        """
        Execute AutoML for a
        regression dataset.
        """

        problem_type = cls.detect_problem_type(
            dataframe,
            target,
        )

        if problem_type != "regression":

            raise ValueError(
                "Dataset is not a regression problem."
            )

        return cls.compare_models(
            dataframe,
            target,
        )
    @staticmethod
    def leaderboard(
        automl_result: dict[str, Any],
    ) -> list[dict[str, Any]]:
        """
        Return the AutoML leaderboard.
        """

        return automl_result.get(
            "leaderboard",
            [],
        )

    @staticmethod
    def best_model(
        automl_result: dict[str, Any],
    ) -> dict[str, Any]:
        """
        Return the best model information.
        """

        return {
            "algorithm": automl_result.get(
                "best_algorithm"
            ),
            "model": automl_result.get(
                "best_model"
            ),
            "score": automl_result.get(
                "best_score"
            ),
        }

    @classmethod
    def automl_summary(
        cls,
        dataframe: pd.DataFrame,
        target: str,
    ) -> dict[str, Any]:
        """
        Execute AutoML and return a concise summary.
        """

        result = cls.compare_models(
            dataframe,
            target,
        )

        return {
            "problem_type": result[
                "problem_type"
            ],
            "best_algorithm": result[
                "best_algorithm"
            ],
            "best_model": result[
                "best_model"
            ],
            "best_score": result[
                "best_score"
            ],
            "models_tested": result[
                "models_tested"
            ],
        }

    @staticmethod
    def service_status() -> dict[str, Any]:
        """
        Return AutoML service status.
        """

        models = ModelService.available_models()

        return {
            "service": "AutoMLService",
            "status": "ready",
            "supported_problem_types": [
                "classification",
                "regression",
            ],
            "classification_models": len(
                models["classification"]
            ),
            "regression_models": len(
                models["regression"]
            ),
            "clustering_models": len(
                models["clustering"]
            ),
        }