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


class CleaningService:
    """
    Enterprise Cleaning Orchestrator.
    """

    _dataset_service = DatasetService()

    @classmethod
    def _dataset(cls) -> pd.DataFrame:
        """
        Return the active dataset.
        """
        return cls._dataset_service.get_dataset()

    @classmethod
    def fill_missing(
        cls,
        column: str,
        method: str,
        value: Any = None,
    ) -> dict[str, Any]:

        return MissingValueService.fill(
            cls._dataset(),
            column,
            method,
            value,
        )

    @classmethod
    def drop_missing_rows(cls):

        return MissingValueService.drop_rows(
            cls._dataset()
        )

    @classmethod
    def drop_missing_columns(cls):

        return MissingValueService.drop_columns(
            cls._dataset()
        )

    @classmethod
    def remove_duplicates(cls):

        return DuplicateService.remove_duplicates(
            cls._dataset()
        )

    @classmethod
    def duplicate_count(cls):

        return DuplicateService.get_duplicate_count(
            cls._dataset()
        )

    @classmethod
    def remove_iqr_outliers(
        cls,
        column: str,
    ):

        return OutlierService.remove_iqr(
            cls._dataset(),
            column,
        )

    @classmethod
    def remove_zscore_outliers(
        cls,
        column: str,
        threshold: float = 3.0,
    ):

        return OutlierService.remove_zscore(
            cls._dataset(),
            column,
            threshold,
        )

    @classmethod
    def convert_datatype(
        cls,
        column: str,
        datatype: str,
    ):

        return DatatypeService.convert(
            cls._dataset(),
            column,
            datatype,
        )

    @classmethod
    def dataset_quality(cls):

        return QualityService.calculate(
            cls._dataset()
        )

    @classmethod
    def cleaning_history(cls):

        return CleaningHistory.get_history()


__all__ = [
    "CleaningService",
]