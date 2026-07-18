from __future__ import annotations

from pathlib import Path

import matplotlib.pyplot as plt
import pandas as pd

from app.visualization.base_chart import BaseChart
from app.visualization.builders.categorical_builder import (
    CategoricalBuilder,
)
from app.visualization.color_palettes import ColorPalette


class SunburstService(BaseChart):
    """
    Enterprise Sunburst Chart Service.

    Creates a radial hierarchical visualization for
    categorical distributions.

    Note:
        Matplotlib does not natively support true sunburst charts.
        This implementation provides a sunburst-like radial chart.
        For fully hierarchical sunburst charts, Plotly is recommended.
    """

    @classmethod
    def create(
        cls,
        dataframe: pd.DataFrame,
        column: str,
        output_path: Path,
        title: str = "Sunburst Chart",
        top_n: int = 12,
        palette: str | None = None,
    ) -> Path:
        """
        Generate a sunburst-style radial chart.

        Args:
            dataframe: Source DataFrame.
            column: Categorical column.
            output_path: Output image path.
            title: Chart title.
            top_n: Number of categories.
            palette: Matplotlib palette.

        Returns:
            Path to saved chart.
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

        cmap = plt.get_cmap(
            ColorPalette.get(palette)
        )

        colors = [
            cmap(i / max(len(counts) - 1, 1))
            for i in range(len(counts))
        ]

        plt.pie(
            counts.values,
            labels=counts.index.astype(str),
            colors=colors,
            startangle=90,
            radius=1.0,
            wedgeprops={
                "width": 0.45,
                "edgecolor": "white",
                "linewidth": 2,
            },
            autopct="%1.1f%%",
        )

        plt.axis("equal")

        return cls.save(output_path)