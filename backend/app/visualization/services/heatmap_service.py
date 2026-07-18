from __future__ import annotations

from pathlib import Path

import matplotlib.pyplot as plt
import pandas as pd

from app.visualization.base_chart import BaseChart
from app.visualization.builders.matrix_builder import MatrixBuilder
from app.visualization.color_palettes import ColorPalette


class HeatmapService(BaseChart):
    """
    Enterprise Correlation Heatmap Service.

    Creates a professional correlation heatmap for
    numerical features.
    """

    @classmethod
    def create(
        cls,
        dataframe: pd.DataFrame,
        output_path: Path,
        title: str = "Correlation Heatmap",
        palette: str | None = None,
        annotate: bool = True,
    ) -> Path:
        """
        Generate a correlation heatmap.

        Args:
            dataframe: Source DataFrame.
            output_path: Output image path.
            title: Chart title.
            palette: Matplotlib color palette.
            annotate: Display correlation values.

        Returns:
            Path to the saved chart.
        """

        correlation = MatrixBuilder.correlation_matrix(
            dataframe
        )

        cls.configure(
            title=title,
            xlabel="Features",
            ylabel="Features",
            grid=False,
        )

        ax = plt.gca()

        cmap = plt.get_cmap(
            ColorPalette.get(palette)
        )

        image = ax.matshow(
            correlation,
            cmap=cmap,
            vmin=-1,
            vmax=1,
        )

        plt.colorbar(image)

        ax.set_xticks(range(len(correlation.columns)))
        ax.set_yticks(range(len(correlation.columns)))

        ax.set_xticklabels(
            correlation.columns,
            rotation=45,
            ha="left",
        )

        ax.set_yticklabels(
            correlation.columns
        )

        if annotate:
            for row in range(len(correlation)):
                for col in range(len(correlation.columns)):
                    ax.text(
                        col,
                        row,
                        f"{correlation.iloc[row, col]:.2f}",
                        ha="center",
                        va="center",
                        fontsize=8,
                    )

        return cls.save(output_path)