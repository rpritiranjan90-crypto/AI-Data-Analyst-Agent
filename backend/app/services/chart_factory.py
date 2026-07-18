from __future__ import annotations

from app.visualization.chart_registry import ChartRegistry


class ChartFactory:
    """
    Enterprise Chart Factory.

    Responsibilities
    ----------------
    • Resolve chart services
    • Delegate chart creation
    • Expose supported charts

    The registry owns all chart registrations.
    """

    @classmethod
    def create(
        cls,
        chart_type: str,
        dataframe,
        **kwargs
    ):

        chart_service = ChartRegistry.get(
            chart_type
        )

        return chart_service.create(
            dataframe=dataframe,
            **kwargs
        )

    @classmethod
    def supported_charts(cls):

        return ChartRegistry.supported()