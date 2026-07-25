from __future__ import annotations

from pathlib import Path
from typing import Any

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
        output_path: Path,
        column: str | None = None,
        x_column: str | None = None,
        title: str = "Histogram",
        bins: int = 20,
        palette: str | None = None,
        **kwargs: Any,
    ) -> Path:
        """
        Generate a histogram.
        """
        target_column = x_column or column
        if not target_column:
            numeric_cols = dataframe.select_dtypes(include="number").columns
            target_column = numeric_cols[0] if len(numeric_cols) > 0 else dataframe.columns[0]

        data = NumericalBuilder.prepare(
            dataframe=dataframe,
            column=target_column,
        )

        cls.configure(
            title=title,
            xlabel=target_column,
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