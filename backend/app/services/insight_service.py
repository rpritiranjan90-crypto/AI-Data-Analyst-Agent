from __future__ import annotations

from typing import List

import pandas as pd

from app.services.correlation_service import CorrelationService
from app.services.quality_service import QualityService


class InsightService:
    """
    Enterprise Business Insight Generator.
    """

    @staticmethod
    def generate(
        dataframe: pd.DataFrame
    ) -> List[str]:

        insights = []

        # Dataset Quality
        quality = QualityService.calculate(dataframe)

        insights.append(
            f"Dataset Quality Score: {quality['quality_score']}% ({quality['rating']})."
        )

        # Missing Values
        if quality["missing_values"] == 0:
            insights.append(
                "No missing values detected."
            )
        else:
            insights.append(
                f"{quality['missing_values']} missing values detected."
            )

        # Duplicate Rows
        if quality["duplicate_rows"] == 0:
            insights.append(
                "No duplicate rows found."
            )
        else:
            insights.append(
                f"{quality['duplicate_rows']} duplicate rows detected."
            )

        # Strong Correlations
        correlations = CorrelationService.strong_correlations(dataframe)

        if correlations:

            for item in correlations:

                insights.append(
                    f"{item['column_1']} and {item['column_2']} "
                    f"have a strong {item['strength'].lower()} "
                    f"correlation ({item['correlation']})."
                )

        else:

            insights.append(
                "No strong correlations detected."
            )

        # Numeric Column Summary
        numeric_columns = dataframe.select_dtypes(
            include=["number"]
        ).columns

        insights.append(
            f"{len(numeric_columns)} numeric columns detected."
        )

        # Categorical Column Summary
        categorical_columns = dataframe.select_dtypes(
            include=["object", "category", "bool"]
        ).columns

        insights.append(
            f"{len(categorical_columns)} categorical columns detected."
        )

        return insights