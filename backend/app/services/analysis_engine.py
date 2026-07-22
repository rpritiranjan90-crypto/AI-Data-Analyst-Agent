from __future__ import annotations

from app.common.logger import get_logger
from app.common.timing import measure_time

from app.services.categorical_service import CategoricalService
from app.services.correlation_service import CorrelationService
from app.services.dataset_service import DatasetService
from app.services.descriptive_service import DescriptiveService
from app.services.distribution_service import DistributionService
from app.services.insight_service import InsightService
from app.services.timeseries_service import TimeSeriesService

logger = get_logger(__name__)


class AnalysisEngine:
    """
    Enterprise Analysis Orchestrator.

    Responsibilities
    ----------------
    - Retrieve the active dataset.
    - Delegate analysis to specialized services.
    - Provide a unified interface for analysis routes.
    """

    _dataset_service = DatasetService()

    @classmethod
    def _get_dataset(cls):
        """
        Return the currently loaded dataset.
        """

        logger.info("Retrieving active dataset.")

        return cls._dataset_service.get_dataset()

    @classmethod
    @measure_time
    def descriptive(cls):
        """
        Generate descriptive statistics.
        """

        logger.info("Running descriptive analysis.")

        df = cls._get_dataset()

        return DescriptiveService.analyze(df)

    @classmethod
    @measure_time
    def correlation(
        cls,
        method: str = "pearson",
    ):
        """
        Generate correlation analysis.
        """

        logger.info(
            "Running correlation analysis using '%s'.",
            method,
        )

        df = cls._get_dataset()

        return CorrelationService.analyze(
            df,
            method,
        )

    @classmethod
    @measure_time
    def strong_correlations(cls):
        """
        Detect strong correlations.
        """

        logger.info("Finding strong correlations.")

        df = cls._get_dataset()

        return CorrelationService.strong_correlations(
            df,
        )

    @classmethod
    @measure_time
    def categorical(cls):
        """
        Generate categorical analysis.
        """

        logger.info("Running categorical analysis.")

        df = cls._get_dataset()

        return CategoricalService.analyze(df)

    @classmethod
    @measure_time
    def distribution(cls):
        """
        Generate distribution analysis.
        """

        logger.info("Running distribution analysis.")

        df = cls._get_dataset()

        return DistributionService.analyze(df)

    @classmethod
    @measure_time
    def insights(cls):
        """
        Generate AI insights.
        """

        logger.info("Generating AI insights.")

        df = cls._get_dataset()

        return InsightService.generate(df)

    @classmethod
    @measure_time
    def timeseries(cls):
        """
        Generate time-series analysis.
        """

        logger.info("Running time-series analysis.")

        df = cls._get_dataset()

        return TimeSeriesService.analyze(df)

    @classmethod
    @measure_time
    def summary(cls):
        """
        Generate the complete dataset analysis.
        """

        logger.info("Generating complete dataset summary.")

        df = cls._get_dataset()

        result = {
            "descriptive": DescriptiveService.analyze(df),
            "correlation": CorrelationService.analyze(df),
            "categorical": CategoricalService.analyze(df),
            "distribution": DistributionService.analyze(df),
            "timeseries": TimeSeriesService.analyze(df),
            "insights": InsightService.generate(df),
        }

        logger.info(
            "Complete dataset summary generated successfully."
        )

        return result


__all__ = [
    "AnalysisEngine",
]