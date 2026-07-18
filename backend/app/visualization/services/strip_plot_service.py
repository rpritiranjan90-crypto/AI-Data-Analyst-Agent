from __future__ import annotations

from pathlib import Path

import matplotlib.pyplot as plt
import numpy as np
import pandas as pd

from app.visualization.base_chart import BaseChart
from app.visualization.builders.numerical_builder import (
    NumericalBuilder,
)
from app.visualization.color_palettes import ColorPalette


class StripPlotService(BaseChart):
    """
    Enterprise Strip Plot Service.

    Creates a strip plot showing the distribution of
    individual observations for a numerical variable.
    """

    @classmethod
    def create(
        cls,
        dataframe: pd.DataFrame,
        column: str,
        output_path: Path,
        title: str = "Strip Plot",
        palette: str | None = None,
        alpha: float = 0.7,
        jitter: float = 0.15,
        marker_size: int = 40,
        remove_outliers: bool = False,
    ) -> Path:
        """
        Generate a strip plot.

        Args:
            dataframe: Source DataFrame.
            column: Numerical column.
            output_path: Output image path.
            title: Chart title.
            palette: Matplotlib color palette.
            alpha: Marker transparency.
            jitter: Horizontal jitter amount.
            marker_size: Marker size.
            remove_outliers: Remove outliers before plotting.

        Returns:
            Path to the saved chart.
        """

        series = NumericalBuilder.prepare(
            dataframe=dataframe,
            column=column,
            remove_outliers=remove_outliers,
        )

        cls.configure(
            title=title,
            xlabel="",
            ylabel=column,
        )

        color = plt.get_cmap(
            ColorPalette.get(palette)
        )(0.6)

        rng = np.random.default_rng()

        x = rng.normal(
            loc=0,
            scale=jitter,
            size=len(series),
        )

        plt.scatter(
            x,
            series,
            s=marker_size,
            color=color,
            alpha=alpha,
            edgecolors="black",
            linewidths=0.5,
        )

        plt.xticks([0], [column])

        return cls.save(output_path)