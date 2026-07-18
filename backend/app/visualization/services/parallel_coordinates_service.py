from __future__ import annotations

from pathlib import Path

import matplotlib.pyplot as plt
import pandas as pd
from pandas.plotting import parallel_coordinates

from app.visualization.base_chart import BaseChart
from app.visualization.builders.matrix_builder import MatrixBuilder
from app.visualization.color_palettes import ColorPalette


class ParallelCoordinatesService(BaseChart):
    """
    Enterprise Parallel Coordinates Plot Service.

    Creates a parallel coordinates plot for comparing
    multiple numerical features across observations.
    """

    @classmethod
    def create(
        cls,
        dataframe: pd.DataFrame,
        output_path: Path,
        title: str = "Parallel Coordinates Plot",
        columns: list[str] | None = None,
        class_column: str | None = None,
        palette: str | None = None,
        alpha: float = 0.5,
        max_rows: int = 500,
    ) -> Path:
        """
        Generate a parallel coordinates plot.

        Args:
            dataframe: Source DataFrame.
            output_path: Output image path.
            title: Chart title.
            columns: Numerical columns to visualize.
            class_column: Optional categorical column for grouping.
            palette: Matplotlib colormap.
            alpha: Line transparency.
            max_rows: Maximum rows to display.

        Returns:
            Path to the saved chart.
        """

        numeric_df = MatrixBuilder.numeric_dataframe(dataframe)

        if columns:
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

        numeric_df = numeric_df.head(max_rows).copy()

        if class_column:

            if class_column not in dataframe.columns:
                raise ValueError(
                    f"'{class_column}' not found."
                )

            numeric_df[class_column] = (
                dataframe.loc[
                    numeric_df.index,
                    class_column,
                ].astype(str)
            )

        else:
            class_column = "__group__"
            numeric_df[class_column] = "Data"

        plt.clf()

        cls.configure(
            title=title,
            xlabel="Features",
            ylabel="Normalized Value",
        )

        cmap = plt.get_cmap(
            ColorPalette.get(palette)
        )

        unique_classes = numeric_df[class_column].unique()

        colors = [
            cmap(i / max(1, len(unique_classes)))
            for i in range(len(unique_classes))
        ]

        parallel_coordinates(
            numeric_df,
            class_column=class_column,
            color=colors,
            alpha=alpha,
        )

        plt.xticks(rotation=45)

        plt.legend(
            loc="best",
            fontsize=8,
        )

        return cls.save(output_path)