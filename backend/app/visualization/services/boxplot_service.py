from __future__ import annotations

from pathlib import Path

import matplotlib.pyplot as plt
import pandas as pd

from app.visualization.base_chart import BaseChart
from app.visualization.builders.numerical_builder import (
    NumericalBuilder,
)
from app.visualization.color_palettes import ColorPalette


class BoxPlotService(BaseChart):
    """
    Enterprise Box Plot Service.

    Creates a professional box plot for numerical data.
    """

    @classmethod
    def create(
        cls,
        dataframe: pd.DataFrame,
        column: str,
        output_path: Path,
        title: str = "Box Plot",
        palette: str | None = None,
        remove_outliers: bool = False,
        showfliers: bool = True,
    ) -> Path:
        """
        Generate a box plot.

        Args:
            dataframe: Source DataFrame.
            column: Numerical column.
            output_path: Output image path.
            title: Chart title.
            palette: Matplotlib color palette.
            remove_outliers: Remove outliers before plotting.
            showfliers: Display outlier points on the box plot.

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
            xlabel=column,
            ylabel="Values",
        )

        color = plt.get_cmap(
            ColorPalette.get(palette)
        )(0.6)

        plt.boxplot(
            series,
            vert=True,
            patch_artist=True,
            showfliers=showfliers,
            boxprops={
                "facecolor": color,
                "edgecolor": "black",
                "linewidth": 1.2,
            },
            whiskerprops={
                "color": "black",
                "linewidth": 1.2,
            },
            capprops={
                "color": "black",
                "linewidth": 1.2,
            },
            medianprops={
                "color": "red",
                "linewidth": 2,
            },
            flierprops={
                "marker": "o",
                "markersize": 5,
                "markerfacecolor": "red",
                "markeredgecolor": "black",
                "alpha": 0.7,
            },
        )

        return cls.save(output_path)