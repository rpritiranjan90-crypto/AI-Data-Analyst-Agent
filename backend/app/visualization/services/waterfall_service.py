from __future__ import annotations

from pathlib import Path

import pandas as pd
import plotly.graph_objects as go


class WaterfallService:
    """
    Enterprise Waterfall Chart Service.

    Creates a professional waterfall chart showing
    cumulative positive and negative changes.
    """

    @classmethod
    def create(
        cls,
        dataframe: pd.DataFrame,
        category_column: str,
        value_column: str,
        output_path: Path,
        title: str = "Waterfall Chart",
    ) -> Path:
        """
        Generate a waterfall chart.

        Args:
            dataframe: Source DataFrame.
            category_column: Category labels.
            value_column: Numeric values.
            output_path: Output image path.
            title: Chart title.

        Returns:
            Path to saved chart.
        """

        required = [
            category_column,
            value_column,
        ]

        missing = [
            column
            for column in required
            if column not in dataframe.columns
        ]

        if missing:
            raise ValueError(
                f"Missing columns: {', '.join(missing)}"
            )

        data = dataframe[
            required
        ].dropna()

        fig = go.Figure(
            go.Waterfall(
                x=data[category_column],
                y=data[value_column],
                measure=["relative"] * len(data),
                connector={
                    "line": {
                        "color": "gray"
                    }
                },
            )
        )

        fig.update_layout(
            title=title,
            showlegend=False,
        )

        fig.write_image(
            str(output_path),
            scale=2,
        )

        return output_path