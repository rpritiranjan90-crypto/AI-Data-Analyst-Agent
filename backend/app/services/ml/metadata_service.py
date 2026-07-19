from __future__ import annotations

from typing import Any

import pandas as pd

from app.services.ml.validation_service import ValidationService


class MetadataService:
    """
    Enterprise Machine Learning Metadata Service.

    Generates reusable metadata describing a dataset.
    This information is shared across preprocessing,
    training, evaluation, and AutoML services.
    """

    @staticmethod
    def dataset_overview(
        dataframe: pd.DataFrame,
    ) -> dict[str, Any]:
        """
        Generate a high-level overview of the dataset.
        """

        ValidationService.validate_dataset(
            dataframe
        )

        return {
            "rows": len(dataframe),
            "columns": len(dataframe.columns),
            "memory_usage_bytes": int(
                dataframe.memory_usage(
                    deep=True
                ).sum()
            ),
            "duplicate_rows": int(
                dataframe.duplicated().sum()
            ),
            "missing_values": int(
                dataframe.isna().sum().sum()
            ),
        }

    @staticmethod
    def feature_summary(
        dataframe: pd.DataFrame,
    ) -> dict[str, Any]:
        """
        Generate feature metadata.
        """

        ValidationService.validate_dataset(
            dataframe
        )

        numeric_columns = dataframe.select_dtypes(
            include="number"
        ).columns.tolist()

        categorical_columns = dataframe.select_dtypes(
            exclude="number"
        ).columns.tolist()

        datetime_columns = dataframe.select_dtypes(
            include=["datetime", "datetimetz"]
        ).columns.tolist()

        boolean_columns = dataframe.select_dtypes(
            include="bool"
        ).columns.tolist()

        return {
            "numeric_columns": numeric_columns,
            "categorical_columns": categorical_columns,
            "datetime_columns": datetime_columns,
            "boolean_columns": boolean_columns,
            "numeric_count": len(
                numeric_columns
            ),
            "categorical_count": len(
                categorical_columns
            ),
            "datetime_count": len(
                datetime_columns
            ),
            "boolean_count": len(
                boolean_columns
            ),
        }

    @staticmethod
    def missing_value_summary(
        dataframe: pd.DataFrame,
    ) -> dict[str, Any]:
        """
        Generate missing value statistics.
        """

        ValidationService.validate_dataset(
            dataframe
        )

        missing = dataframe.isna().sum()

        return {
            column: {
                "missing": int(count),
                "percentage": round(
                    (count / len(dataframe)) * 100,
                    2,
                ),
            }
            for column, count in missing.items()
        }

    @staticmethod
    def cardinality_summary(
        dataframe: pd.DataFrame,
    ) -> dict[str, Any]:
        """
        Generate unique value statistics.
        """

        ValidationService.validate_dataset(
            dataframe
        )

        return {
            column: {
                "unique_values": int(
                    dataframe[column].nunique(
                        dropna=True
                    )
                )
            }
            for column in dataframe.columns
        }
    @staticmethod
    def target_summary(
        dataframe: pd.DataFrame,
        target: str,
    ) -> dict[str, Any]:
        """
        Generate summary information for the target column.
        """

        ValidationService.validate_target(
            dataframe,
            target,
        )

        series = dataframe[target]

        return {
            "target": target,
            "dtype": str(series.dtype),
            "unique_values": int(
                series.nunique(dropna=True)
            ),
            "missing_values": int(
                series.isna().sum()
            ),
            "is_numeric": pd.api.types.is_numeric_dtype(
                series
            ),
        }

    @staticmethod
    def numeric_summary(
        dataframe: pd.DataFrame,
    ) -> dict[str, Any]:
        """
        Generate summary statistics for numeric columns.
        """

        ValidationService.validate_dataset(
            dataframe
        )

        numeric_df = dataframe.select_dtypes(
            include="number"
        )

        return {
            column: {
                "mean": float(numeric_df[column].mean()),
                "median": float(numeric_df[column].median()),
                "std": float(numeric_df[column].std()),
                "min": float(numeric_df[column].min()),
                "max": float(numeric_df[column].max()),
            }
            for column in numeric_df.columns
        }

    @staticmethod
    def categorical_summary(
        dataframe: pd.DataFrame,
    ) -> dict[str, Any]:
        """
        Generate summary statistics for categorical columns.
        """

        ValidationService.validate_dataset(
            dataframe
        )

        categorical_df = dataframe.select_dtypes(
            exclude="number"
        )

        summary = {}

        for column in categorical_df.columns:

            summary[column] = {
                "unique_values": int(
                    categorical_df[column].nunique(
                        dropna=True
                    )
                ),
                "most_frequent": (
                    None
                    if categorical_df[column].mode().empty
                    else str(
                        categorical_df[column]
                        .mode()
                        .iloc[0]
                    )
                ),
                "missing_values": int(
                    categorical_df[column]
                    .isna()
                    .sum()
                ),
            }

        return summary

    @staticmethod
    def class_distribution(
        dataframe: pd.DataFrame,
        target: str,
    ) -> dict[str, Any]:
        """
        Generate target class distribution.
        """

        ValidationService.validate_target(
            dataframe,
            target,
        )

        distribution = (
            dataframe[target]
            .value_counts(dropna=False)
            .to_dict()
        )

        return {
            "target": target,
            "distribution": distribution,
        }

    @staticmethod
    def metadata_report(
        dataframe: pd.DataFrame,
        target: str | None = None,
    ) -> dict[str, Any]:
        """
        Generate a complete metadata report.
        """

        report = {
            "dataset": MetadataService.dataset_overview(
                dataframe
            ),
            "features": MetadataService.feature_summary(
                dataframe
            ),
            "missing": MetadataService.missing_value_summary(
                dataframe
            ),
            "cardinality": MetadataService.cardinality_summary(
                dataframe
            ),
            "numeric": MetadataService.numeric_summary(
                dataframe
            ),
            "categorical": MetadataService.categorical_summary(
                dataframe
            ),
        }

        if target is not None:

            report["target"] = (
                MetadataService.target_summary(
                    dataframe,
                    target,
                )
            )

            report["class_distribution"] = (
                MetadataService.class_distribution(
                    dataframe,
                    target,
                )
            )

        return report