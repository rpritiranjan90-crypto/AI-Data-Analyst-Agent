from __future__ import annotations

from app.visualization.chart_registry import ChartRegistry


import inspect

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

        sig = inspect.signature(chart.create)
        params = sig.parameters
        accepts_var_kwargs = any(p.kind == inspect.Parameter.VAR_KEYWORD for p in params.values())

        if not accepts_var_kwargs:
            if "column" in params and "x_column" in kwargs and "column" not in kwargs:
                kwargs["column"] = kwargs["x_column"]
            if "x_column" in params and "column" in kwargs and "x_column" not in kwargs:
                kwargs["x_column"] = kwargs["column"]

            valid_kwargs = {k: v for k, v in kwargs.items() if k in params}
            return chart.create(**valid_kwargs)

        return chart.create(**kwargs)

    @classmethod
    def supported_charts(cls):
        """
        Return all supported chart names.
        """

        return ChartRegistry.supported()