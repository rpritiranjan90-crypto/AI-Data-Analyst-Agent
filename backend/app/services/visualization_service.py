from __future__ import annotations

import os

import matplotlib.pyplot as plt
import pandas as pd
import seaborn as sns

from app.models.chart_config import ChartConfig
from app.services.dataset_cache import DatasetCache
from app.utils.chart_engine import save_chart
from app.utils.response import error_response
from app.utils.validation import (
    validate_column,
    validate_dataset,
    validate_numeric_column,
)

UPLOAD_FOLDER = "uploads"
CHART_FOLDER = "charts"

os.makedirs(CHART_FOLDER, exist_ok=True)


def _get_dataset():
    """
    Return the currently loaded dataset.
    """

    df = DatasetCache.get_dataset()

    if df is None:
        return None

    return df


def generate_histogram(
    column: str,
    config: ChartConfig,
):

    df = _get_dataset()

    if df is None:
        return error_response(
            "No dataset is currently loaded."
        )

    validate_column(df, column)
    validate_numeric_column(df, column)

    config.title = (
        config.title
        or f"Histogram of {column}"
    )

    plt.figure(figsize=config.figsize)

    sns.histplot(
        data=df,
        x=column,
        kde=True,
        bins=20,
        color=config.color,
    )

    plt.title(config.title)
    plt.xlabel(column)
    plt.ylabel("Frequency")

    return save_chart(
        config=config,
        chart_name="histogram",
        df=df,
        title=config.title,
    )


def generate_bar_chart(
    x_column: str,
    y_column: str,
    config: ChartConfig,
):

    df = _get_dataset()

    if df is None:
        return error_response(
            "No dataset is currently loaded."
        )

    validate_column(df, x_column)
    validate_numeric_column(df, y_column)

    grouped_df = (
        df.groupby(x_column)[y_column]
        .mean()
        .reset_index()
    )

    config.title = (
        config.title
        or f"Average {y_column} by {x_column}"
    )

    plt.figure(figsize=config.figsize)

    sns.barplot(
        data=grouped_df,
        x=x_column,
        y=y_column,
        color=config.color,
    )

    plt.title(config.title)

    return save_chart(
        config=config,
        chart_name="bar_chart",
        df=df,
        title=config.title,
    )


def generate_line_chart(
    x_column: str,
    y_column: str,
    config: ChartConfig,
):

    df = _get_dataset()

    if df is None:
        return error_response(
            "No dataset is currently loaded."
        )

    validate_column(df, x_column)
    validate_numeric_column(df, y_column)

    grouped_df = (
        df.groupby(x_column)[y_column]
        .mean()
        .reset_index()
    )

    config.title = (
        config.title
        or f"Average {y_column} by {x_column}"
    )

    plt.figure(figsize=config.figsize)

    plt.plot(
        grouped_df[x_column],
        grouped_df[y_column],
        marker="o",
        linewidth=2,
        color=config.color,
    )

    plt.grid(True)

    plt.xlabel(x_column)
    plt.ylabel(y_column)
    plt.title(config.title)

    return save_chart(
        config=config,
        chart_name="line_chart",
        df=df,
        title=config.title,
    )


def generate_pie_chart(
    column: str,
    config: ChartConfig,
):

    df = _get_dataset()

    if df is None:
        return error_response(
            "No dataset is currently loaded."
        )

    validate_column(df, column)

    config.title = (
        config.title
        or f"{column} Distribution"
    )

    counts = df[column].value_counts()

    plt.figure(figsize=config.figsize)

    plt.pie(
        counts.values,
        labels=counts.index,
        autopct="%1.1f%%",
        startangle=90,
    )

    plt.axis("equal")
    plt.title(config.title)

    return save_chart(
        config=config,
        chart_name="pie_chart",
        df=df,
        title=config.title,
    )


