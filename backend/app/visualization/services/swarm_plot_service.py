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


class SwarmPlotService(BaseChart):
    """
    Enterprise Swarm Plot Service.

    Creates a swarm plot showing individual observations
    while reducing point overlap.
    """

    @classmethod
    def create(
        cls,
        dataframe: pd.DataFrame,
        column: str,
        output_path: Path,
        title: str = "Swarm Plot",
        palette: str | None = None,
        alpha: float = 0.75,
        marker_size: int = 45,
        spread: float = 0.25,
        remove_outliers: bool = False,
    ) -> Path:
        """
        Generate a swarm plot.

        Args:
            dataframe: Source DataFrame.
            column: Numerical column.
            output_path: Output image path.
            title: Chart title.
            palette: Matplotlib color palette.
            alpha: Marker transparency.
            marker_size: Marker size.
            spread: Horizontal spread.
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

        values = np.sort(series.to_numpy())

        x = np.zeros(len(values))

        previous = {}

        for i, value in enumerate(values):

            key = round(float(value), 2)

            offset = previous.get(key, 0)

            if offset == 0:
                x[i] = 0
            else:
                direction = -1 if offset % 2 else 1
                level = (offset + 1) // 2
                x[i] = direction * level * spread

            previous[key] = offset + 1

        plt.scatter(
            x,
            values,
            s=marker_size,
            color=color,
            alpha=alpha,
            edgecolors="black",
            linewidths=0.5,
        )

        plt.xticks([0], [column])

        return cls.save(output_path)