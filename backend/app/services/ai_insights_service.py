from __future__ import annotations

import pandas as pd

from app.ai_insights.workflow import AIInsightsWorkflow
from app.common.logger import get_logger
from app.common.timing import measure_time
from app.exceptions.base import (
    NotFoundException,
    InternalServerException,
)
from app.services.dataset_cache import DatasetCache

logger = get_logger(__name__)


def detect_outliers(df: pd.DataFrame) -> dict[str, int]:
    """
    Detect outliers using the IQR method.
    """

    logger.info("Detecting outliers using IQR method.")

    outliers: dict[str, int] = {}

    numeric_df = df.select_dtypes(include=["number"])

    for column in numeric_df.columns:

        series = numeric_df[column].dropna()

        q1 = series.quantile(0.25)
        q3 = series.quantile(0.75)

        iqr = q3 - q1

        lower = q1 - (1.5 * iqr)
        upper = q3 + (1.5 * iqr)

        outliers[column] = int(
            ((series < lower) | (series > upper)).sum()
        )

    logger.info(
        "Outlier detection completed for %d numeric columns.",
        len(outliers),
    )

    return outliers


def detect_correlations(
    df: pd.DataFrame,
) -> list[dict]:
    """
    Detect strong correlations between numeric columns.
    """

    logger.info("Detecting strong correlations.")

    numeric_df = df.select_dtypes(include=["number"])

    if numeric_df.shape[1] < 2:

        logger.info(
            "Correlation analysis skipped. Less than two numeric columns."
        )

        return []

    correlation_matrix = numeric_df.corr(
        numeric_only=True
    )

    strong_correlations: list[dict] = []

    columns = correlation_matrix.columns

    for i in range(len(columns)):
        for j in range(i + 1, len(columns)):

            correlation = correlation_matrix.iloc[i, j]

            if abs(correlation) >= 0.70:

                strong_correlations.append(
                    {
                        "column_1": columns[i],
                        "column_2": columns[j],
                        "correlation": round(
                            float(correlation),
                            2,
                        ),
                    }
                )

    logger.info(
        "Found %d strong correlations.",
        len(strong_correlations),
    )

    return strong_correlations


@measure_time
def generate_ai_insights() -> dict:
    """
    Generate AI insights for the currently loaded dataset.
    """

    logger.info("Generating AI insights.")

    df = DatasetCache.get_dataset()

    if df is None:

        logger.error("No dataset is currently loaded.")

        raise NotFoundException(
    resource="Dataset",
)

    logger.info(
        "Dataset loaded successfully (%d rows, %d columns).",
        len(df),
        len(df.columns),
    )
    numeric_columns = (
        df.select_dtypes(include=["number"])
        .columns.tolist()
    )

    categorical_columns = (
        df.select_dtypes(exclude=["number"])
        .columns.tolist()
    )

    logger.info(
        "Detected %d numeric columns and %d categorical columns.",
        len(numeric_columns),
        len(categorical_columns),
    )

    missing_values = df.isna().sum().to_dict()

    duplicate_rows = int(
        df.duplicated().sum()
    )

    total_missing = int(
        sum(missing_values.values())
    )

    logger.info(
        "Missing values: %d | Duplicate rows: %d",
        total_missing,
        duplicate_rows,
    )

    outliers = detect_outliers(df)

    total_outliers = sum(
        outliers.values()
    )

    logger.info(
        "Total outliers detected: %d",
        total_outliers,
    )

    strong_correlations = detect_correlations(df)

    logger.info(
        "Strong correlations found: %d",
        len(strong_correlations),
    )

    health_score = 100

    if total_missing > 0:
        health_score -= min(
            total_missing * 2,
            30,
        )

    if duplicate_rows > 0:
        health_score -= min(
            duplicate_rows * 5,
            20,
        )

    if total_outliers > 0:
        health_score -= min(
            total_outliers,
            10,
        )

    health_score = max(
        0,
        health_score,
    )

    logger.info(
        "Dataset health score calculated: %d",
        health_score,
    )

    # ----------------------------------------
    # AI Recommendations
    # ----------------------------------------

    recommendations: list[str] = []
    if total_missing == 0:
        recommendations.append(
            "✅ No missing values detected."
        )
    else:
        recommendations.append(
            f"⚠️ Dataset contains {total_missing} missing values. "
            "Consider filling or removing them."
        )

    if duplicate_rows == 0:
        recommendations.append(
            "✅ No duplicate rows found."
        )
    else:
        recommendations.append(
            f"⚠️ Dataset contains {duplicate_rows} duplicate rows. "
            "Consider removing them."
        )

    if total_outliers == 0:
        recommendations.append(
            "✅ No significant outliers detected."
        )
    else:
        recommendations.append(
            f"⚠️ {total_outliers} potential outliers detected."
        )

    if strong_correlations:
        recommendations.append(
            "📊 Strong correlations detected. "
            "A Correlation Heatmap is recommended."
        )

    if numeric_columns:
        recommendations.append(
            "📈 Histogram, Box Plot and KDE Plot are recommended for numeric columns."
        )

    if categorical_columns:
        recommendations.append(
            "🥧 Pie Chart, Donut Chart and Count Plot are recommended for categorical columns."
        )

    if len(numeric_columns) >= 2:
        recommendations.append(
            "📉 Scatter Plot and Bubble Chart are recommended to analyze relationships."
        )

    logger.info(
        "Generated %d AI recommendations.",
        len(recommendations),
    )

    response = {
        "success": True,
        "message": "AI Insights generated successfully",
        "dataset_summary": {
            "rows": len(df),
            "columns": len(df.columns),
            "shape": list(df.shape),
        },
        "numeric_columns": numeric_columns,
        "categorical_columns": categorical_columns,
        "missing_values": missing_values,
        "duplicate_rows": duplicate_rows,
        "outliers": outliers,
        "strong_correlations": strong_correlations,
        "health_score": health_score,
        "recommendations": recommendations,
    }

    logger.info(
        "AI insights generated successfully."
    )

    return response


@measure_time
def auto_insights() -> dict:
    """
    Execute the complete AI Insights workflow.
    """

    logger.info(
        "Starting AI Insights workflow."
    )

    try:

        result = AIInsightsWorkflow().execute()

        logger.info(
            "AI Insights workflow completed successfully."
        )

        return result

    except NotFoundException:
        raise

    except Exception as error:

        logger.exception(
        "AI Insights workflow failed."
    )

    raise InternalServerException(
        str(error)
    ) from error


__all__ = [
    "generate_ai_insights",
    "detect_outliers",
    "detect_correlations",
    "auto_insights",
]