def generate_scatter_plot(
    x_column: str,
    y_column: str,
    config: ChartConfig,
):

    df = _get_dataset()

    if df is None:
        return error_response(
            "No dataset is currently loaded."
        )

    validate_numeric_column(df, x_column)
    validate_numeric_column(df, y_column)

    config.title = (
        config.title
        or f"{y_column} vs {x_column}"
    )

    plt.figure(figsize=config.figsize)

    plt.scatter(
        df[x_column],
        df[y_column],
        color=config.color,
        alpha=0.7,
    )

    plt.grid(True)

    plt.xlabel(x_column)
    plt.ylabel(y_column)
    plt.title(config.title)

    return save_chart(
        config=config,
        chart_name="scatter_plot",
        df=df,
        title=config.title,
    )
def generate_box_plot(
    column: str,
    config: ChartConfig,
):

    df = _get_dataset()

    if df is None:
        return error_response(
            "No dataset is currently loaded."
        )

    validate_numeric_column(df, column)

    config.title = (
        config.title
        or f"Box Plot of {column}"
    )

    plt.figure(figsize=config.figsize)

    sns.boxplot(
        y=df[column],
        color=config.color,
    )

    plt.ylabel(column)
    plt.title(config.title)

    return save_chart(
        config=config,
        chart_name="box_plot",
        df=df,
        title=config.title,
    )


def generate_correlation_heatmap(
    config: ChartConfig,
):

    df = _get_dataset()

    if df is None:
        return error_response(
            "No dataset is currently loaded."
        )

    numeric_df = df.select_dtypes(include="number")

    if numeric_df.shape[1] < 2:
        return error_response(
            "At least two numeric columns are required."
        )

    config.title = (
        config.title
        or "Correlation Heatmap"
    )

    plt.figure(figsize=config.figsize)

    sns.heatmap(
        numeric_df.corr(numeric_only=True),
        annot=True,
        cmap="coolwarm",
        fmt=".2f",
    )

    plt.title(config.title)

    return save_chart(
        config=config,
        chart_name="correlation_heatmap",
        df=df,
        title=config.title,
    )


def generate_count_plot(
    column: str,
    config: ChartConfig,
):

    df = _get_dataset()

    if df is None:
        return error_response(
            "No dataset is currently loaded."
        )

    validate_column(df, column)

    config.title = (
        config.title
        or f"Count Plot of {column}"
    )

    plt.figure(figsize=config.figsize)

    sns.countplot(
        data=df,
        x=column,
        color=config.color,
    )

    plt.xlabel(column)
    plt.ylabel("Count")
    plt.title(config.title)

    return save_chart(
        config=config,
        chart_name="count_plot",
        df=df,
        title=config.title,
    )


def generate_violin_plot(
    column: str,
    config: ChartConfig,
):

    df = _get_dataset()

    if df is None:
        return error_response(
            "No dataset is currently loaded."
        )

    validate_numeric_column(df, column)

    config.title = (
        config.title
        or f"Violin Plot of {column}"
    )

    plt.figure(figsize=config.figsize)

    sns.violinplot(
        y=df[column],
        color=config.color,
    )

    plt.ylabel(column)
    plt.title(config.title)

    return save_chart(
        config=config,
        chart_name="violin_plot",
        df=df,
        title=config.title,
    )


def generate_kde_plot(
    column: str,
    config: ChartConfig,
):

    df = _get_dataset()

    if df is None:
        return error_response(
            "No dataset is currently loaded."
        )

    validate_numeric_column(df, column)

    config.title = (
        config.title
        or f"KDE Plot of {column}"
    )

    plt.figure(figsize=config.figsize)

    sns.kdeplot(
        data=df,
        x=column,
        fill=True,
        color=config.color,
    )

    plt.xlabel(column)
    plt.title(config.title)

    return save_chart(
        config=config,
        chart_name="kde_plot",
        df=df,
        title=config.title,
    )


