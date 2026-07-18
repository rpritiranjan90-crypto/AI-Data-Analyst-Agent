from __future__ import annotations

from pathlib import Path

import matplotlib.pyplot as plt
import pandas as pd

from app.visualization.base_chart import BaseChart
from app.visualization.builders.numerical_builder import (
    NumericalBuilder,
)
from app.visualization.color_palettes import ColorPalette


class KDEService(BaseChart):
    """
    Enterprise Kernel Density Estimation (KDE) Chart Service.

    Creates a smooth probability density visualization for
    numerical data.
    """

    @classmethod
    def create(
        cls,
        dataframe: pd.DataFrame,
        column: str,
        output_path: Path,
        title: str = "Kernel Density Estimation",
        palette: str | None = None,
        fill: bool = True,
    ) -> Path:
        """
        Generate a KDE plot.

        Args:
            dataframe: Source DataFrame.
            column: Numerical column.
            output_path: Output image path.
            title: Chart title.
            palette: Matplotlib color palette.
            fill: Fill the area beneath the KDE curve.

        Returns:
            Path to the saved chart.
        """

        series = NumericalBuilder.prepare(
            dataframe=dataframe,
            column=column,
        )

        cls.configure(
            title=title,
            xlabel=column,
            ylabel="Density",
        )

        color = plt.get_cmap(
            ColorPalette.get(palette)
        )(0.6)

        ax = plt.gca()

        series.plot(
            kind="density",
            ax=ax,
            color=color,
            linewidth=2,
        )

        if fill and ax.lines:
            x = ax.lines[0].get_xdata()
            y = ax.lines[0].get_ydata()

            ax.fill_between(
                x,
                y,
                color=color,
                alpha=0.30,
            )

        return cls.save(output_path)