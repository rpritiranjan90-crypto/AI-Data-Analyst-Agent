from __future__ import annotations

from typing import Any

from app.services.dataset_service import DatasetService
from app.services.missing_value_service import MissingValueService
from app.services.duplicate_service import DuplicateService
from app.services.outlier_service import OutlierService
from app.services.datatype_service import DatatypeService
from app.services.quality_service import QualityService
from app.services.cleaning_history import CleaningHistory


class CleaningService:
    """
    Enterprise Cleaning Orchestrator.

    This service coordinates all cleaning operations.
    """

    @staticmethod
    def fill_missing(
        column: str,
        method: str,
        value: Any = None
    ):

        df = DatasetService.get_dataset()

        return MissingValueService.fill(
            df,
            column,
            method,
            value
        )

    @staticmethod
    def drop_missing_rows():

        df = DatasetService.get_dataset()

        return MissingValueService.drop_rows(df)

    @staticmethod
    def drop_missing_columns():

        df = DatasetService.get_dataset()

        return MissingValueService.drop_columns(df)

    @staticmethod
    def remove_duplicates():

        df = DatasetService.get_dataset()

        return DuplicateService.remove_duplicates(df)

    @staticmethod
    def duplicate_count():

        df = DatasetService.get_dataset()

        return DuplicateService.get_duplicate_count(df)

    @staticmethod
    def remove_iqr_outliers(column: str):

        df = DatasetService.get_dataset()

        return OutlierService.remove_iqr(
            df,
            column
        )

    @staticmethod
    def remove_zscore_outliers(
        column: str,
        threshold: float = 3.0
    ):

        df = DatasetService.get_dataset()

        return OutlierService.remove_zscore(
            df,
            column,
            threshold
        )

    @staticmethod
    def convert_datatype(
        column: str,
        datatype: str
    ):

        df = DatasetService.get_dataset()

        return DatatypeService.convert(
            df,
            column,
            datatype
        )

    @staticmethod
    def dataset_quality():

        df = DatasetService.get_dataset()

        return QualityService.calculate(df)

    @staticmethod
    def cleaning_history():

        return CleaningHistory.get_history()