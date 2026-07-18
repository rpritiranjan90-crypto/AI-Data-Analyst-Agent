from __future__ import annotations

from pathlib import Path

import matplotlib.pyplot as plt
import pandas as pd
from mpl_toolkits.mplot3d import Axes3D  # noqa: F401

from app.visualization.base_chart import BaseChart
from app.visualization.builders.relationship_builder import (
    RelationshipBuilder,
)
from app.visualization.color_palettes import ColorPalette


class Scatter3DService(BaseChart):
    """
    Enterprise 3D Scatter Plot Service.

    Creates a three-dimensional scatter plot for
    visualizing relationships among three numerical variables.
    """

    @classmethod
    def create(
        cls,
        dataframe: pd.DataFrame,
        x_column: str,
        y_column: str,
        z_column: str,
        output_path: Path,
        title: str = "3D Scatter Plot",
        palette: str | None = None,
        marker: str = "o",
        size: int = 50,
        alpha: float = 0.75,
    ) -> Path:
        """
        Generate a 3D scatter plot.

        Args:
            dataframe: Source DataFrame.
            x_column: X-axis column.
            y_column: Y-axis column.
            z_column: Z-axis column.
            output_path: Output image path.
            title: Chart title.
            palette: Matplotlib color palette.
            marker: Marker style.
            size: Marker size.
            alpha: Marker transparency.

        Returns:
            Path to the saved chart.
        """

        data = RelationshipBuilder.prepare(
            dataframe,
            x_column,
            y_column,
            z_column,
        )

        plt.clf()

        fig = plt.figure(figsize=(10, 8))
        ax = fig.add_subplot(
            111,
            projection="3d",
        )

        color = plt.get_cmap(
            ColorPalette.get(palette)
        )(0.6)

        ax.scatter(
            data[x_column],
            data[y_column],
            data[z_column],
            c=[color],
            s=size,
            marker=marker,
            alpha=alpha,
            edgecolors="black",
            linewidths=0.5,
        )

        ax.set_title(
            title,
            fontsize=16,
            fontweight="bold",
        )

        ax.set_xlabel(x_column)
        ax.set_ylabel(y_column)
        ax.set_zlabel(z_column)

        plt.tight_layout()

        return cls.save(output_path)