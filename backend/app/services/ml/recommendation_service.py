from __future__ import annotations

from typing import Any

import pandas as pd

from app.services.ml.automl_service import AutoMLService
from app.services.ml.metadata_service import MetadataService
from app.services.ml.validation_service import ValidationService


class RecommendationService:
    """
    Enterprise Recommendation Service.

    Analyzes datasets and recommends preprocessing,
    machine learning models, and evaluation metrics.

    Future enhancements:
    --------------------
    - AI/LLM-powered recommendations
    - Business-domain specific recommendations
    - Explainable recommendations
    """

    @staticmethod
    def recommend_scaler(
        dataframe: pd.DataFrame,
    ) -> dict[str, str]:
        """
        Recommend the best scaler based on numeric features.
        """

        numeric_columns = dataframe.select_dtypes(
            include="number"
        ).columns

        if len(numeric_columns) == 0:
            return {
                "recommended_scaler": "None",
                "reason": "No numeric columns found.",
            }

        return {
            "recommended_scaler": "StandardScaler",
            "reason": (
                "Dataset contains numeric features suitable "
                "for standardization."
            ),
        }

    @staticmethod
    def recommend_encoder(
        dataframe: pd.DataFrame,
    ) -> dict[str, str]:
        """
        Recommend the best encoder.
        """

        categorical_columns = dataframe.select_dtypes(
            exclude="number"
        ).columns

        if len(categorical_columns) == 0:
            return {
                "recommended_encoder": "None",
                "reason": "No categorical columns found.",
            }

        max_cardinality = max(
            dataframe[categorical_columns]
            .nunique(dropna=True)
            .tolist()
        )

        if max_cardinality <= 10:
            return {
                "recommended_encoder": "OneHotEncoder",
                "reason": (
                    "Categorical features have low cardinality."
                ),
            }

        return {
            "recommended_encoder": "OrdinalEncoder",
            "reason": (
                "Categorical features have high cardinality."
            ),
        }

    @staticmethod
    def recommend_feature_selection(
        dataframe: pd.DataFrame,
    ) -> dict[str, str]:
        """
        Recommend feature selection strategy.
        """

        feature_count = len(dataframe.columns)

        if feature_count > 30:
            return {
                "recommended_method": "SelectKBest",
                "reason": (
                    "Dataset contains many features."
                ),
            }

        return {
            "recommended_method": "None",
            "reason": (
                "Feature count is manageable."
            ),
        }

    @staticmethod
    def recommend_problem_type(
        dataframe: pd.DataFrame,
        target: str,
    ) -> str:
        """
        Detect ML problem type.
        """

        result = ValidationService.detect_problem_type(
            dataframe,
            target,
        )

        return result["problem_type"]
    @classmethod
    def recommend_models(
        cls,
        dataframe: pd.DataFrame,
        target: str,
    ) -> dict[str, Any]:
        """
        Recommend suitable machine learning models.
        """

        problem_type = cls.recommend_problem_type(
            dataframe,
            target,
        )

        models = AutoMLService.available_models()

        return {
            "problem_type": problem_type,
            "recommended_models": models[
                problem_type
            ],
            "reason": (
                f"Recommended models for "
                f"{problem_type} problems."
            ),
        }

    @classmethod
    def recommend_metrics(
        cls,
        dataframe: pd.DataFrame,
        target: str,
    ) -> dict[str, Any]:
        """
        Recommend evaluation metrics.
        """

        problem_type = cls.recommend_problem_type(
            dataframe,
            target,
        )

        if problem_type == "classification":

            metrics = [
                "accuracy",
                "precision",
                "recall",
                "f1_score",
                "roc_auc",
            ]

        else:

            metrics = [
                "mae",
                "mse",
                "rmse",
                "r2_score",
                "mape",
            ]

        return {
            "problem_type": problem_type,
            "recommended_metrics": metrics,
        }

    @classmethod
    def recommend_preprocessing(
        cls,
        dataframe: pd.DataFrame,
    ) -> dict[str, Any]:
        """
        Recommend preprocessing steps.
        """

        return {
            "scaler": cls.recommend_scaler(
                dataframe
            ),
            "encoder": cls.recommend_encoder(
                dataframe
            ),
            "feature_selection":
            cls.recommend_feature_selection(
                dataframe
            ),
        }

    @classmethod
    def recommend(
        cls,
        dataframe: pd.DataFrame,
        target: str,
    ) -> dict[str, Any]:
        """
        Generate a complete recommendation report.
        """

        ValidationService.validate_dataset(
            dataframe
        )

        ValidationService.validate_target(
            dataframe,
            target,
        )

        metadata = (
            MetadataService.metadata_report(
                dataframe,
                target,
            )
        )

        preprocessing = (
            cls.recommend_preprocessing(
                dataframe
            )
        )

        models = cls.recommend_models(
            dataframe,
            target,
        )

        metrics = cls.recommend_metrics(
            dataframe,
            target,
        )

        return {
            "success": True,
            "metadata": metadata,
            "preprocessing": preprocessing,
            "models": models,
            "metrics": metrics,
            "message":
            "Recommendations generated successfully.",
        }
    @classmethod
    def dataset_summary(
        cls,
        dataframe: pd.DataFrame,
        target: str,
    ) -> dict[str, Any]:
        """
        Return a concise dataset summary for recommendations.
        """

        metadata = MetadataService.metadata_report(
            dataframe,
            target,
        )

        problem_type = cls.recommend_problem_type(
            dataframe,
            target,
        )

        return {
            "rows": len(dataframe),
            "columns": len(dataframe.columns),
            "target": target,
            "problem_type": problem_type,
            "metadata": metadata,
        }

    @classmethod
    def automl_recommendation(
        cls,
        dataframe: pd.DataFrame,
        target: str,
    ) -> dict[str, Any]:
        """
        Execute AutoML and return the best-performing model.
        """

        result = AutoMLService.compare_models(
            dataframe,
            target,
        )

        return {
            "best_model": result["best_model"],
            "best_score": result["best_score"],
            "leaderboard": result["leaderboard"],
            "models_tested": result["models_tested"],
        }

    @staticmethod
    def available_recommendations() -> list[str]:
        """
        Return all supported recommendation categories.
        """

        return [
            "dataset_summary",
            "preprocessing",
            "models",
            "metrics",
            "automl",
        ]

    @staticmethod
    def recommendation_status() -> dict[str, Any]:
        """
        Return RecommendationService status.
        """

        return {
            "service": "RecommendationService",
            "status": "ready",
            "available_recommendations": (
                RecommendationService.available_recommendations()
            ),
        }

    @classmethod
    def recommendation_summary(
        cls,
        dataframe: pd.DataFrame,
        target: str,
    ) -> dict[str, Any]:
        """
        Generate a concise recommendation summary.
        """

        recommendations = cls.recommend(
            dataframe,
            target,
        )

        automl = cls.automl_recommendation(
            dataframe,
            target,
        )

        return {
            "problem_type": recommendations[
                "models"
            ]["problem_type"],
            "recommended_scaler": recommendations[
                "preprocessing"
            ]["scaler"][
                "recommended_scaler"
            ],
            "recommended_encoder": recommendations[
                "preprocessing"
            ]["encoder"][
                "recommended_encoder"
            ],
            "recommended_models": recommendations[
                "models"
            ]["recommended_models"],
            "recommended_metrics": recommendations[
                "metrics"
            ]["recommended_metrics"],
            "best_model": automl["best_model"],
            "best_score": automl["best_score"],
        }