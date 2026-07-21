from __future__ import annotations

from typing import Any

import pandas as pd

from app.services.dataset_service import DatasetService


class VisualizationWorkflow:
    """
    Enterprise Visualization Workflow.

    Automatically generates useful visualizations
    for the active dataset.
    """

    def __init__(self) -> None:

        self._dataset_service = DatasetService()

        self._report: dict[str, Any] = {
            "success": True,
            "charts": [],
            "warnings": [],
            "errors": [],
        }

    def _dataset(self) -> pd.DataFrame:
        """
        Return the active dataset.
        """

        return self._dataset_service.get_dataset()

    def _add_chart(
        self,
        chart_name: str,
        result: Any,
    ) -> None:

        self._report["charts"].append(
            {
                "chart": chart_name,
                "result": result,
            }
        )

    def _warning(
        self,
        message: str,
    ) -> None:

        self._report["warnings"].append(message)

    def _error(
        self,
        message: str,
    ) -> None:

        self._report["success"] = False
        self._report["errors"].append(message)

    def _default_config(self):
        """
        Create a default chart configuration.
        """

        from app.models.chart_config import ChartConfig

        return ChartConfig()

    def _generate_numeric_charts(self) -> None:
        """
        Generate charts for numeric columns.
        """

        from app.services.visualization_service import (
            generate_histogram,
            generate_box_plot,
            generate_kde_plot,
        )

        dataframe = self._dataset()

        numeric_columns = dataframe.select_dtypes(
            include="number"
        ).columns

        config = self._default_config()

        for column in numeric_columns:

            try:

                histogram = generate_histogram(
                    column,
                    config,
                )

                self._add_chart(
                    f"Histogram ({column})",
                    histogram,
                )

                box = generate_box_plot(
                    column,
                    config,
                )

                self._add_chart(
                    f"Box Plot ({column})",
                    box,
                )

                kde = generate_kde_plot(
                    column,
                    config,
                )

                self._add_chart(
                    f"KDE Plot ({column})",
                    kde,
                )

            except Exception as error:

                self._warning(
                    f"{column}: {error}"
                )

    def _generate_categorical_charts(self) -> None:
        """
        Generate charts for categorical columns.
        """

        from app.services.visualization_service import (
            generate_count_plot,
            generate_pie_chart,
        )

        dataframe = self._dataset()

        categorical_columns = dataframe.select_dtypes(
            exclude="number"
        ).columns

        config = self._default_config()

        for column in categorical_columns:

            try:

                count = generate_count_plot(
                    column,
                    config,
                )

                self._add_chart(
                    f"Count Plot ({column})",
                    count,
                )

                pie = generate_pie_chart(
                    column,
                    config,
                )

                self._add_chart(
                    f"Pie Chart ({column})",
                    pie,
                )

            except Exception as error:

                self._warning(
                    f"{column}: {error}"
                )
    def _generate_relationship_charts(self) -> None:
        """
        Generate relationship visualizations.
        """

        from app.services.visualization_service import (
            generate_correlation_heatmap,
            generate_scatter_plot,
        )

        dataframe = self._dataset()

        numeric_columns = dataframe.select_dtypes(
            include="number"
        ).columns.tolist()

        config = self._default_config()

        try:

            if len(numeric_columns) >= 2:

                heatmap = generate_correlation_heatmap(
                    config,
                )

                self._add_chart(
                    "Correlation Heatmap",
                    heatmap,
                )

                scatter = generate_scatter_plot(
                    numeric_columns[0],
                    numeric_columns[1],
                    config,
                )

                self._add_chart(
                    f"Scatter Plot ({numeric_columns[0]} vs {numeric_columns[1]})",
                    scatter,
                )

        except Exception as error:

            self._warning(
                f"Relationship charts: {error}"
            )

    def execute(self) -> dict[str, Any]:
        """
        Execute the complete visualization workflow.
        """

        try:

            self._generate_numeric_charts()

            self._generate_categorical_charts()

            self._generate_relationship_charts()

            self._report["summary"] = {
                "charts_generated": len(
                    self._report["charts"]
                ),
                "warnings": len(
                    self._report["warnings"]
                ),
                "errors": len(
                    self._report["errors"]
                ),
            }

            return self._report

        except Exception as error:

            self._error(str(error))

            return self._report