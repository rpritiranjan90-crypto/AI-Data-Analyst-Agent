from __future__ import annotations

from pathlib import Path

import matplotlib.pyplot as plt
import pandas as pd

from app.visualization.base_chart import BaseChart
from app.visualization.builders.relationship_builder import (
    RelationshipBuilder,
)
from app.visualization.color_palettes import ColorPalette


class AreaChartService(BaseChart):
    """
    Enterprise Area Chart Service.

    Creates a professional area chart showing the trend between
    two numerical variables.
    """

    @classmethod
    def create(
        cls,
        dataframe: pd.DataFrame,
        x_column: str,
        y_column: str,
        output_path: Path,
        title: str = "Area Chart",
        palette: str | None = None,
        alpha: float = 0.6,
        linewidth: float = 2.0,
    ) -> Path:
        """
        Generate an area chart.

        Args:
            dataframe: Source DataFrame.
            x_column: X-axis column.
            y_column: Y-axis column.
            output_path: Output image path.
            title: Chart title.
            palette: Matplotlib color palette.
            alpha: Area transparency.
            linewidth: Outline line width.

        Returns:
            Path to the saved chart.
        """

        data = RelationshipBuilder.prepare(
            dataframe,
            x_column,
            y_column,
            sort_by=x_column,
        )

        cls.configure(
            title=title,
            xlabel=x_column,
            ylabel=y_column,
        )

        color = plt.get_cmap(
            ColorPalette.get(palette)
        )(0.6)

        plt.fill_between(
            data[x_column],
            data[y_column],
            color=color,
            alpha=alpha,
        )

        plt.plot(
            data[x_column],
            data[y_column],
            color=color,
            linewidth=linewidth,
        )

        return cls.save(output_path)