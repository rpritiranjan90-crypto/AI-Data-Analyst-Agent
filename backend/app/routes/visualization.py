from fastapi import Depends
from app.models.chart_config import ChartConfig
from fastapi import APIRouter
from app.services.visualization_service import (
    generate_histogram,
    generate_bar_chart,
    generate_line_chart,
    generate_area_chart,
    generate_scatter_plot,
    generate_bubble_chart,
    generate_pie_chart,
    generate_donut_chart,
    generate_count_plot,
    generate_box_plot,
    generate_violin_plot,
    generate_kde_plot,
    generate_multi_line_chart,
    generate_stacked_bar_chart,
    generate_correlation_heatmap,
    generate_pair_plot,
    generate_hexbin_plot,
    generate_joint_plot,
    generate_distribution_plot,
)

router = APIRouter(tags=["Visualization"])

# Histogram
@router.get("/histogram")
def histogram(
    column: str,
    config: ChartConfig = Depends()
):
    return generate_histogram(
        column,
        config
    )

# Bar Chart
from fastapi import Depends

@router.get("/bar-chart")
def bar_chart(
    x_column: str,
    y_column: str,
    config: ChartConfig = Depends()
):
    return generate_bar_chart(
        x_column,
        y_column,
        config
    )

@router.get("/line-chart")
def line_chart(
    x_column: str,
    y_column: str,
    config: ChartConfig = Depends()
):
    return generate_line_chart(
        x_column,
        y_column,
        config
    )


@router.get("/area-chart")
def area_chart(
    x_column: str,
    y_column: str,
    config: ChartConfig = Depends()
):
    return generate_area_chart(
        x_column,
        y_column,
        config
    )

# Scatter Plot
@router.get("/scatter-plot")
def scatter_plot(
    x_column: str,
    y_column: str,
    config: ChartConfig = Depends()
):
    return generate_scatter_plot(
        x_column,
        y_column,
        config
    )
# Bubble Chart
@router.get("/bubble-chart")
def bubble_chart(
    x_column: str,
    y_column: str,
    size_column: str,
    config: ChartConfig = Depends()
):
    return generate_bubble_chart(
        x_column,
        y_column,
        size_column,
        config
    )

@router.get("/pie-chart")
def pie_chart(
    column: str,
    config: ChartConfig = Depends()
):
    return generate_pie_chart(
        column,
        config
    )


@router.get("/donut-chart")
def donut_chart(
    column: str,
    config: ChartConfig = Depends()
):
    return generate_donut_chart(
        column,
        config
    )

# Count Plot
@router.get("/count-plot")
def count_plot(
    column: str,
    config: ChartConfig = Depends()
):
    return generate_count_plot(
        column,
        config
    )

# Box Plot
@router.get("/box-plot")
def box_plot(
    column: str,
    config: ChartConfig = Depends()
):
    return generate_box_plot(
        column,
        config
    )

# Violin Plot
@router.get("/violin-plot")
def violin_plot(
    column: str,
    config: ChartConfig = Depends()
):
    return generate_violin_plot(
        column,
        config
    )

# KDE Plot
@router.get("/kde-plot")
def kde_plot(
    column: str,
    config: ChartConfig = Depends()
):
    return generate_kde_plot(
        column,
        config
    )

# Multi-Line Chart
@router.get("/multi-line-chart")
def multi_line_chart(
    x_column: str,
    y_columns: str,
    config: ChartConfig = Depends()
):
    return generate_multi_line_chart(
        x_column,
        y_columns,
        config
    )
# Stacked Bar Chart
@router.get("/stacked-bar-chart")
def stacked_bar_chart(
    x_column: str,
    y_columns: str,
    config: ChartConfig = Depends()
):
    return generate_stacked_bar_chart(
        x_column,
        y_columns,
        config
    )

# Correlation Heatmap
@router.get("/correlation-heatmap")
def correlation_heatmap(
    config: ChartConfig = Depends()
):
    return generate_correlation_heatmap(config)

# Pair Plot
@router.get("/pair-plot")
def pair_plot(
    config: ChartConfig = Depends()
):
    return generate_pair_plot(config)
# Hexbin Plot
@router.get("/hexbin-plot")
def hexbin_plot(
    x_column: str,
    y_column: str,
    config: ChartConfig = Depends()
):
    return generate_hexbin_plot(
        x_column,
        y_column,
        config
    )
# Joint Plot
@router.get("/joint-plot")
def joint_plot(
    x_column: str,
    y_column: str,
    config: ChartConfig = Depends()
):
    return generate_joint_plot(
        x_column,
        y_column,
        config
    )
# Distribution Plot
@router.get("/distribution-plot")
def distribution_plot(
    column: str,
    config: ChartConfig = Depends()
):
    return generate_distribution_plot(
        column,
        config
    )