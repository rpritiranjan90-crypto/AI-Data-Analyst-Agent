from app.models.chart_config import ChartConfig
from app.utils.chart_utils import setup_chart, finish_chart
from app.utils.chart_engine import save_chart
from app.utils.chart_utils import setup_chart, finish_chart
from app.utils.validation import (
    validate_dataset,
      validate_column,
    validate_numeric_column,
)
from app.utils.response import error_response
import os
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns

UPLOAD_FOLDER = "uploads"
CHART_FOLDER = "charts"

os.makedirs(CHART_FOLDER, exist_ok=True)


def get_latest_dataset():

    files = [f for f in os.listdir(UPLOAD_FOLDER) if f.endswith(".csv")]

    if not files:
        return None

    latest_file = os.path.join(UPLOAD_FOLDER, files[-1])

    return pd.read_csv(latest_file)
def generate_histogram(
    column: str,
    config: ChartConfig
):

    df = get_latest_dataset()

    if df is None:
        return {"error": "No dataset uploaded"}

    if column not in df.columns:
        return {"error": f"{column} column not found"}

    if not pd.api.types.is_numeric_dtype(df[column]):
        return {"error": f"{column} must be numeric"}

    if config.title is None:
        config.title = f"Histogram of {column}"

    setup_chart(config)

    sns.histplot(
        data=df,
        x=column,
        kde=True,
        bins=20,
        color=config.color
    )

    return save_chart(
    config=config,
    chart_name="bar_chart",
    df=df,
    title=config.title
)

def generate_bar_chart(
    x_column: str,
    y_column: str,
    config: ChartConfig
):

    df = get_latest_dataset()

    if df is None:
        return {"error": "No dataset uploaded"}

    if x_column not in df.columns:
        return {"error": f"{x_column} column not found"}

    if y_column not in df.columns:
        return {"error": f"{y_column} column not found"}

    if not pd.api.types.is_numeric_dtype(df[y_column]):
        return {"error": f"{y_column} must be numeric"}

    if config.title is None:
        config.title = f"Average {y_column} by {x_column}"

    grouped_df = df.groupby(x_column)[y_column].mean().reset_index()

    setup_chart(config)

    sns.barplot(
        data=grouped_df,
        x=x_column,
        y=y_column,
        color=config.color
    )

    return save_chart(
    config=config,
    chart_name="bar_chart",
    df=df,
    title=config.title
)


def generate_line_chart(
    x_column: str,
    y_column: str,
    config: ChartConfig
):

    df = get_latest_dataset()

    validate_dataset(df)

    if x_column not in df.columns:
        return error_response(f"{x_column} column not found")

    validate_numeric_column(df, y_column)

    if config.title is None:
        config.title = f"Average {y_column} by {x_column}"

    grouped_df = (
        df.groupby(x_column)[y_column]
        .mean()
        .reset_index()
    )

    setup_chart(config)

    plt.plot(
        grouped_df[x_column],
        grouped_df[y_column],
        marker="o",
        linewidth=2,
        color=config.color
    )

    plt.xlabel(x_column)
    plt.ylabel(y_column)
    plt.grid(True)

    return save_chart(
        config=config,
        chart_name="line_chart",
        df=df,
        title=config.title
    )
def generate_pie_chart(
    column: str,
    config: ChartConfig
):

    df = get_latest_dataset()

    validate_dataset(df)

    validate_column(df, column)

    if config.title is None:
        config.title = f"{column} Distribution"

    counts = df[column].value_counts()

    setup_chart(config)

    plt.pie(
        counts.values,
        labels=counts.index,
        autopct="%1.1f%%",
        startangle=90
    )

    plt.axis("equal")

    return save_chart(
        config=config,
        chart_name="pie_chart",
        df=df,
        title=config.title
    )

from app.utils.validation import (
    validate_dataset,
    validate_numeric_column,
)
from app.utils.response import error_response

def generate_scatter_plot(
    x_column: str,
    y_column: str,
    config: ChartConfig
):

    df = get_latest_dataset()

    validate_dataset(df)

    validate_numeric_column(df, x_column)
    validate_numeric_column(df, y_column)

    if config.title is None:
        config.title = f"{y_column} vs {x_column}"

    setup_chart(config)

    plt.scatter(
        df[x_column],
        df[y_column],
        color=config.color,
        alpha=0.7
    )

    plt.xlabel(x_column)
    plt.ylabel(y_column)
    plt.grid(True)

    return save_chart(
        config=config,
        chart_name="scatter_plot",
        df=df,
        title=config.title
    )
