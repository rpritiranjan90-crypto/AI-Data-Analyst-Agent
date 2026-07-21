from __future__ import annotations

from app.recommendation.workflow import (
    RecommendationWorkflow,
)


def auto_recommend() -> dict:
    """
    Execute the Recommendation Workflow.
    """

    return RecommendationWorkflow().execute()


def generate_recommendations() -> dict:
    """
    Public API for recommendation generation.
    """

    return auto_recommend()


__all__ = [
    "auto_recommend",
    "generate_recommendations",
]
def _data_quality_recommendations(self) -> None:
        """
        Generate recommendations for data quality.
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
                "Dataset contains no missing values.",
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
        Generate ML recommendations.
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
        Suggest the next actions.
        """

        self._recommend(
            "Next Step",
            "Perform feature engineering.",
            "High",
        )

        self._recommend(
            "Next Step",
            "Train multiple ML models and compare performance.",
            "High",
        )

        self._recommend(
            "Next Step",
            "Deploy the best-performing model using FastAPI.",
            "Medium",
        )

def execute(self) -> dict[str, Any]:
        """
        Execute Recommendation Workflow.
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