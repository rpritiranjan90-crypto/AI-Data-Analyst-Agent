from __future__ import annotations

from pathlib import Path

import matplotlib.pyplot as plt
import pandas as pd

from app.visualization.base_chart import BaseChart
from app.visualization.builders.relationship_builder import (
    RelationshipBuilder,
)
from app.visualization.color_palettes import ColorPalette


class HexbinService(BaseChart):
    """
    Enterprise Hexbin Plot Service.

    Creates a hexagonal binning plot to visualize the density
    of two numerical variables.
    """

    @classmethod
    def create(
        cls,
        dataframe: pd.DataFrame,
        x_column: str,
        y_column: str,
        output_path: Path,
        title: str = "Hexbin Plot",
        palette: str | None = None,
        gridsize: int = 30,
        mincnt: int = 1,
    ) -> Path:
        """
        Generate a hexbin plot.

        Args:
            dataframe: Source DataFrame.
            x_column: X-axis column.
            y_column: Y-axis column.
            output_path: Output image path.
            title: Chart title.
            palette: Matplotlib colormap.
            gridsize: Number of hexagons across the x-axis.
            mincnt: Minimum observations required to color a hexagon.

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

        cmap = plt.get_cmap(
            ColorPalette.get(palette)
        )

        hb = plt.hexbin(
            data[x_column],
            data[y_column],
            gridsize=gridsize,
            cmap=cmap,
            mincnt=mincnt,
        )

        plt.colorbar(
            hb,
            label="Count",
        )

        return cls.save(output_path)