from __future__ import annotations

from pathlib import Path

import pandas as pd
import plotly.express as px


class GanttChartService:
    """
    Enterprise Gantt Chart Service.

    Creates a professional project timeline chart.
    """

    @classmethod
    def create(
        cls,
        dataframe: pd.DataFrame,
        task_column: str,
        start_column: str,
        finish_column: str,
        output_path: Path,
        color_column: str | None = None,
        title: str = "Project Timeline",
    ) -> Path:
        """
        Generate a Gantt chart.

        Args:
            dataframe: Source DataFrame.
            task_column: Task names.
            start_column: Task start date.
            finish_column: Task end date.
            output_path: Output image path.
            color_column: Optional grouping column.
            title: Chart title.

        Returns:
            Path to saved chart.
        """

        required = [
            task_column,
            start_column,
            finish_column,
        ]

        if color_column:
            required.append(color_column)

        missing = [
            column
            for column in required
            if column not in dataframe.columns
        ]

        if missing:
            raise ValueError(
                f"Missing columns: {', '.join(missing)}"
            )

        data = dataframe[required].dropna().copy()

        if data.empty:
            raise ValueError(
                "No data available to generate Gantt chart."
            )

        data[start_column] = pd.to_datetime(
            data[start_column]
        )

        data[finish_column] = pd.to_datetime(
            data[finish_column]
        )

        fig = px.timeline(
            data_frame=data,
            x_start=start_column,
            x_end=finish_column,
            y=task_column,
            color=color_column,
            title=title,
        )

        fig.update_yaxes(
            autorange="reversed"
        )

        fig.update_layout(
            template="plotly_white",
            xaxis_title="Timeline",
            yaxis_title="Tasks",
        )

        fig.write_image(
            str(output_path),
            scale=2,
        )

        return output_path