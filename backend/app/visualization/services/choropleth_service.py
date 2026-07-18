from __future__ import annotations

from pathlib import Path

import pandas as pd
import plotly.express as px


class ChoroplethService:
    """
    Enterprise Choropleth Map Service.

    Creates a choropleth map for geographical data.
    """

    @classmethod
    def create(
        cls,
        dataframe: pd.DataFrame,
        location_column: str,
        value_column: str,
        output_path: Path,
        title: str = "Choropleth Map",
        location_mode: str = "ISO-3",
        color_scale: str = "Blues",
    ) -> Path:
        """
        Generate a choropleth map.

        Args:
            dataframe: Source DataFrame.
            location_column: Country/region codes.
            value_column: Numeric values.
            output_path: Output image path.
            title: Chart title.
            location_mode: ISO-3, USA-states, country names.
            color_scale: Plotly colorscale.

        Returns:
            Path to saved image.
        """

        required = [
            location_column,
            value_column,
        ]

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
                "No data available."
            )

        fig = px.choropleth(
            data_frame=data,
            locations=location_column,
            color=value_column,
            locationmode=location_mode,
            color_continuous_scale=color_scale,
            title=title,
        )

        fig.update_layout(
            template="plotly_white",
            margin=dict(
                l=20,
                r=20,
                t=60,
                b=20,
            ),
        )

        fig.write_image(
            str(output_path),
            scale=2,
        )

        return output_path