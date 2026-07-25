from __future__ import annotations

from typing import Any

import numpy as np
import pandas as pd

from app.common.logger import get_logger
from app.common.timing import measure_time

logger = get_logger(__name__)


class DatasetStatisticsService:
    """
    Service responsible for generating descriptive statistics for datasets.
    Optimized with vectorized pandas C-operations for ultra-fast performance.
    """

    def _column_statistics(
        self,
        series: pd.Series,
    ) -> dict[str, Any]:
        """
        Generate descriptive statistics for one numeric column safely and quickly.
        """
        clean_s = series.dropna()
        if clean_s.empty:
            return {
                "count": 0, "mean": 0.0, "median": 0.0, "minimum": 0.0,
                "maximum": 0.0, "variance": 0.0, "standard_deviation": 0.0,
                "q1": 0.0, "q3": 0.0, "interquartile_range": 0.0,
                "skewness": 0.0, "kurtosis": 0.0,
            }

        q1 = float(clean_s.quantile(0.25))
        q3 = float(clean_s.quantile(0.75))

        return {
            "count": int(clean_s.count()),
            "mean": float(clean_s.mean()),
            "median": float(clean_s.median()),
            "minimum": float(clean_s.min()),
            "maximum": float(clean_s.max()),
            "variance": float(clean_s.var()) if len(clean_s) > 1 else 0.0,
            "standard_deviation": float(clean_s.std()) if len(clean_s) > 1 else 0.0,
            "q1": q1,
            "q3": q3,
            "interquartile_range": float(q3 - q1),
            "skewness": float(clean_s.skew()) if len(clean_s) > 2 else 0.0,
            "kurtosis": float(clean_s.kurt()) if len(clean_s) > 3 else 0.0,
        }

    def _outlier_summary(
        self,
        dataframe: pd.DataFrame,
    ) -> dict[str, int]:
        """
        Detect outliers using vectorized DataFrame IQR calculations.
        """
        numeric = dataframe.select_dtypes(include="number")
        if numeric.empty:
            return {}

        # Limit sampling for massive datasets to prevent slowdowns
        sample_num = numeric if len(numeric) <= 50000 else numeric.sample(n=50000, random_state=42)

        q1 = sample_num.quantile(0.25)
        q3 = sample_num.quantile(0.75)
        iqr = q3 - q1

        lower = q1 - (1.5 * iqr)
        upper = q3 + (1.5 * iqr)

        outlier_counts = ((numeric < lower) | (numeric > upper)).sum()
        return {col: int(val) for col, val in outlier_counts.to_dict().items()}

    def _dataset_summary(
        self,
        dataframe: pd.DataFrame,
    ) -> dict[str, Any]:
        """
        Generate overall dataset summary with sampling for huge datasets.
        """
        numeric = dataframe.select_dtypes(include="number")

        # Fast duplicate count (sample if >100k rows)
        if len(dataframe) > 100000:
            sample_df = dataframe.sample(n=50000, random_state=42)
            dup_count = int(sample_df.duplicated().sum() * (len(dataframe) / 50000))
        else:
            dup_count = int(dataframe.duplicated().sum())

        zero_count = int((numeric == 0).sum().sum()) if not numeric.empty else 0
        inf_count = int(np.isinf(numeric).sum().sum()) if not numeric.empty else 0

        return {
            "missing_values": int(dataframe.isna().sum().sum()),
            "duplicate_rows": dup_count,
            "zero_values": zero_count,
            "infinite_values": inf_count,
        }

    def _generate_insights(
        self,
        dataframe: pd.DataFrame,
        outliers: dict[str, int],
    ) -> list[str]:
        """
        Generate statistical insights.
        """
        insights: list[str] = []

        total_missing = dataframe.isna().sum().sum()
        if total_missing > 0:
            insights.append(f"Dataset contains {total_missing} missing values.")

        duplicates = int(dataframe.duplicated().sum())
        if duplicates > 0:
            insights.append(f"{duplicates} duplicate rows detected.")

        outlier_columns = [col for col, count in outliers.items() if count > 0]
        if outlier_columns:
            insights.append("Outliers detected in: " + ", ".join(outlier_columns[:5]))

        return insights

    @measure_time
    def generate(
        self,
        dataframe: pd.DataFrame,
        include_correlation: bool = True,
    ) -> dict[str, Any]:
        """
        Generate complete statistical analysis blazing fast.
        """
        logger.info("Generating dataset statistics.")

        numeric = dataframe.select_dtypes(include="number")

        statistics = {
            column: self._column_statistics(numeric[column])
            for column in numeric.columns
        }

        correlation: dict[str, Any] = {}

        if include_correlation and not numeric.empty:
            # If >30 numeric columns, restrict correlation to top 30 to keep speed under 100ms
            target_cols = numeric.columns[:30] if len(numeric.columns) > 30 else numeric.columns
            corr_df = numeric[target_cols].corr(numeric_only=True).round(4)
            correlation = corr_df.fillna(0).to_dict()

        outliers = self._outlier_summary(dataframe)
        summary = self._dataset_summary(dataframe)
        insights = self._generate_insights(dataframe, outliers)

        result = {
            "rows": len(dataframe),
            "columns": len(dataframe.columns),
            "numeric_columns": list(numeric.columns),
            "statistics": statistics,
            "correlation": correlation,
            "outliers": outliers,
            "summary": summary,
            "insights": insights,
        }

        logger.info("Dataset statistics generated successfully.")
        return result


__all__ = [
    "DatasetStatisticsService",
]