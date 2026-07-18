from __future__ import annotations

from pathlib import Path

import matplotlib.pyplot as plt
import pandas as pd

from app.visualization.base_chart import BaseChart
from app.visualization.builders.numerical_builder import (
    NumericalBuilder,
)
from app.visualization.color_palettes import ColorPalette


class ViolinPlotService(BaseChart):
    """
    Enterprise Violin Plot Service.

    Creates a violin plot for numerical distributions,
    combining a box plot with kernel density estimation.
    """

    @classmethod
    def create(
        cls,
        dataframe: pd.DataFrame,
        column: str,
        output_path: Path,
        title: str = "Violin Plot",
        palette: str | None = None,
        show_medians: bool = True,
        show_extrema: bool = True,
        show_means: bool = False,
        remove_outliers: bool = False,
    ) -> Path:
        """
        Generate a violin plot.

        Args:
            dataframe: Source DataFrame.
            column: Numeric column.
            output_path: Output image path.
            title: Chart title.
            palette: Matplotlib color palette.
            show_medians: Show median line.
            show_extrema: Show min/max values.
            show_means: Show mean value.
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

        violin = plt.violinplot(
            dataset=series,
            showmeans=show_means,
            showmedians=show_medians,
            showextrema=show_extrema,
        )

        for body in violin["bodies"]:
            body.set_facecolor(color)
            body.set_edgecolor("black")
            body.set_alpha(0.8)

        return cls.save(output_path)