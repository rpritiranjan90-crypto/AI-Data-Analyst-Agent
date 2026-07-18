from __future__ import annotations

from app.services.dataset_service import DatasetService
from app.services.descriptive_service import DescriptiveService
from app.services.correlation_service import CorrelationService
from app.services.categorical_service import CategoricalService
from app.services.distribution_service import DistributionService
from app.services.insight_service import InsightService
from app.services.timeseries_service import TimeSeriesService


class AnalysisEngine:
    """
    Enterprise Analysis Orchestrator.
    """

    @staticmethod
    def descriptive():

        df = DatasetService.get_dataset()

        return DescriptiveService.analyze(df)

    @staticmethod
    def correlation(
        method: str = "pearson"
    ):

        df = DatasetService.get_dataset()

        return CorrelationService.analyze(
            df,
            method
        )

    @staticmethod
    def strong_correlations():

        df = DatasetService.get_dataset()

        return CorrelationService.strong_correlations(df)

    @staticmethod
    def categorical():

        df = DatasetService.get_dataset()

        return CategoricalService.analyze(df)

    @staticmethod
    def distribution():

        df = DatasetService.get_dataset()

        return DistributionService.analyze(df)

    @staticmethod
    def insights():

        df = DatasetService.get_dataset()

        return InsightService.generate(df)

    @staticmethod
    def timeseries():

        df = DatasetService.get_dataset()

        return TimeSeriesService.analyze(df)

    @staticmethod
    def summary():

        df = DatasetService.get_dataset()

        return {

            "descriptive": DescriptiveService.analyze(df),

            "correlation": CorrelationService.analyze(df),

            "categorical": CategoricalService.analyze(df),

            "distribution": DistributionService.analyze(df),

            "timeseries": TimeSeriesService.analyze(df),

            "insights": InsightService.generate(df)
        }