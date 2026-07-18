from __future__ import annotations

from pathlib import Path

import pandas as pd
import plotly.express as px


class FunnelService:
    """
    Enterprise Funnel Chart Service.

    Creates a funnel chart for visualizing stage-wise
    progression or conversion.
    """

    @classmethod
    def create(
        cls,
        dataframe: pd.DataFrame,
        stage_column: str,
        value_column: str,
        output_path: Path,
        title: str = "Funnel Chart",
    ) -> Path:
        """
        Generate a Funnel chart.

        Args:
            dataframe: Source DataFrame.
            stage_column: Funnel stages.
            value_column: Values for each stage.
            output_path: Output image path.
            title: Chart title.

        Returns:
            Path to saved chart.
        """

        required = [stage_column, value_column]

        missing = [
            column
            for column in required
            if column not in dataframe.columns
        ]

        if missing:
            raise ValueError(
                f"Missing columns: {', '.join(missing)}"
            )

        data = dataframe[required].dropna()

        if data.empty:
            raise ValueError(
                "No data available to generate funnel chart."
            )

        fig = px.funnel(
            data_frame=data,
            y=stage_column,
            x=value_column,
            title=title,
        )

        fig.update_layout(
            showlegend=False,
            template="plotly_white",
        )

        fig.write_image(
            str(output_path),
            scale=2,
        )

        return output_path