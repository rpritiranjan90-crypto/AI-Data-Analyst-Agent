from __future__ import annotations

from abc import ABC, abstractmethod
from pathlib import Path

import matplotlib.pyplot as plt

from app.visualization.chart_config import (
    BACKGROUND_COLOR,
    DPI,
    FIGURE_SIZE,
    GRID_ALPHA,
    LABEL_SIZE,
    TIGHT_LAYOUT,
    TITLE_SIZE,
)


class BaseChart(ABC):
    """
    Enterprise Base Chart.

    Responsibilities
    ----------------
    • Configure matplotlib figures
    • Apply consistent styling
    • Save charts with high quality
    • Validate chart output
    • Provide a common interface for all charts
    """

    @staticmethod
    def configure(
        title: str,
        xlabel: str,
        ylabel: str,
        *,
        grid: bool = True,
        legend: bool = False
    ) -> None:
        """
        Configure a chart with a consistent enterprise theme.
        """

        plt.close("all")

        plt.figure(
            figsize=FIGURE_SIZE,
            facecolor=BACKGROUND_COLOR
        )

        ax = plt.gca()

        ax.set_facecolor(BACKGROUND_COLOR)

        ax.set_title(
            title,
            fontsize=TITLE_SIZE,
            fontweight="bold",
            pad=18
        )

        ax.set_xlabel(
            xlabel,
            fontsize=LABEL_SIZE,
            fontweight="semibold"
        )

        ax.set_ylabel(
            ylabel,
            fontsize=LABEL_SIZE,
            fontweight="semibold"
        )

        ax.tick_params(
            axis="both",
            labelsize=max(LABEL_SIZE - 1, 8)
        )

        if grid:
            ax.grid(
                True,
                alpha=GRID_ALPHA,
                linestyle="--",
                linewidth=0.7
            )

        ax.set_axisbelow(True)

        if legend:
            ax.legend()

    @staticmethod
    def save(
        output_path: Path
    ) -> Path:
        """
        Save the chart with enterprise-quality settings.
        """

        if TIGHT_LAYOUT:
            plt.tight_layout()

        plt.savefig(
            output_path,
            dpi=DPI,
            bbox_inches="tight",
            facecolor=BACKGROUND_COLOR
        )

        plt.close()

        return output_path

    @staticmethod
    def validate_columns(
        dataframe,
        *columns: str
    ) -> None:
        """
        Validate that all requested columns exist.
        """

        missing = [
            column
            for column in columns
            if column not in dataframe.columns
        ]

        if missing:
            raise ValueError(
                f"Missing column(s): {', '.join(missing)}"
            )

    @staticmethod
    def validate_numeric(
        dataframe,
        *columns: str
    ) -> None:
        """
        Ensure specified columns contain numeric data.
        """

        for column in columns:

            if not dataframe[column].dtype.kind in "biufc":
                raise ValueError(
                    f"Column '{column}' must be numeric."
                )

    @abstractmethod
    def create(self, *args, **kwargs):
        """
        Every chart service must implement this method.
        """
        raise NotImplementedError