from __future__ import annotations

from typing import List

import pandas as pd

from app.services.correlation_service import CorrelationService
from app.services.quality_service import QualityService


class InsightService:
    """
    Enterprise Business Insight Generator.

    Generates business-friendly insights and recommendations
    from the uploaded dataset.
    """

    @staticmethod
    def generate(
        dataframe: pd.DataFrame,
    ) -> List[str]:
        """
        Generate intelligent insights for the dataset.

        Args:
            dataframe: Input dataframe.

        Returns:
            List of business insights.
        """

        insights: List[str] = []

        total_rows = len(dataframe)
        total_columns = len(dataframe.columns)

        numeric_columns = dataframe.select_dtypes(
            include=["number"]
        ).columns

        categorical_columns = dataframe.select_dtypes(
            include=["object", "category", "bool"]
        ).columns

        # ----------------------------
        # Dataset Overview
        # ----------------------------

        insights.append(
            f"The dataset contains {total_rows:,} rows and "
            f"{total_columns} columns."
        )

        if total_rows < 100:
            insights.append(
                "Dataset size is relatively small. "
                "Machine learning models may have limited generalization."
            )
        elif total_rows < 1000:
            insights.append(
                "Dataset size is suitable for exploratory data analysis."
            )
        else:
            insights.append(
                "Dataset size is sufficient for advanced analytics and machine learning."
            )

        # ----------------------------
        # Dataset Quality
        # ----------------------------

        quality = QualityService.calculate(dataframe)

        insights.append(
            f"Dataset Quality Score: {quality['quality_score']}% "
            f"({quality['rating']})."
        )

        total_cells = total_rows * total_columns

        missing_percentage = (
            (quality["missing_values"] / total_cells) * 100
            if total_cells
            else 0
        )

        if quality["missing_values"] == 0:
            insights.append(
                "No missing values detected."
            )
        else:
            insights.append(
                f"{quality['missing_values']} missing values "
                f"({missing_percentage:.2f}% of all cells) detected. "
                "Consider imputing or removing them before analysis."
            )

        duplicate_percentage = (
            (quality["duplicate_rows"] / total_rows) * 100
            if total_rows
            else 0
        )

        if quality["duplicate_rows"] == 0:
            insights.append(
                "No duplicate rows found."
            )
        else:
            insights.append(
                f"{quality['duplicate_rows']} duplicate rows "
                f"({duplicate_percentage:.2f}% of records) detected. "
                "Consider removing duplicates."
            )

        # ----------------------------
        # Column Summary
        # ----------------------------

        insights.append(
            f"{len(numeric_columns)} numeric columns detected."
        )

        insights.append(
            f"{len(categorical_columns)} categorical columns detected."
        )

        if len(numeric_columns) > len(categorical_columns):
            insights.append(
                "The dataset is primarily numerical and is well suited for statistical analysis and regression models."
            )
        elif len(categorical_columns) > len(numeric_columns):
            insights.append(
                "The dataset contains many categorical features. Encoding may be required before machine learning."
            )

        # ----------------------------
        # Constant Columns
        # ----------------------------

        constant_columns = [
            col
            for col in dataframe.columns
            if dataframe[col].nunique(dropna=False) <= 1
        ]

        if constant_columns:
            insights.append(
                "Constant columns detected: "
                + ", ".join(constant_columns)
                + ". These columns provide little analytical value."
            )

        # ----------------------------
        # High Cardinality
        # ----------------------------

        for column in categorical_columns:

            unique_values = dataframe[column].nunique()

            if unique_values > 50:

                insights.append(
                    f"'{column}' contains {unique_values} unique values. "
                    "High-cardinality categorical columns may require target encoding or feature hashing."
                )

        # ----------------------------
        # Correlation Analysis
        # ----------------------------

        correlations = CorrelationService.strong_correlations(
            dataframe
        )

        if correlations:

            insights.append(
                f"{len(correlations)} strong correlations detected."
            )

            for item in correlations:

                insights.append(
                    f"{item['column_1']} and {item['column_2']} "
                    f"have a {item['direction'].lower()} "
                    f"{item['interpretation'].lower()} correlation "
                    f"({item['correlation']})."
                )

        else:

            insights.append(
                "No strong correlations detected among numeric columns."
            )

        # ----------------------------
        # Overall Recommendation
        # ----------------------------

        if (
            quality["quality_score"] >= 90
            and quality["missing_values"] == 0
            and quality["duplicate_rows"] == 0
        ):
            insights.append(
                "Overall Assessment: The dataset is clean, well-structured, and ready for advanced analytics or machine learning."
            )

        elif quality["quality_score"] >= 70:

            insights.append(
                "Overall Assessment: The dataset is in good condition but would benefit from minor preprocessing before modeling."
            )

        else:

            insights.append(
                "Overall Assessment: Significant preprocessing is recommended before performing predictive analytics."
            )

        return insights