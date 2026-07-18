from __future__ import annotations

from datetime import datetime
from pathlib import Path
from typing import Any

from app.services.dataset_service import DatasetService
from app.visualization.chart_factory import ChartFactory
from app.visualization.output_manager import OutputManager


class VisualizationPipeline:
    """
    Enterprise Visualization Pipeline.

    Responsibilities
    ----------------
    • Load dataset when required
    • Generate output path
    • Execute chart service
    • Return standardized response
    """

    @classmethod
    def run(
        cls,
        chart_type: str,
        **kwargs: Any,
    ) -> dict:
        """
        Execute the visualization pipeline.

        Args:
            chart_type: Registered chart name.
            **kwargs: Chart-specific parameters.

        Returns:
            Standardized response dictionary.
        """

        output_path = kwargs.pop(
            "output_path",
            OutputManager.get_output_path(chart_type),
        )

        dataframe = DatasetService.get_dataset()

        if dataframe is not None and not dataframe.empty:
            kwargs.setdefault("dataframe", dataframe)

        chart_path: Path = ChartFactory.create(
            chart_type=chart_type,
            output_path=output_path,
            **kwargs,
        )

        return {
            "success": True,
            "chart_type": chart_type,
            "chart_path": str(chart_path),
            "generated_at": datetime.now().strftime(
                "%Y-%m-%d %H:%M:%S"
            ),
        }