from __future__ import annotations

from pathlib import Path

import pandas as pd
import plotly.graph_objects as go


class GaugeService:
    """
    Enterprise Gauge Chart Service.

    Creates a KPI Gauge chart using Plotly.
    """

    @classmethod
    def create(
        cls,
        dataframe: pd.DataFrame | None = None,
        value: float | None = None,
        output_path: Path | None = None,
        title: str = "Gauge Chart",
        minimum: float = 0,
        maximum: float = 100,
        suffix: str = "%",
    ) -> Path:
        """
        Generate a Gauge chart.

        Args:
            dataframe: Unused. Accepted for API compatibility.
            value: Current KPI value.
            output_path: Output image path.
            title: Chart title.
            minimum: Minimum gauge value.
            maximum: Maximum gauge value.
            suffix: Value suffix.

        Returns:
            Path to saved chart.
        """

        if value is None:
            raise ValueError("value is required.")

        if output_path is None:
            raise ValueError("output_path is required.")

        if minimum >= maximum:
            raise ValueError(
                "minimum must be less than maximum."
            )

        if value < minimum or value > maximum:
            raise ValueError(
                f"value must be between {minimum} and {maximum}."
            )

        fig = go.Figure(
            go.Indicator(
                mode="gauge+number",
                value=value,
                number={
                    "suffix": suffix,
                },
                title={
                    "text": title,
                },
                gauge={
                    "axis": {
                        "range": [minimum, maximum],
                    },
                    "bar": {
                        "color": "#1f77b4",
                    },
                    "steps": [
                        {
                            "range": [minimum, maximum * 0.5],
                            "color": "#d9ead3",
                        },
                        {
                            "range": [maximum * 0.5, maximum * 0.8],
                            "color": "#ffe599",
                        },
                        {
                            "range": [maximum * 0.8, maximum],
                            "color": "#f4cccc",
                        },
                    ],
                    "threshold": {
                        "line": {
                            "color": "red",
                            "width": 4,
                        },
                        "thickness": 0.75,
                        "value": value,
                    },
                },
            )
        )

        fig.update_layout(
            template="plotly_white",
            margin=dict(
                l=30,
                r=30,
                t=70,
                b=30,
            ),
        )

        fig.write_image(
            str(output_path),
            scale=2,
        )

        return output_path