def generate_box_plot(
    column: str,
    config: ChartConfig
):

    df = get_latest_dataset()

    validate_dataset(df)
    validate_numeric_column(df, column)

    if config.title is None:
        config.title = f"Box Plot of {column}"

    setup_chart(config)

    sns.boxplot(
        y=df[column],
        color=config.color
    )

    plt.ylabel(column)

    return save_chart(
        config=config,
        chart_name="box_plot",
        df=df,
        title=config.title
    )
def generate_correlation_heatmap(
    config: ChartConfig
):

    df = get_latest_dataset()

    validate_dataset(df)

    numeric_df = df.select_dtypes(include="number")

    if config.title is None:
        config.title = "Correlation Heatmap"

    setup_chart(config)

    sns.heatmap(
        numeric_df.corr(),
        annot=True,
        cmap="coolwarm"
    )

    return save_chart(
        config=config,
        chart_name="correlation_heatmap",
        df=df,
        title=config.title
    )
    
def generate_count_plot(
    column: str,
    config: ChartConfig
):

    df = get_latest_dataset()

    validate_dataset(df)
    validate_column(df, column)

    if config.title is None:
        config.title = f"Count Plot of {column}"

    setup_chart(config)

    sns.countplot(
        data=df,
        x=column,
        color=config.color
    )

    plt.xlabel(column)
    plt.ylabel("Count")

    return save_chart(
        config=config,
        chart_name="count_plot",
        df=df,
        title=config.title
    )
def generate_violin_plot(
    column: str,
    config: ChartConfig
):

    df = get_latest_dataset()

    validate_dataset(df)
    validate_numeric_column(df, column)

    if config.title is None:
        config.title = f"Violin Plot of {column}"

    setup_chart(config)

    sns.violinplot(
        y=df[column],
        color=config.color
    )

    plt.ylabel(column)

    return save_chart(
        config=config,
        chart_name="violin_plot",
        df=df,
        title=config.title
    )
def generate_kde_plot(
    column: str,
    config: ChartConfig
):

    df = get_latest_dataset()

    validate_dataset(df)
    validate_numeric_column(df, column)

    if config.title is None:
        config.title = f"KDE Plot of {column}"

    setup_chart(config)

    sns.kdeplot(
        data=df,
        x=column,
        fill=True,
        color=config.color
    )

    plt.xlabel(column)

    return save_chart(
        config=config,
        chart_name="kde_plot",
        df=df,
        title=config.title
    )
def generate_area_chart(
    x_column: str,
    y_column: str,
    config: ChartConfig
):

    df = get_latest_dataset()

    validate_dataset(df)

    if x_column not in df.columns:
        return error_response(f"{x_column} column not found")

    validate_numeric_column(df, y_column)

    if config.title is None:
        config.title = f"Area Chart of {y_column}"

    grouped_df = (
        df.groupby(x_column)[y_column]
        .mean()
        .reset_index()
    )

    setup_chart(config)

    plt.fill_between(
        grouped_df[x_column],
        grouped_df[y_column],
        alpha=0.5,
        color=config.color
    )

    plt.plot(
        grouped_df[x_column],
        grouped_df[y_column],
        color=config.color
    )

    plt.xlabel(x_column)
    plt.ylabel(y_column)

    return save_chart(
        config=config,
        chart_name="area_chart",
        df=df,
        title=config.title
    )
    
def generate_bubble_chart(
    x_column: str,
    y_column: str,
    size_column: str,
    config: ChartConfig
):

    df = get_latest_dataset()

    validate_dataset(df)

    validate_numeric_column(df, x_column)
    validate_numeric_column(df, y_column)
    validate_numeric_column(df, size_column)

    if config.title is None:
        config.title = f"{y_column} vs {x_column}"

    setup_chart(config)

    plt.scatter(
        df[x_column],
        df[y_column],
        s=df[size_column] * 5,
        c=config.color,
        alpha=0.6
    )

    plt.xlabel(x_column)
    plt.ylabel(y_column)

    return save_chart(
        config=config,
        chart_name="bubble_chart",
        df=df,
        title=config.title
    )