def generate_area_chart(
    x_column: str,
    y_column: str,
    config: ChartConfig,
):

    df = _get_dataset()

    if df is None:
        return error_response(
            "No dataset is currently loaded."
        )

    validate_column(df, x_column)
    validate_numeric_column(df, y_column)

    grouped_df = (
        df.groupby(x_column)[y_column]
        .mean()
        .reset_index()
    )

    config.title = (
        config.title
        or f"Area Chart of {y_column}"
    )

    plt.figure(figsize=config.figsize)

    plt.fill_between(
        grouped_df[x_column],
        grouped_df[y_column],
        alpha=0.5,
        color=config.color,
    )

    plt.plot(
        grouped_df[x_column],
        grouped_df[y_column],
        color=config.color,
    )

    plt.xlabel(x_column)
    plt.ylabel(y_column)
    plt.title(config.title)

    return save_chart(
        config=config,
        chart_name="area_chart",
        df=df,
        title=config.title,
    )
def generate_bubble_chart(
    x_column: str,
    y_column: str,
    size_column: str,
    config: ChartConfig,
):

    df = _get_dataset()

    if df is None:
        return error_response(
            "No dataset is currently loaded."
        )

    validate_numeric_column(df, x_column)
    validate_numeric_column(df, y_column)
    validate_numeric_column(df, size_column)

    config.title = (
        config.title
        or f"{y_column} vs {x_column}"
    )

    plt.figure(figsize=config.figsize)

    plt.scatter(
        df[x_column],
        df[y_column],
        s=df[size_column] * 5,
        c=config.color,
        alpha=0.6,
    )

    plt.xlabel(x_column)
    plt.ylabel(y_column)
    plt.title(config.title)

    return save_chart(
        config=config,
        chart_name="bubble_chart",
        df=df,
        title=config.title,
    )


def generate_stacked_bar_chart(
    x_column: str,
    y_columns: str,
    config: ChartConfig,
):

    df = _get_dataset()

    if df is None:
        return error_response(
            "No dataset is currently loaded."
        )

    validate_column(df, x_column)

    columns = [
        col.strip()
        for col in y_columns.split(",")
    ]

    for column in columns:
        validate_numeric_column(df, column)

    config.title = (
        config.title
        or "Stacked Bar Chart"
    )

    grouped = df.groupby(x_column)[columns].sum()

    plt.figure(figsize=config.figsize)

    grouped.plot(
        kind="bar",
        stacked=True,
        ax=plt.gca(),
    )

    plt.title(config.title)

    return save_chart(
        config=config,
        chart_name="stacked_bar_chart",
        df=df,
        title=config.title,
    )


def generate_multi_line_chart(
    x_column: str,
    y_columns: str,
    config: ChartConfig,
):

    df = _get_dataset()

    if df is None:
        return error_response(
            "No dataset is currently loaded."
        )

    validate_column(df, x_column)

    columns = [
        col.strip()
        for col in y_columns.split(",")
    ]

    for column in columns:
        validate_numeric_column(df, column)

    grouped = (
        df.groupby(x_column)[columns]
        .mean()
        .reset_index()
    )

    config.title = (
        config.title
        or "Multi Line Chart"
    )

    plt.figure(figsize=config.figsize)

    for column in columns:

        plt.plot(
            grouped[x_column],
            grouped[column],
            marker="o",
            linewidth=2,
            label=column,
        )

    plt.legend()
    plt.title(config.title)

    return save_chart(
        config=config,
        chart_name="multi_line_chart",
        df=df,
        title=config.title,
    )


def generate_donut_chart(
    column: str,
    config: ChartConfig,
):

    df = _get_dataset()

    if df is None:
        return error_response(
            "No dataset is currently loaded."
        )

    validate_column(df, column)

    counts = df[column].value_counts()

    config.title = (
        config.title
        or f"{column} Distribution"
    )

    plt.figure(figsize=config.figsize)

    plt.pie(
        counts.values,
        labels=counts.index,
        autopct="%1.1f%%",
        startangle=90,
        wedgeprops={"width": 0.4},
    )

    plt.axis("equal")
    plt.title(config.title)

    return save_chart(
        config=config,
        chart_name="donut_chart",
        df=df,
        title=config.title,
    )


