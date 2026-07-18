from __future__ import annotations

from pathlib import Path

import matplotlib.pyplot as plt
import pandas as pd
from wordcloud import WordCloud

from app.visualization.base_chart import BaseChart


class WordCloudService(BaseChart):
    """
    Enterprise Word Cloud Service.

    Creates a word cloud from textual data.
    """

    @classmethod
    def create(
        cls,
        dataframe: pd.DataFrame,
        output_path: Path,
        text_column: str | None = None,
        column: str | None = None,
        title: str = "Word Cloud",
        width: int = 1200,
        height: int = 600,
        background_color: str = "white",
        max_words: int = 200,
    ) -> Path:
        """
        Generate a word cloud.

        Args:
            dataframe: Source DataFrame.
            output_path: Output image path.
            text_column: Text column.
            column: Alias for text_column.
            title: Chart title.
            width: Image width.
            height: Image height.
            background_color: Background color.
            max_words: Maximum number of displayed words.

        Returns:
            Path to saved chart.
        """

        if text_column is None:
            text_column = column

        if text_column is None:
            raise ValueError(
                "text_column (or column) is required."
            )

        if text_column not in dataframe.columns:
            raise ValueError(
                f"Column '{text_column}' not found."
            )

        text = " ".join(
            dataframe[text_column]
            .dropna()
            .astype(str)
            .tolist()
        )

        if not text.strip():
            raise ValueError(
                "No text available to generate word cloud."
            )

        cls.configure(
            title=title,
            xlabel="",
            ylabel="",
            grid=False,
            legend=False,
        )

        cloud = WordCloud(
            width=width,
            height=height,
            background_color=background_color,
            max_words=max_words,
            collocations=False,
        ).generate(text)

        plt.imshow(
            cloud,
            interpolation="bilinear",
        )

        plt.axis("off")

        return cls.save(output_path)