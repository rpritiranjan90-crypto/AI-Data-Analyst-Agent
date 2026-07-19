from __future__ import annotations

from typing import Any

import pandas as pd
from sklearn.metrics import accuracy_score, r2_score

from app.services.ml.model_service import ModelService
from app.services.ml.preprocessing_service import (
    PreprocessingService,
)
from app.services.ml.training_service import (
    TrainingService,
)
from app.services.ml.validation_service import (
    ValidationService,
)
from app.services.ml.evaluation_service import (
    EvaluationService,
)


class AutoMLService:
    """
    Enterprise AutoML Service.

    Automatically preprocesses data,
    trains multiple models,
    evaluates their performance,
    and selects the best model.

    Supported Tasks
    ---------------
    - Classification
    - Regression

    Future
    ------
    - Clustering
    - Hyperparameter Optimization
    - Auto Feature Engineering
    """

    CLASSIFICATION_MODELS = [
        "logistic_regression",
        "decision_tree_classifier",
        "random_forest_classifier",
        "gradient_boosting_classifier",
        "extra_trees_classifier",
        "knn",
        "naive_bayes",
    ]

    REGRESSION_MODELS = [
        "linear_regression",
        "ridge",
        "lasso",
        "elasticnet",
        "decision_tree_regressor",
        "random_forest_regressor",
        "gradient_boosting_regressor",
        "extra_trees_regressor",
    ]

    @staticmethod
    def detect_problem_type(
        dataframe: pd.DataFrame,
        target: str,
    ) -> str:
        """
        Automatically detect the ML problem type.
        """

        result = ValidationService.detect_problem_type(
            dataframe,
            target,
        )

        return result["problem_type"]

    @classmethod
    def compare_models(
        cls,
        dataframe: pd.DataFrame,
        target: str,
    ) -> dict[str, Any]:
        """
        Compare multiple machine learning models.

        Returns
        -------
        Leaderboard of trained models.
        """

        ValidationService.validate_dataset(
            dataframe
        )

        ValidationService.validate_target(
            dataframe,
            target,
        )

        preprocessing = (
            PreprocessingService.automatic_preprocessing(
                dataframe,
                target,
            )
        )

        split = preprocessing["split"]

        x_train = split["x_train"]
        x_test = split["x_test"]
        y_train = split["y_train"]
        y_test = split["y_test"]

        problem_type = cls.detect_problem_type(
            dataframe,
            target,
        )

        if problem_type == "classification":

            models = cls.CLASSIFICATION_MODELS

        else:

            models = cls.REGRESSION_MODELS

        leaderboard = []

        best_model = None
        best_score = float("-inf")
        for model_name in models:

            try:

                model = ModelService.create(
                    model_name
                )

                TrainingService.train(
                    model=model,
                    x_train=x_train,
                    y_train=y_train,
                )

                predictions = model.predict(
                    x_test
                )

                if (
                    problem_type
                    == "classification"
                ):

                    score = accuracy_score(
                        y_test,
                        predictions,
                    )

                    evaluation = (
                        EvaluationService.evaluate_classification(
                            y_test,
                            predictions,
                        )
                    )

                else:

                    score = r2_score(
                        y_test,
                        predictions,
                    )

                    evaluation = (
                        EvaluationService.evaluate_regression(
                            y_test,
                            predictions,
                        )
                    )

                leaderboard.append(
                    {
                        "model": model_name,
                        "score": score,
                        "evaluation": evaluation,
                    }
                )

                if score > best_score:

                    best_score = score
                    best_model = model

            except Exception as error:

                leaderboard.append(
                    {
                        "model": model_name,
                        "score": None,
                        "status": "failed",
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

            from app.services.ml.ml_artifact_registry import (
                MLArtifactRegistry,
            )

            MLArtifactRegistry.set_model(
                best_model
            )

        return {
            "success": True,
            "problem_type": problem_type,
            "best_model": (
                None
                if best_model is None
                else best_model.__class__.__name__
            ),
            "best_score": best_score,
            "leaderboard": leaderboard,
            "models_tested": len(models),
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
        Run AutoML for a classification dataset.

        Args:
            dataframe: Input dataset.
            target: Target column.

        Returns:
            AutoML results.
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
        Run AutoML for a regression dataset.

        Args:
            dataframe: Input dataset.
            target: Target column.

        Returns:
            AutoML results.
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
    def available_models() -> dict[str, list[str]]:
        """
        Return all supported AutoML models.
        """

        return {
            "classification": AutoMLService.CLASSIFICATION_MODELS,
            "regression": AutoMLService.REGRESSION_MODELS,
        }

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

        return {
            "service": "AutoMLService",
            "supported_problem_types": [
                "classification",
                "regression",
            ],
            "classification_models": len(
                AutoMLService.CLASSIFICATION_MODELS
            ),
            "regression_models": len(
                AutoMLService.REGRESSION_MODELS
            ),
            "status": "ready",
        }