from __future__ import annotations

from pathlib import Path

import pandas as pd
import plotly.graph_objects as go


class SankeyService:
    """
    Enterprise Sankey Diagram Service.

    Creates an interactive Sankey diagram showing
    flow between source and target categories.
    """

    @classmethod
    def create(
        cls,
        dataframe: pd.DataFrame,
        source_column: str,
        target_column: str,
        output_path: Path,
        value_column: str | None = None,
        title: str = "Sankey Diagram",
    ) -> Path:
        """
        Generate a Sankey diagram.

        Args:
            dataframe: Source DataFrame.
            source_column: Source node column.
            target_column: Target node column.
            output_path: Output image path.
            value_column: Optional weight column.
            title: Diagram title.

        Returns:
            Path to saved chart.
        """

        required = [source_column, target_column]

        if value_column:
            required.append(value_column)

        missing = [
            column
            for column in required
            if column not in dataframe.columns
        ]

        if missing:
            raise ValueError(
                f"Missing columns: {', '.join(missing)}"
            )

        data = dataframe[required].dropna()

        labels = pd.unique(
            pd.concat(
                [
                    data[source_column],
                    data[target_column],
                ]
            )
        )

        label_map = {
            label: index
            for index, label in enumerate(labels)
        }

        sources = data[source_column].map(label_map)
        targets = data[target_column].map(label_map)

        if value_column:
            values = data[value_column]
        else:
            values = [1] * len(data)

        fig = go.Figure(
            go.Sankey(
                node=dict(
                    pad=20,
                    thickness=20,
                    line=dict(
                        color="black",
                        width=0.5,
                    ),
                    label=labels,
                ),
                link=dict(
                    source=sources,
                    target=targets,
                    value=values,
                ),
            )
        )

        fig.update_layout(
            title_text=title,
            font_size=12,
        )

        fig.write_image(
            str(output_path),
            scale=2,
        )

        return output_path
    