from __future__ import annotations

from typing import Any

import numpy as np
from sklearn.metrics import (
    accuracy_score,
    classification_report,
    confusion_matrix,
    f1_score,
    log_loss,
    mean_absolute_error,
    mean_squared_error,
    precision_score,
    r2_score,
    recall_score,
    roc_auc_score,
    silhouette_score,
    davies_bouldin_score,
    calinski_harabasz_score,
)


class EvaluationService:
    """
    Enterprise Machine Learning Evaluation Service.

    Responsible for evaluating trained machine learning
    models for regression, classification, and clustering.
    """

    @staticmethod
    def evaluate_classification(
        y_true,
        y_pred,
        y_probability=None,
    ) -> dict[str, Any]:
        """
        Evaluate a classification model.

        Returns:
            Classification metrics.
        """

        result = {
            "accuracy": float(
                accuracy_score(
                    y_true,
                    y_pred,
                )
            ),
            "precision": float(
                precision_score(
                    y_true,
                    y_pred,
                    average="weighted",
                    zero_division=0,
                )
            ),
            "recall": float(
                recall_score(
                    y_true,
                    y_pred,
                    average="weighted",
                    zero_division=0,
                )
            ),
            "f1_score": float(
                f1_score(
                    y_true,
                    y_pred,
                    average="weighted",
                    zero_division=0,
                )
            ),
            "confusion_matrix": confusion_matrix(
                y_true,
                y_pred,
            ).tolist(),
            "classification_report": classification_report(
                y_true,
                y_pred,
                zero_division=0,
                output_dict=True,
            ),
        }

        if y_probability is not None:

            try:

                result["roc_auc"] = float(
                    roc_auc_score(
                        y_true,
                        y_probability,
                        multi_class="ovr",
                    )
                )

            except Exception:
                pass

            try:

                result["log_loss"] = float(
                    log_loss(
                        y_true,
                        y_probability,
                    )
                )

            except Exception:
                pass

        return result

    @staticmethod
    def evaluate_regression(
        y_true,
        y_pred,
    ) -> dict[str, Any]:
        """
        Evaluate a regression model.
        """

        mse = mean_squared_error(
            y_true,
            y_pred,
        )

        rmse = np.sqrt(
            mse
        )

        mae = mean_absolute_error(
            y_true,
            y_pred,
        )

        r2 = r2_score(
            y_true,
            y_pred,
        )

        return {
            "mae": float(mae),
            "mse": float(mse),
            "rmse": float(rmse),
            "r2_score": float(r2),
        }
    @staticmethod
    def adjusted_r2_score(
        y_true,
        y_pred,
        n_features: int,
    ) -> float:
        """
        Calculate Adjusted R² Score.

        Args:
            y_true: Actual target values.
            y_pred: Predicted values.
            n_features: Number of features used.

        Returns:
            Adjusted R² score.
        """

        n_samples = len(y_true)

        if n_samples <= n_features + 1:
            raise ValueError(
                "Not enough samples to calculate Adjusted R²."
            )

        r2 = r2_score(
            y_true,
            y_pred,
        )

        adjusted = 1 - (
            (1 - r2)
            * (n_samples - 1)
            / (n_samples - n_features - 1)
        )

        return float(adjusted)

    @staticmethod
    def mean_absolute_percentage_error(
        y_true,
        y_pred,
    ) -> float:
        """
        Calculate Mean Absolute Percentage Error (MAPE).
        """

        y_true = np.asarray(y_true)
        y_pred = np.asarray(y_pred)

        if np.any(y_true == 0):
            raise ValueError(
                "MAPE cannot be calculated when y_true contains zero values."
            )

        mape = np.mean(
            np.abs(
                (y_true - y_pred) / y_true
            )
        ) * 100

        return float(mape)

    @staticmethod
    def evaluate_clustering(
        x,
        labels,
    ) -> dict[str, Any]:
        """
        Evaluate clustering quality.

        Args:
            x: Feature matrix.
            labels: Cluster labels.

        Returns:
            Clustering metrics.
        """

        return {
            "silhouette_score": float(
                silhouette_score(
                    x,
                    labels,
                )
            ),
            "davies_bouldin_score": float(
                davies_bouldin_score(
                    x,
                    labels,
                )
            ),
            "calinski_harabasz_score": float(
                calinski_harabasz_score(
                    x,
                    labels,
                )
            ),
        }

    @staticmethod
    def available_metrics() -> dict[str, list[str]]:
        """
        Return supported evaluation metrics.
        """

        return {
            "classification": [
                "accuracy",
                "precision",
                "recall",
                "f1_score",
                "roc_auc",
                "log_loss",
                "confusion_matrix",
                "classification_report",
            ],
            "regression": [
                "mae",
                "mse",
                "rmse",
                "r2_score",
                "adjusted_r2",
                "mape",
            ],
            "clustering": [
                "silhouette_score",
                "davies_bouldin_score",
                "calinski_harabasz_score",
            ],
        }

    @staticmethod
    def evaluation_summary(
        problem_type: str,
        metrics: dict[str, Any],
    ) -> dict[str, Any]:
        """
        Generate a standardized evaluation summary.

        Args:
            problem_type: regression, classification, or clustering.
            metrics: Evaluation metrics.

        Returns:
            Evaluation summary.
        """

        return {
            "success": True,
            "problem_type": problem_type,
            "metrics": metrics,
            "metric_count": len(metrics),
            "message": "Model evaluation completed successfully.",
        }

    @staticmethod
    def evaluate(
        problem_type: str,
        **kwargs: Any,
    ) -> dict[str, Any]:
        """
        Automatically evaluate a model based on the
        specified problem type.

        Args:
            problem_type: regression, classification, or clustering.

        Returns:
            Evaluation results.
        """

        problem_type = problem_type.lower()

        if problem_type == "classification":

            metrics = EvaluationService.evaluate_classification(
                kwargs["y_true"],
                kwargs["y_pred"],
                kwargs.get("y_probability"),
            )

        elif problem_type == "regression":

            metrics = EvaluationService.evaluate_regression(
                kwargs["y_true"],
                kwargs["y_pred"],
            )

            if "n_features" in kwargs:

                metrics["adjusted_r2"] = (
                    EvaluationService.adjusted_r2_score(
                        kwargs["y_true"],
                        kwargs["y_pred"],
                        kwargs["n_features"],
                    )
                )

                try:

                    metrics["mape"] = (
                        EvaluationService.mean_absolute_percentage_error(
                            kwargs["y_true"],
                            kwargs["y_pred"],
                        )
                    )

                except ValueError:
                    pass

        elif problem_type == "clustering":

            metrics = EvaluationService.evaluate_clustering(
                kwargs["x"],
                kwargs["labels"],
            )

        else:

            raise ValueError(
                f"Unsupported problem type '{problem_type}'."
            )

        return EvaluationService.evaluation_summary(
            problem_type,
            metrics,
        )