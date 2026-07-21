from __future__ import annotations

from typing import Any

import pandas as pd

from app.services.dataset_service import DatasetService


class RecommendationWorkflow:
    """
    Enterprise Recommendation Workflow.

    Generates intelligent recommendations
    based on the current dataset.
    """

    def __init__(self) -> None:

        self._dataset_service = DatasetService()

        self._report: dict[str, Any] = {
            "success": True,
            "recommendations": [],
            "warnings": [],
            "errors": [],
        }

    def _dataset(self) -> pd.DataFrame:
        """
        Return active dataset.
        """

        return self._dataset_service.get_dataset()

    def _recommend(
        self,
        category: str,
        message: str,
        priority: str = "Medium",
    ) -> None:

        self._report["recommendations"].append(
            {
                "category": category,
                "priority": priority,
                "message": message,
            }
        )

    def _warning(self, message: str) -> None:

        self._report["warnings"].append(message)

    def _error(self, message: str) -> None:

        self._report["success"] = False
        self._report["errors"].append(message)

    def _data_quality_recommendations(self) -> None:
        """
        Generate data quality recommendations.
        """

        dataframe = self._dataset()

        missing = int(dataframe.isna().sum().sum())
        duplicates = int(dataframe.duplicated().sum())

        if missing > 0:
            self._recommend(
                "Data Quality",
                f"Handle {missing} missing values before analysis.",
                "High",
            )
        else:
            self._recommend(
                "Data Quality",
                "No missing values detected.",
                "Low",
            )

        if duplicates > 0:
            self._recommend(
                "Data Quality",
                f"Remove {duplicates} duplicate rows.",
                "High",
            )
        else:
            self._recommend(
                "Data Quality",
                "No duplicate rows detected.",
                "Low",
            )

    def _ml_recommendations(self) -> None:
        """
        Generate machine learning recommendations.
        """

        dataframe = self._dataset()

        numeric = dataframe.select_dtypes(
            include="number"
        ).columns.tolist()

        categorical = dataframe.select_dtypes(
            exclude="number"
        ).columns.tolist()

        if len(numeric) >= 2:

            self._recommend(
                "Machine Learning",
                "Dataset is suitable for regression and clustering.",
                "Medium",
            )

        if categorical:

            self._recommend(
                "Machine Learning",
                "Encode categorical features before model training.",
                "Medium",
            )

    def _visualization_recommendations(self) -> None:
        """
        Generate visualization recommendations.
        """

        self._recommend(
            "Visualization",
            "Create an interactive dashboard for business users.",
            "Medium",
        )

        self._recommend(
            "Visualization",
            "Use correlation heatmaps for feature analysis.",
            "Low",
        )

    def _business_recommendations(self) -> None:
        """
        Generate business recommendations.
        """

        dataframe = self._dataset()

        rows, columns = dataframe.shape

        if rows < 100:

            self._recommend(
                "Business",
                "Collect more data to improve analytical confidence.",
                "Medium",
            )

        if columns > 20:

            self._recommend(
                "Business",
                "Consider feature selection to reduce dimensionality.",
                "Low",
            )

        self._recommend(
            "Business",
            "Monitor data quality regularly before making business decisions.",
            "High",
        )

    def _next_steps(self) -> None:
        """
        Recommend next steps.
        """

        self._recommend(
            "Next Step",
            "Perform feature engineering.",
            "High",
        )

        self._recommend(
            "Next Step",
            "Train multiple machine learning models and compare their performance.",
            "High",
        )

        self._recommend(
            "Next Step",
            "Deploy the best-performing model using FastAPI.",
            "Medium",
        )

    def execute(self) -> dict[str, Any]:
        """
        Execute the Recommendation Workflow.
        """

        try:

            self._data_quality_recommendations()

            self._ml_recommendations()

            self._visualization_recommendations()

            self._business_recommendations()

            self._next_steps()

            self._report["summary"] = {
                "total_recommendations": len(
                    self._report["recommendations"]
                ),
                "warnings": len(
                    self._report["warnings"]
                ),
                "errors": len(
                    self._report["errors"]
                ),
            }

            return self._report

        except Exception as error:

            self._error(str(error))

            return self._report