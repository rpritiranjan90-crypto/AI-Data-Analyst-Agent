from __future__ import annotations

from typing import Any

from app.common.logger import get_logger
from app.common.timing import measure_time

from app.exceptions.base import ValidationException

from app.visualization.chart_registry import ChartRegistry
from app.visualization.visualization_pipeline import (
    VisualizationPipeline,
)

logger = get_logger(__name__)


class VisualizationEngine:
    """
    Enterprise Visualization Engine.

    Responsibilities
    ----------------
    - Validate chart type
    - Execute visualization pipeline
    - Expose supported charts
    """

    @staticmethod
    @measure_time
    def create_chart(
        chart_type: str,
        **kwargs: Any,
    ) -> Any:
        """
        Generate a visualization.

        Parameters
        ----------
        chart_type : str
            Registered chart name.

        **kwargs
            Chart-specific arguments.

        Returns
        -------
        Any
            Visualization pipeline response.
        """

        logger.info(
            "Creating '%s' visualization.",
            chart_type,
        )

        if not ChartRegistry.exists(chart_type):

            logger.warning(
                "Unsupported chart requested: %s",
                chart_type,
            )

            raise ValidationException(
                f"Unsupported chart type: '{chart_type}'."
            )

        result = VisualizationPipeline.run(
            chart_type=chart_type,
            **kwargs,
        )

        logger.info(
            "Visualization '%s' generated successfully.",
            chart_type,
        )

        return result

    @staticmethod
    @measure_time
    def supported_charts() -> list[str]:
        """
        Return all registered chart types.
        """

        logger.info(
            "Retrieving supported chart types."
        )

        charts = sorted(
            ChartRegistry.list_charts()
        )

        logger.info(
            "%d chart types available.",
            len(charts),
        )

        return charts