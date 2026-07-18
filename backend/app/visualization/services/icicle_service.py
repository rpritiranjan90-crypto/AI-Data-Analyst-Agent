from __future__ import annotations

from pathlib import Path

import pandas as pd
import plotly.express as px


class IcicleService:
    """
    Enterprise Icicle Chart Service.

    Creates an Icicle chart for hierarchical categorical data.
    """

    @classmethod
    def create(
        cls,
        dataframe: pd.DataFrame,
        output_path: Path,
        path_columns: list[str] | None = None,
        column: str | None = None,
        value_column: str | None = None,
        title: str = "Icicle Chart",
    ) -> Path:
        """
        Generate an Icicle chart.

        Args:
            dataframe: Source DataFrame.
            output_path: Output image path.
            path_columns: Hierarchical columns.
            column: Convenience alias for a single hierarchy column.
            value_column: Optional numeric value column.
            title: Chart title.

        Returns:
            Path to saved chart.
        """

        if path_columns is None:
            if column is None:
                raise ValueError(
                    "Either 'path_columns' or 'column' must be provided."
                )

            path_columns = [column]

        required = list(path_columns)

        if value_column:
            required.append(value_column)

        missing = [
            c
            for c in required
            if c not in dataframe.columns
        ]

        if missing:
            raise ValueError(
                f"Missing columns: {', '.join(missing)}"
            )

        data = dataframe[required].dropna()

        if data.empty:
            raise ValueError(
                "No data available to generate icicle chart."
            )

        fig = px.icicle(
            data_frame=data,
            path=path_columns,
            values=value_column if value_column else None,
            title=title,
        )

        fig.update_layout(
            template="plotly_white",
            margin=dict(
                t=50,
                l=20,
                r=20,
                b=20,
            ),
        )

        fig.write_image(
            str(output_path),
            scale=2,
        )

        return output_path