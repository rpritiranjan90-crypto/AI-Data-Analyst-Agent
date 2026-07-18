from __future__ import annotations

from pathlib import Path

import matplotlib.pyplot as plt
import pandas as pd

from app.visualization.base_chart import BaseChart
from app.visualization.builders.numerical_builder import NumericalBuilder
from app.visualization.color_palettes import ColorPalette


class HistogramService(BaseChart):
    """
    Enterprise Histogram Service.

    Creates a professional histogram for numerical data.
    """

    @classmethod
    def create(
        cls,
        dataframe: pd.DataFrame,
        column: str,
        output_path: Path,
        title: str = "Histogram",
        bins: int = 20,
        palette: str | None = None,
    ) -> Path:
        """
        Generate a histogram.

        Args:
            dataframe: Source DataFrame.
            column: Numerical column to visualize.
            output_path: Output image path.
            title: Chart title.
            bins: Number of histogram bins.
            palette: Optional matplotlib color palette.

        Returns:
            Path to the saved chart.
        """

        data = NumericalBuilder.prepare(
            dataframe=dataframe,
            column=column,
        )

        cls.configure(
            title=title,
            xlabel=column,
            ylabel="Frequency",
        )

        plt.hist(
            data,
            bins=bins,
            color=plt.get_cmap(
                ColorPalette.get(palette)
            )(0.6),
            edgecolor="black",
            linewidth=0.8,
        )

        return cls.save(output_path)