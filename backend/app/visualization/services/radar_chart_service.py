from __future__ import annotations

from pathlib import Path

import matplotlib.pyplot as plt
import numpy as np
import pandas as pd

from app.visualization.base_chart import BaseChart
from app.visualization.color_palettes import ColorPalette


class RadarChartService(BaseChart):
    """
    Enterprise Radar Chart Service.

    Creates a radar (spider) chart for comparing
    multiple numerical values.
    """

    @classmethod
    def create(
        cls,
        dataframe: pd.DataFrame | None = None,
        values: dict[str, float] | None = None,
        output_path: Path | None = None,
        title: str = "Radar Chart",
        palette: str | None = None,
        fill_alpha: float = 0.25,
    ) -> Path:
        """
        Generate a radar chart.

        Args:
            dataframe: Unused. Accepted for API compatibility.
            values: Dictionary containing labels and values.
            output_path: Output image path.
            title: Chart title.
            palette: Matplotlib color palette.
            fill_alpha: Polygon fill transparency.

        Returns:
            Path to the saved chart.
        """

        if values is None or not values:
            raise ValueError("No values provided.")

        if len(values) < 3:
            raise ValueError(
                "Radar chart requires at least three values."
            )

        if output_path is None:
            raise ValueError("output_path is required.")

        labels = list(values.keys())
        data = list(values.values())

        num_vars = len(labels)

        angles = np.linspace(
            0,
            2 * np.pi,
            num_vars,
            endpoint=False,
        ).tolist()

        angles += angles[:1]
        data += data[:1]

        plt.clf()

        fig, ax = plt.subplots(
            figsize=(8, 8),
            subplot_kw={"projection": "polar"},
        )

        color = plt.get_cmap(
            ColorPalette.get(palette)
        )(0.6)

        ax.plot(
            angles,
            data,
            color=color,
            linewidth=2,
        )

        ax.fill(
            angles,
            data,
            color=color,
            alpha=fill_alpha,
        )

        ax.set_xticks(angles[:-1])
        ax.set_xticklabels(labels)

        ax.set_title(
            title,
            pad=20,
            fontsize=16,
            fontweight="bold",
        )

        return cls.save(output_path)