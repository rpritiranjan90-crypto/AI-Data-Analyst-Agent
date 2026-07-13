from fastapi import APIRouter
from app.services.visualization_service import (
    generate_histogram,
    generate_bar_chart,
    generate_line_chart,
    generate_pie_chart,
    generate_scatter_plot,
    generate_box_plot,
    generate_correlation_heatmap,
)
router = APIRouter()
@router.get("/histogram")
def histogram(column: str):
    return generate_histogram(column)

@router.get("/bar-chart")
def bar_chart(x_column: str, y_column: str):
    return generate_bar_chart(x_column, y_column)

@router.get("/line-chart")
def line_chart(x_column: str, y_column: str):
    return generate_line_chart(x_column, y_column)
@router.get("/pie-chart")
def pie_chart(column: str):
    return generate_pie_chart(column)

@router.get("/scatter-plot")
def scatter_plot(x_column: str, y_column: str):
    return generate_scatter_plot(x_column, y_column)

@router.get("/box-plot")
def box_plot(column: str):
    return generate_box_plot(column)

@router.get("/correlation-heatmap")
def correlation_heatmap():
    return generate_correlation_heatmap()