from __future__ import annotations

from pathlib import Path

import matplotlib.pyplot as plt
import pandas as pd

from app.visualization.base_chart import BaseChart
from app.visualization.builders.relationship_builder import (
    RelationshipBuilder,
)
from app.visualization.color_palettes import ColorPalette


class ScatterService(BaseChart):
    """
    Enterprise Scatter Plot Service.

    Creates a professional scatter plot showing the relationship
    between two numerical variables.
    """

    @classmethod
    def create(
        cls,
        dataframe: pd.DataFrame,
        x_column: str,
        y_column: str,
        output_path: Path,
        title: str = "Scatter Plot",
        palette: str | None = None,
        alpha: float = 0.7,
        marker: str = "o",
        size: int = 50,
    ) -> Path:
        """
        Generate a scatter plot.

        Args:
            dataframe: Source DataFrame.
            x_column: X-axis column.
            y_column: Y-axis column.
            output_path: Output image path.
            title: Chart title.
            palette: Matplotlib color palette.
            alpha: Marker transparency.
            marker: Scatter marker style.
            size: Marker size.

        Returns:
            Path to the saved chart.
        """

        data = RelationshipBuilder.prepare(
            dataframe,
            x_column,
            y_column,
        )

        cls.configure(
            title=title,
            xlabel=x_column,
            ylabel=y_column,
        )

        color = plt.get_cmap(
            ColorPalette.get(palette)
        )(0.6)

        plt.scatter(
            data[x_column],
            data[y_column],
            s=size,
            color=color,
            alpha=alpha,
            marker=marker,
            edgecolors="black",
            linewidths=0.5,
        )

        return cls.save(output_path)