from __future__ import annotations

from typing import Any

from app.visualization.chart_registry import ChartRegistry
from app.visualization.visualization_pipeline import VisualizationPipeline


class VisualizationEngine:
    """
    High-level service for generating visualizations.

    Responsibilities:
    - Validate requested chart type
    - Delegate chart generation to the visualization pipeline
    - Expose supported chart types
    """

    @staticmethod
    def create_chart(
        chart_type: str,
        **kwargs: Any,
    ):
        """
        Generate a visualization.

        Args:
            chart_type: Registered chart name.
            **kwargs: Chart-specific arguments.

        Returns:
            Response returned by VisualizationPipeline.
        """

        if not ChartRegistry.exists(chart_type):
            raise ValueError(
                f"Unsupported chart type: '{chart_type}'."
            )

        return VisualizationPipeline.run(
            chart_type=chart_type,
            **kwargs,
        )

    @staticmethod
    def supported_charts() -> list[str]:
        """
        Return all registered chart types.
        """

        return sorted(
            ChartRegistry.list_charts()
        )