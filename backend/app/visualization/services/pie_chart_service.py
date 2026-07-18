from __future__ import annotations

from pathlib import Path

import matplotlib.pyplot as plt
import pandas as pd

from app.visualization.base_chart import BaseChart
from app.visualization.chart_utils import ChartUtils
from app.visualization.color_palettes import ColorPalette


class PieChartService(BaseChart):
    """
    Enterprise Pie Chart Service.
    """

    @classmethod
    def create(
        cls,
        dataframe: pd.DataFrame,
        column: str,
        output_path: Path,
        title: str = "Pie Chart",
        top_n: int = 10,
        palette: str | None = None
    ) -> Path:

        ChartUtils.validate_columns(
            dataframe,
            column
        )

        dataframe = ChartUtils.remove_missing(
            dataframe,
            [column]
        )

        counts = ChartUtils.top_n(
            dataframe,
            column,
            top_n
        )

        cls.configure(
            title=title,
            xlabel="",
            ylabel="",
            grid=False
        )

        colors = plt.get_cmap(
            ColorPalette.get(palette)
        )(
            range(len(counts))
        )

        plt.pie(
            counts.values,
            labels=counts.index.astype(str),
            autopct="%1.1f%%",
            startangle=90,
            colors=colors,
            wedgeprops={
                "edgecolor": "white",
                "linewidth": 1
            }
        )

        plt.axis("equal")

        return cls.save(
            output_path
        )