from __future__ import annotations

from pathlib import Path
from typing import Any

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
        output_path: Path,
        column: str | None = None,
        x_column: str | None = None,
        title: str = "Bar Chart",
        top_n: int = 10,
        palette: str | None = None,
        **kwargs: Any,
    ) -> Path:
        """
        Generate a bar chart.
        """
        target_column = x_column or column
        if not target_column:
            target_column = dataframe.columns[0]

        counts = CategoricalBuilder.prepare(
            dataframe=dataframe,
            column=target_column,
            top_n=top_n,
        )

        cls.configure(
            title=title,
            xlabel=target_column,
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