def generate_stacked_bar_chart(
    x_column: str,
    y_columns: str,
    config: ChartConfig
):

    df = get_latest_dataset()

    validate_dataset(df)

    if x_column not in df.columns:
        return error_response(f"{x_column} column not found")

    columns = [col.strip() for col in y_columns.split(",")]

    for col in columns:
        validate_numeric_column(df, col)

    if config.title is None:
        config.title = "Stacked Bar Chart"

    grouped = df.groupby(x_column)[columns].sum()

    setup_chart(config)

    grouped.plot(
        kind="bar",
        stacked=True,
        ax=plt.gca()
    )

    return save_chart(
        config=config,
        chart_name="stacked_bar_chart",
        df=df,
        title=config.title
    )
def generate_multi_line_chart(
    x_column: str,
    y_columns: str,
    config: ChartConfig
):

    df = get_latest_dataset()

    validate_dataset(df)

    if x_column not in df.columns:
        return error_response(f"{x_column} column not found")

    columns = [col.strip() for col in y_columns.split(",")]

    for col in columns:
        validate_numeric_column(df, col)

    if config.title is None:
        config.title = "Multi Line Chart"

    setup_chart(config)

    grouped = df.groupby(x_column)[columns].mean().reset_index()

    for col in columns:
        plt.plot(
            grouped[x_column],
            grouped[col],
            marker="o",
            linewidth=2,
            label=col
        )

    plt.legend()

    return save_chart(
        config=config,
        chart_name="multi_line_chart",
        df=df,
        title=config.title
    )
def generate_donut_chart(
    column: str,
    config: ChartConfig
):

    df = get_latest_dataset()

    validate_dataset(df)

    validate_column(df, column)

    if config.title is None:
        config.title = f"{column} Distribution"

    counts = df[column].value_counts()

    setup_chart(config)

    plt.pie(
        counts.values,
        labels=counts.index,
        autopct="%1.1f%%",
        startangle=90,
        wedgeprops=dict(width=0.4)
    )

    plt.axis("equal")

    return save_chart(
        config=config,
        chart_name="donut_chart",
        df=df,
        title=config.title
    )
def generate_pair_plot(
    config: ChartConfig
):

    df = get_latest_dataset()

    validate_dataset(df)

    numeric_df = df.select_dtypes(include="number")

    sns.pairplot(numeric_df)

    filename = f"pair_plot.{config.image_format}"

    chart_path = os.path.join(
        CHART_FOLDER,
        filename
    )

    plt.savefig(chart_path)

    plt.close()

    return success_response(
        message="Pair Plot generated successfully",
        chart=filename,
        rows=len(df),
        columns=len(df.columns)
    )
def generate_hexbin_plot(
    x_column: str,
    y_column: str,
    config: ChartConfig
):

    df = get_latest_dataset()

    validate_dataset(df)

    validate_numeric_column(df, x_column)
    validate_numeric_column(df, y_column)

    if config.title is None:
        config.title = f"Hexbin Plot of {y_column} vs {x_column}"

    setup_chart(config)

    plt.hexbin(
        df[x_column],
        df[y_column],
        gridsize=20,
        cmap="viridis"
    )

    plt.colorbar()

    plt.xlabel(x_column)
    plt.ylabel(y_column)

    return save_chart(
        config=config,
        chart_name="hexbin_plot",
        df=df,
        title=config.title
    )
def generate_joint_plot(
    x_column: str,
    y_column: str,
    config: ChartConfig
):

    df = get_latest_dataset()

    validate_dataset(df)

    validate_numeric_column(df, x_column)
    validate_numeric_column(df, y_column)

    joint = sns.jointplot(
        data=df,
        x=x_column,
        y=y_column,
        kind="scatter",
        color=config.color
    )

    if config.title:
        joint.fig.suptitle(config.title)

    filename = f"joint_plot.{config.image_format}"

    chart_path = os.path.join(
        CHART_FOLDER,
        filename
    )

    joint.fig.savefig(
        chart_path,
        dpi=config.dpi
    )

    plt.close(joint.fig)

    return success_response(
        message="Joint Plot generated successfully",
        chart=filename,
        rows=len(df),
        columns=len(df.columns),
        title=config.title
    )
def generate_distribution_plot(
    column: str,
    config: ChartConfig
):

    df = get_latest_dataset()

    validate_dataset(df)

    validate_numeric_column(df, column)

    if config.title is None:
        config.title = f"Distribution Plot of {column}"

    setup_chart(config)

    sns.histplot(
        data=df,
        x=column,
        kde=True,
        color=config.color
    )

    plt.xlabel(column)

    return save_chart(
        config=config,
        chart_name="distribution_plot",
        df=df,
        title=config.title
    )