def generate_pair_plot(
    config: ChartConfig,
):

    df = _get_dataset()

    if df is None:
        return error_response(
            "No dataset is currently loaded."
        )

    numeric_df = df.select_dtypes(include="number")

    if numeric_df.empty:
        return error_response(
            "No numeric columns found."
        )

    pair_plot = sns.pairplot(numeric_df)

    filename = (
        f"pair_plot.{config.image_format}"
    )

    chart_path = os.path.join(
        CHART_FOLDER,
        filename,
    )

    pair_plot.savefig(
        chart_path,
        dpi=config.dpi,
    )

    plt.close("all")

    return {
        "success": True,
        "message": "Pair Plot generated successfully",
        "chart": filename,
        "rows": len(df),
        "columns": len(df.columns),
    }
def generate_hexbin_plot(
    x_column: str,
    y_column: str,
    config: ChartConfig,
):

    df = _get_dataset()

    if df is None:
        return error_response(
            "No dataset is currently loaded."
        )

    validate_numeric_column(df, x_column)
    validate_numeric_column(df, y_column)

    config.title = (
        config.title
        or f"Hexbin Plot of {y_column} vs {x_column}"
    )

    plt.figure(figsize=config.figsize)

    plt.hexbin(
        df[x_column],
        df[y_column],
        gridsize=20,
        cmap="viridis",
    )

    plt.colorbar()

    plt.xlabel(x_column)
    plt.ylabel(y_column)
    plt.title(config.title)

    return save_chart(
        config=config,
        chart_name="hexbin_plot",
        df=df,
        title=config.title,
    )


def generate_joint_plot(
    x_column: str,
    y_column: str,
    config: ChartConfig,
):

    df = _get_dataset()

    if df is None:
        return error_response(
            "No dataset is currently loaded."
        )

    validate_numeric_column(df, x_column)
    validate_numeric_column(df, y_column)

    joint = sns.jointplot(
        data=df,
        x=x_column,
        y=y_column,
        kind="scatter",
        color=config.color,
    )

    joint.fig.suptitle(
        config.title or f"{y_column} vs {x_column}"
    )

    filename = (
        f"joint_plot.{config.image_format}"
    )

    chart_path = os.path.join(
        CHART_FOLDER,
        filename,
    )

    joint.fig.savefig(
        chart_path,
        dpi=config.dpi,
    )

    plt.close(joint.fig)

    return {
        "success": True,
        "message": "Joint Plot generated successfully",
        "chart": filename,
        "rows": len(df),
        "columns": len(df.columns),
    }


def generate_distribution_plot(
    column: str,
    config: ChartConfig,
):

    df = _get_dataset()

    if df is None:
        return error_response(
            "No dataset is currently loaded."
        )

    validate_numeric_column(df, column)

    config.title = (
        config.title
        or f"Distribution Plot of {column}"
    )

    plt.figure(figsize=config.figsize)

    sns.histplot(
        data=df,
        x=column,
        kde=True,
        color=config.color,
    )

    plt.xlabel(column)
    plt.ylabel("Frequency")
    plt.title(config.title)

    return save_chart(
        config=config,
        chart_name="distribution_plot",
        df=df,
        title=config.title,
    )


__all__ = [
    "generate_histogram",
    "generate_bar_chart",
    "generate_line_chart",
    "generate_pie_chart",
    "generate_scatter_plot",
    "generate_box_plot",
    "generate_correlation_heatmap",
    "generate_count_plot",
    "generate_violin_plot",
    "generate_kde_plot",
    "generate_area_chart",
    "generate_bubble_chart",
    "generate_stacked_bar_chart",
    "generate_multi_line_chart",
    "generate_donut_chart",
    "generate_pair_plot",
    "generate_hexbin_plot",
    "generate_joint_plot",
    "generate_distribution_plot",
]