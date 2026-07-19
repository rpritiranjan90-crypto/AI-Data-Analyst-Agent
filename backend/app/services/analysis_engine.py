from __future__ import annotations

from app.services.categorical_service import CategoricalService
from app.services.correlation_service import CorrelationService
from app.services.dataset_service import DatasetService
from app.services.descriptive_service import DescriptiveService
from app.services.distribution_service import DistributionService
from app.services.insight_service import InsightService
from app.services.timeseries_service import TimeSeriesService


class AnalysisEngine:
    """
    Enterprise Analysis Orchestrator.
    """

    _dataset_service = DatasetService()

    @classmethod
    def _get_dataset(cls):
        """
        Return the currently loaded dataset.
        """
        return cls._dataset_service.get_dataset()

    @classmethod
    def descriptive(cls):

        df = cls._get_dataset()

        return DescriptiveService.analyze(df)

    @classmethod
    def correlation(
        cls,
        method: str = "pearson",
    ):

        df = cls._get_dataset()

        return CorrelationService.analyze(
            df,
            method,
        )

    @classmethod
    def strong_correlations(cls):

        df = cls._get_dataset()

        return CorrelationService.strong_correlations(
            df
        )

    @classmethod
    def categorical(cls):

        df = cls._get_dataset()

        return CategoricalService.analyze(df)

    @classmethod
    def distribution(cls):

        df = cls._get_dataset()

        return DistributionService.analyze(df)

    @classmethod
    def insights(cls):

        df = cls._get_dataset()

        return InsightService.generate(df)

    @classmethod
    def timeseries(cls):

        df = cls._get_dataset()

        return TimeSeriesService.analyze(df)

    @classmethod
    def summary(cls):

        df = cls._get_dataset()

        return {
            "descriptive": DescriptiveService.analyze(df),
            "correlation": CorrelationService.analyze(df),
            "categorical": CategoricalService.analyze(df),
            "distribution": DistributionService.analyze(df),
            "timeseries": TimeSeriesService.analyze(df),
            "insights": InsightService.generate(df),
        }


__all__ = [
    "AnalysisEngine",
]