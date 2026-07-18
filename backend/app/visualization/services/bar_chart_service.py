from __future__ import annotations

from pathlib import Path

import matplotlib.pyplot as plt
import pandas as pd

from app.visualization.base_chart import BaseChart
from app.visualization.builders.categorical_builder import CategoricalBuilder
from app.visualization.color_palettes import ColorPalette


class BarChartService(BaseChart):
    """
    Enterprise Bar Chart Service.

    Creates a professional bar chart for categorical data.
    """

    @classmethod
    def create(
        cls,
        dataframe: pd.DataFrame,
        column: str,
        output_path: Path,
        title: str = "Bar Chart",
        top_n: int = 10,
        palette: str | None = None,
    ) -> Path:
        """
        Generate a bar chart.

        Args:
            dataframe: Source DataFrame.
            column: Categorical column to visualize.
            output_path: Output image path.
            title: Chart title.
            top_n: Number of top categories to display.
            palette: Optional matplotlib color palette.

        Returns:
            Path to the saved chart image.
        """

        counts = CategoricalBuilder.prepare(
            dataframe=dataframe,
            column=column,
            top_n=top_n,
        )

        cls.configure(
            title=title,
            xlabel=column,
            ylabel="Count",
        )

        colors = plt.get_cmap(
            ColorPalette.get(palette)
        )(range(len(counts)))

        plt.bar(
            counts.index.astype(str),
            counts.values,
            color=colors,
            edgecolor="black",
            linewidth=0.8,
        )

        plt.xticks(
            rotation=45,
            ha="right",
        )

        return cls.save(output_path)