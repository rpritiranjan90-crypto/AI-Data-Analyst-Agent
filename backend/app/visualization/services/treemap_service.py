from __future__ import annotations

from pathlib import Path

import matplotlib.pyplot as plt
import pandas as pd
import squarify

from app.visualization.base_chart import BaseChart
from app.visualization.builders.categorical_builder import (
    CategoricalBuilder,
)
from app.visualization.color_palettes import ColorPalette


class TreemapService(BaseChart):
    """
    Enterprise Treemap Service.

    Creates a treemap visualization for categorical data.

    Suitable for:
        • Category comparison
        • Hierarchical visualization
        • Dashboard summaries
        • Business intelligence reports
    """

    @classmethod
    def create(
        cls,
        dataframe: pd.DataFrame,
        column: str,
        output_path: Path,
        title: str = "Treemap",
        top_n: int = 15,
        palette: str | None = None,
        alpha: float = 0.9,
    ) -> Path:
        """
        Generate a treemap.

        Args:
            dataframe: Source DataFrame.
            column: Categorical column.
            output_path: Output image path.
            title: Chart title.
            top_n: Maximum number of categories.
            palette: Matplotlib color palette.
            alpha: Rectangle transparency.

        Returns:
            Path to the saved chart.
        """

        counts = CategoricalBuilder.prepare(
            dataframe=dataframe,
            column=column,
            top_n=top_n,
        )

        if counts.empty:
            raise ValueError(
                "No data available to generate treemap."
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

        color_steps = max(len(counts) - 1, 1)

        colors = [
            cmap(i / color_steps)
            for i in range(len(counts))
        ]

        squarify.plot(
            sizes=counts.values,
            label=[
                f"{label}\n{value}"
                for label, value in zip(
                    counts.index.astype(str),
                    counts.values,
                )
            ],
            color=colors,
            alpha=alpha,
            edgecolor="white",
            linewidth=2,
        )

        ax = plt.gca()
        ax.set_axis_off()

        return cls.save(output_path)