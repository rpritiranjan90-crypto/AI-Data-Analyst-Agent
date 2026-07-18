from __future__ import annotations

from app.visualization.chart_registry import ChartRegistry


class ChartFactory:
    """
    Enterprise Chart Factory.

    Responsibilities:
    - Create chart instances
    - Validate chart types
    - Expose supported charts

    The factory delegates chart creation to the
    registered chart service and does not depend
    on any concrete chart implementation.
    """

    @classmethod
    def create(
        cls,
        chart_type: str,
        **kwargs,
    ):
        """
        Create a chart using the registered service.

        Args:
            chart_type: Registered chart name.
            **kwargs: Parameters required by the chart.

        Returns:
            Path to the generated chart.
        """

        chart = ChartRegistry.get(chart_type)

        if chart is None:
            supported = ", ".join(
                ChartRegistry.supported()
            )

            raise ValueError(
                f"Unsupported chart type '{chart_type}'. "
                f"Supported charts: {supported}"
            )

        return chart.create(**kwargs)

    @classmethod
    def supported_charts(cls):
        """
        Return all supported chart names.
        """

        return ChartRegistry.supported()