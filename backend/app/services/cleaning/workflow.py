from __future__ import annotations

from typing import Any

import pandas as pd

from app.services.cleaning_history import CleaningHistory
from app.services.dataset_service import DatasetService
from app.services.datatype_service import DatatypeService
from app.services.duplicate_service import DuplicateService
from app.services.missing_value_service import MissingValueService
from app.services.outlier_service import OutlierService
from app.services.quality_service import QualityService


class CleaningWorkflow:
    """
    Enterprise Cleaning Workflow.

    Coordinates the complete dataset cleaning pipeline while
    delegating all business logic to the existing cleaning
    services.

    Workflow

        Dataset
            ↓
        Missing Values
            ↓
        Duplicate Removal
            ↓
        Outlier Removal
            ↓
        Datatype Detection
            ↓
        Quality Assessment
            ↓
        Cleaning Report
    """

    def __init__(self) -> None:

        self._dataset_service = DatasetService()

        self._report: dict[str, Any] = {
            "success": True,
            "steps": [],
            "warnings": [],
            "errors": [],
        }

    def _dataset(self) -> pd.DataFrame:
        """
        Return the active dataset.
        """

        return self._dataset_service.get_dataset()

    def _add_step(
        self,
        name: str,
        result: Any,
    ) -> None:

        self._report["steps"].append(
            {
                "step": name,
                "result": result,
            }
        )

    def _warning(
        self,
        message: str,
    ) -> None:

        self._report["warnings"].append(message)

    def _error(
        self,
        message: str,
    ) -> None:

        self._report["success"] = False

        self._report["errors"].append(message)

    def _history(self):

        return CleaningHistory.get_history()
    def _handle_missing_values(self) -> None:
        """
        Automatically fill missing values.

        Numeric columns  -> median
        Other columns    -> mode
        """

        dataframe = self._dataset()

        for column in dataframe.columns:

            missing = int(dataframe[column].isna().sum())

            if missing == 0:
                continue

            try:

                if pd.api.types.is_numeric_dtype(
                    dataframe[column]
                ):

                    result = MissingValueService.fill(
                        dataframe,
                        column,
                        method="median",
                    )

                else:

                    result = MissingValueService.fill(
                        dataframe,
                        column,
                        method="mode",
                    )

                self._add_step(
                    f"Missing Values ({column})",
                    result,
                )

                dataframe = self._dataset()

            except Exception as error:

                self._warning(
                    f"{column}: {error}"
                )

    def _remove_duplicates(self) -> None:
        """
        Remove duplicate rows if present.
        """

        dataframe = self._dataset()

        try:

            duplicate_info = (
                DuplicateService.get_duplicate_count(
                    dataframe
                )
            )

            if duplicate_info["has_duplicates"]:

                result = (
                    DuplicateService.remove_duplicates(
                        dataframe
                    )
                )

                self._add_step(
                    "Duplicate Removal",
                    result,
                )

            else:

                self._add_step(
                    "Duplicate Removal",
                    {
                        "success": True,
                        "message": "No duplicate rows found.",
                    },
                )

        except Exception as error:

            self._error(str(error))
    def _remove_outliers(self) -> None:
        """
        Automatically remove IQR outliers from numeric columns.
        """

        dataframe = self._dataset()

        numeric_columns = dataframe.select_dtypes(
            include="number"
        ).columns

        for column in numeric_columns:

            try:

                info = OutlierService.count_outliers_iqr(
                    dataframe,
                    column,
                )

                if info["outlier_count"] == 0:
                    continue

                result = OutlierService.remove_iqr(
                    dataframe,
                    column,
                )

                self._add_step(
                    f"IQR Outlier Removal ({column})",
                    result,
                )

                # Refresh dataframe after cache update
                dataframe = self._dataset()

            except Exception as error:

                self._warning(
                    f"Outlier removal skipped for '{column}': {error}"
                )

    def _detect_datatypes(self) -> None:
        """
        Detect datatypes of the cleaned dataset.
        """

        try:

            result = DatatypeService.detect(
                self._dataset()
            )

            self._add_step(
                "Datatype Detection",
                result,
            )

        except Exception as error:

            self._warning(
                f"Datatype detection failed: {error}"
            )
    def _quality_assessment(self) -> None:
        """
        Calculate dataset quality after cleaning.
        """

        try:

            result = QualityService.calculate(
                self._dataset()
            )

            self._report["quality"] = result

            self._add_step(
                "Dataset Quality",
                result,
            )

        except Exception as error:

            self._error(
                f"Quality assessment failed: {error}"
            )

    def execute(self) -> dict[str, Any]:
        """
        Execute the complete automated cleaning workflow.
        """

        try:

            self._handle_missing_values()

            self._remove_duplicates()

            self._remove_outliers()

            self._detect_datatypes()

            self._quality_assessment()

            self._report["cleaning_history"] = (
                self._history()
            )

            self._report["summary"] = {
                "steps_completed": len(
                    self._report["steps"]
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