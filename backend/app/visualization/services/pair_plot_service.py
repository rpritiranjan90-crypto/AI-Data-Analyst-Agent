from __future__ import annotations

from pathlib import Path

import matplotlib.pyplot as plt
import pandas as pd
from pandas.plotting import scatter_matrix

from app.visualization.base_chart import BaseChart
from app.visualization.builders.matrix_builder import MatrixBuilder
from app.visualization.color_palettes import ColorPalette


class PairPlotService(BaseChart):
    """
    Enterprise Pair Plot Service.

    Creates a pair plot for exploring relationships among
    multiple numerical variables.
    """

    @classmethod
    def create(
        cls,
        dataframe: pd.DataFrame,
        output_path: Path,
        title: str = "Pair Plot",
        columns: list[str] | None = None,
        palette: str | None = None,
        alpha: float = 0.7,
        diagonal: str = "hist",
        figsize: tuple[int, int] = (12, 12),
    ) -> Path:
        """
        Generate a pair plot.

        Args:
            dataframe: Source DataFrame.
            output_path: Output image path.
            title: Plot title.
            columns: Numeric columns to include.
            palette: Color palette.
            alpha: Marker transparency.
            diagonal: "hist" or "kde".
            figsize: Figure size.

        Returns:
            Path to the saved chart.
        """

        numeric_df = MatrixBuilder.numeric_dataframe(dataframe)

        if columns is not None:
            missing = [
                column
                for column in columns
                if column not in numeric_df.columns
            ]

            if missing:
                raise ValueError(
                    f"Columns not found: {', '.join(missing)}"
                )

            numeric_df = numeric_df[columns]

        if numeric_df.shape[1] < 2:
            raise ValueError(
                "Pair plot requires at least two numeric columns."
            )

        plt.clf()

        color = plt.get_cmap(
            ColorPalette.get(palette)
        )(0.6)

        scatter_matrix(
            numeric_df,
            alpha=alpha,
            diagonal=diagonal,
            figsize=figsize,
            color=color,
            grid=True,
        )

        plt.suptitle(
            title,
            fontsize=16,
            fontweight="bold",
            y=1.02,
        )

        plt.tight_layout()

        return cls.save(output_path)