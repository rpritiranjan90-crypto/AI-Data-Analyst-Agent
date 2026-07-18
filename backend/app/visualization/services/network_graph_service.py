from __future__ import annotations

from pathlib import Path

import matplotlib.pyplot as plt
import networkx as nx
import pandas as pd

from app.visualization.base_chart import BaseChart


class NetworkGraphService(BaseChart):
    """
    Enterprise Network Graph Service.

    Creates a relationship graph between entities.
    """

    @classmethod
    def create(
        cls,
        dataframe: pd.DataFrame,
        source_column: str,
        target_column: str,
        output_path: Path,
        title: str = "Network Graph",
        node_size: int = 800,
        font_size: int = 10,
    ) -> Path:
        """
        Generate a Network Graph.

        Args:
            dataframe: Source DataFrame.
            source_column: Source node column.
            target_column: Target node column.
            output_path: Output image path.
            title: Chart title.
            node_size: Node size.
            font_size: Label font size.

        Returns:
            Path to saved chart.
        """

        required = [
            source_column,
            target_column,
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

        data = dataframe[required].dropna()

        if data.empty:
            raise ValueError(
                "No relationships available."
            )

        graph = nx.Graph()

        for _, row in data.iterrows():
            graph.add_edge(
                str(row[source_column]),
                str(row[target_column]),
            )

        cls.configure(
            title=title,
            grid=False,
        )

        pos = nx.spring_layout(
            graph,
            seed=42,
        )

        nx.draw_networkx(
            graph,
            pos=pos,
            with_labels=True,
            node_size=node_size,
            font_size=font_size,
            edgecolors="black",
        )

        plt.axis("off")

        return cls.save(output_path)