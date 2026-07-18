from __future__ import annotations

from pathlib import Path

import pandas as pd
import plotly.graph_objects as go


class CandlestickService:
    """
    Enterprise Candlestick Chart Service.

    Creates a professional candlestick chart for
    financial time-series data.
    """

    @classmethod
    def create(
        cls,
        dataframe: pd.DataFrame,
        date_column: str,
        open_column: str,
        high_column: str,
        low_column: str,
        close_column: str,
        output_path: Path,
        title: str = "Candlestick Chart",
    ) -> Path:
        """
        Generate a candlestick chart.

        Args:
            dataframe: Source DataFrame.
            date_column: Date column.
            open_column: Open price.
            high_column: High price.
            low_column: Low price.
            close_column: Close price.
            output_path: Output image path.
            title: Chart title.

        Returns:
            Path to saved chart.
        """

        required = [
            date_column,
            open_column,
            high_column,
            low_column,
            close_column,
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

        data = dataframe[required].dropna().copy()

        if data.empty:
            raise ValueError(
                "No data available to generate candlestick chart."
            )

        data[date_column] = pd.to_datetime(data[date_column])

        fig = go.Figure(
            data=[
                go.Candlestick(
                    x=data[date_column],
                    open=data[open_column],
                    high=data[high_column],
                    low=data[low_column],
                    close=data[close_column],
                    increasing_line_color="green",
                    decreasing_line_color="red",
                )
            ]
        )

        fig.update_layout(
            title=title,
            xaxis_title="Date",
            yaxis_title="Price",
            template="plotly_white",
            xaxis_rangeslider_visible=False,
        )

        fig.write_image(
            str(output_path),
            scale=2,
        )

        return output_path