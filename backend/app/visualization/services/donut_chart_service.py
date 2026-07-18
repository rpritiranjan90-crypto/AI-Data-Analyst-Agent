from __future__ import annotations

from pathlib import Path

import matplotlib.pyplot as plt
import pandas as pd

from app.visualization.base_chart import BaseChart
from app.visualization.builders.categorical_builder import CategoricalBuilder
from app.visualization.color_palettes import ColorPalette


class DonutChartService(BaseChart):
    """
    Enterprise Donut Chart Service.

    Creates a professional donut chart for categorical data.
    """

    @classmethod
    def create(
        cls,
        dataframe: pd.DataFrame,
        column: str,
        output_path: Path,
        title: str = "Donut Chart",
        top_n: int = 10,
        palette: str | None = None,
    ) -> Path:
        """
        Generate a donut chart.

        Args:
            dataframe: Source DataFrame.
            column: Categorical column.
            output_path: Output image path.
            title: Chart title.
            top_n: Maximum number of categories.
            palette: Matplotlib color palette.

        Returns:
            Path to the saved chart.
        """

        counts = CategoricalBuilder.prepare(
            dataframe=dataframe,
            column=column,
            top_n=top_n,
        )

        cls.configure(
            title=title,
            xlabel="",
            ylabel="",
            grid=False,
        )

        colors = plt.get_cmap(
            ColorPalette.get(palette)
        )(range(len(counts)))

        plt.pie(
            counts.values,
            labels=counts.index.astype(str),
            autopct="%1.1f%%",
            startangle=90,
            colors=colors,
            wedgeprops={
                "width": 0.35,
                "edgecolor": "white",
                "linewidth": 1,
            },
        )

        plt.axis("equal")

        return cls.save(output_path)