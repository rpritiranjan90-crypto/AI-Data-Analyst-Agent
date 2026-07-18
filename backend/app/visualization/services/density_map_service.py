from __future__ import annotations

from pathlib import Path

import pandas as pd
import plotly.express as px


class DensityMapService:
    """
    Enterprise Density Map Service.

    Creates a geographic density heatmap.
    """

    @classmethod
    def create(
        cls,
        dataframe: pd.DataFrame,
        latitude_column: str,
        longitude_column: str,
        output_path: Path,
        value_column: str | None = None,
        title: str = "Density Map",
        radius: int = 12,
        zoom: int = 2,
    ) -> Path:
        """
        Generate a Density Map.

        Args:
            dataframe: Source DataFrame.
            latitude_column: Latitude column.
            longitude_column: Longitude column.
            output_path: Output image path.
            value_column: Optional weight column.
            title: Chart title.
            radius: Heat radius.
            zoom: Initial zoom level.

        Returns:
            Path to saved chart.
        """

        required = [
            latitude_column,
            longitude_column,
        ]

        if value_column:
            required.append(value_column)

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
                "No geographic data available."
            )

        fig = px.density_map(
            data_frame=data,
            lat=latitude_column,
            lon=longitude_column,
            z=value_column,
            radius=radius,
            zoom=zoom,
            title=title,
            map_style="open-street-map",
        )

        fig.update_layout(
            margin=dict(
                l=10,
                r=10,
                t=50,
                b=10,
            ),
        )

        fig.write_image(
            str(output_path),
            scale=2,
        )

        return output_path