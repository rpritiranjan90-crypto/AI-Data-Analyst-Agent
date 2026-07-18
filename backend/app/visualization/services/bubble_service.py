from __future__ import annotations

from pathlib import Path

import matplotlib.pyplot as plt
import pandas as pd

from app.visualization.base_chart import BaseChart
from app.visualization.builders.relationship_builder import (
    RelationshipBuilder,
)
from app.visualization.color_palettes import ColorPalette


class BubbleChartService(BaseChart):
    """
    Enterprise Bubble Chart Service.

    Creates a bubble chart using three numerical variables.
    """

    @classmethod
    def create(
        cls,
        dataframe: pd.DataFrame,
        x_column: str,
        y_column: str,
        size_column: str,
        output_path: Path,
        title: str = "Bubble Chart",
        palette: str | None = None,
        alpha: float = 0.6,
        scale: float = 30.0,
    ) -> Path:
        """
        Generate a bubble chart.

        Args:
            dataframe: Source DataFrame.
            x_column: X-axis column.
            y_column: Y-axis column.
            size_column: Bubble size column.
            output_path: Output image path.
            title: Chart title.
            palette: Matplotlib colormap.
            alpha: Bubble transparency.
            scale: Bubble size multiplier.

        Returns:
            Path to the saved chart.
        """

        data = RelationshipBuilder.prepare(
            dataframe,
            x_column,
            y_column,
            size_column,
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
            s=data[size_column] * scale,
            alpha=alpha,
            color=color,
            edgecolors="black",
            linewidths=0.5,
        )

        return cls.save(output_path)