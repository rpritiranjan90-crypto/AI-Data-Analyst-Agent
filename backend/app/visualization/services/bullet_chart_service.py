from __future__ import annotations

from pathlib import Path

import pandas as pd
import plotly.graph_objects as go


class BulletChartService:
    """
    Enterprise Bullet Chart Service.

    Creates a Bullet Chart for KPI comparison.
    """

    @classmethod
    def create(
        cls,
        dataframe: pd.DataFrame | None = None,
        actual: float | None = None,
        value: float | None = None,
        target: float | None = None,
        output_path: Path | None = None,
        title: str = "Bullet Chart",
        minimum: float = 0,
        maximum: float = 100,
    ) -> Path:
        """
        Generate a Bullet Chart.

        Args:
            dataframe: Unused. Accepted for API compatibility.
            actual: Actual KPI value.
            value: Alias for actual.
            target: Target KPI value.
            output_path: Output image path.
            title: Chart title.
            minimum: Minimum axis value.
            maximum: Maximum axis value.

        Returns:
            Path to the saved chart.
        """

        # Keep compatibility with the API payload
        if actual is None:
            actual = value

        if actual is None:
            raise ValueError(
                "actual (or value) is required."
            )

        if target is None:
            raise ValueError(
                "target is required."
            )

        if output_path is None:
            raise ValueError(
                "output_path is required."
            )

        if minimum >= maximum:
            raise ValueError(
                "minimum must be less than maximum."
            )

        if not minimum <= actual <= maximum:
            raise ValueError(
                "actual must be within the specified range."
            )

        if not minimum <= target <= maximum:
            raise ValueError(
                "target must be within the specified range."
            )

        fig = go.Figure(
            go.Indicator(
                mode="number+gauge",
                value=actual,
                title={
                    "text": title,
                },
                gauge={
                    "shape": "bullet",
                    "axis": {
                        "range": [minimum, maximum],
                    },
                    "threshold": {
                        "line": {
                            "color": "red",
                            "width": 3,
                        },
                        "value": target,
                    },
                    "steps": [
                        {
                            "range": [minimum, maximum * 0.5],
                            "color": "#e8f5e9",
                        },
                        {
                            "range": [maximum * 0.5, maximum * 0.8],
                            "color": "#fff3cd",
                        },
                        {
                            "range": [maximum * 0.8, maximum],
                            "color": "#fdecea",
                        },
                    ],
                    "bar": {
                        "color": "#1f77b4",
                    },
                },
            )
        )

        fig.update_layout(
            template="plotly_white",
            margin=dict(
                l=50,
                r=50,
                t=60,
                b=40,
            ),
            height=220,
        )

        fig.write_image(
            str(output_path),
            scale=2,
        )

        return output_path