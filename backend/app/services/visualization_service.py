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


def generate_histogram(column: str):

    df = get_latest_dataset()

    if df is None:
        return {"error": "No dataset uploaded"}

    if column not in df.columns:
        return {"error": "Column not found"}

    plt.figure(figsize=(8, 5))
    sns.histplot(df[column], kde=True)
    plt.title(f"Histogram of {column}")

    chart_path = os.path.join(CHART_FOLDER, "histogram.png")

    plt.tight_layout()
    plt.savefig(chart_path)
    plt.close()

    return {
        "message": "Histogram generated successfully",
        "chart": "histogram.png"
    }


def generate_bar_chart(x_column: str, y_column: str):

    df = get_latest_dataset()

    if df is None:
        return {"error": "No dataset uploaded"}

    if x_column not in df.columns or y_column not in df.columns:
        return {"error": "Column not found"}

    plt.figure(figsize=(10, 6))
    sns.barplot(data=df, x=x_column, y=y_column)

    plt.xticks(rotation=45)
    plt.title(f"{y_column} vs {x_column}")

    chart_path = os.path.join(CHART_FOLDER, "bar_chart.png")

    plt.tight_layout()
    plt.savefig(chart_path)
    plt.close()

    return {
        "message": "Bar Chart generated successfully",
        "chart": "bar_chart.png"
    }


def generate_line_chart(x_column: str, y_column: str):

    df = get_latest_dataset()

    if df is None:
        return {"error": "No dataset uploaded"}

    if x_column not in df.columns or y_column not in df.columns:
        return {"error": "Column not found"}

    plt.figure(figsize=(10, 6))

    plt.plot(df[x_column], df[y_column], marker="o")

    plt.xticks(rotation=45)
    plt.xlabel(x_column)
    plt.ylabel(y_column)
    plt.title(f"{y_column} vs {x_column}")

    chart_path = os.path.join(CHART_FOLDER, "line_chart.png")

    plt.tight_layout()
    plt.savefig(chart_path)
    plt.close()

    return {
        "message": "Line Chart generated successfully",
        "chart": "line_chart.png"
    }


def generate_pie_chart(column: str):

    df = get_latest_dataset()

    if df is None:
        return {"error": "No dataset uploaded"}

    if column not in df.columns:
        return {"error": "Column not found"}

    plt.figure(figsize=(8, 8))

    df[column].value_counts().plot.pie(autopct="%1.1f%%")

    plt.ylabel("")
    plt.title(f"Pie Chart of {column}")

    chart_path = os.path.join(CHART_FOLDER, "pie_chart.png")

    plt.tight_layout()
    plt.savefig(chart_path)
    plt.close()

    return {
        "message": "Pie Chart generated successfully",
        "chart": "pie_chart.png"
    }


def generate_scatter_plot(x_column: str, y_column: str):

    df = get_latest_dataset()

    if df is None:
        return {"error": "No dataset uploaded"}

    if x_column not in df.columns or y_column not in df.columns:
        return {"error": "Column not found"}

    plt.figure(figsize=(8, 6))

    sns.scatterplot(data=df, x=x_column, y=y_column)

    plt.title(f"{y_column} vs {x_column}")

    chart_path = os.path.join(CHART_FOLDER, "scatter_plot.png")

    plt.tight_layout()
    plt.savefig(chart_path)
    plt.close()

    return {
        "message": "Scatter Plot generated successfully",
        "chart": "scatter_plot.png"
    }


def generate_box_plot(column: str):

    df = get_latest_dataset()

    if df is None:
        return {"error": "No dataset uploaded"}

    if column not in df.columns:
        return {"error": "Column not found"}

    plt.figure(figsize=(8, 5))

    sns.boxplot(y=df[column])

    plt.title(f"Box Plot of {column}")

    chart_path = os.path.join(CHART_FOLDER, "box_plot.png")

    plt.tight_layout()
    plt.savefig(chart_path)
    plt.close()

    return {
        "message": "Box Plot generated successfully",
        "chart": "box_plot.png"
    }


def generate_correlation_heatmap():

    df = get_latest_dataset()

    if df is None:
        return {"error": "No dataset uploaded"}

    numeric_df = df.select_dtypes(include="number")

    if numeric_df.empty:
        return {"error": "No numeric columns found"}

    plt.figure(figsize=(10, 8))

    sns.heatmap(numeric_df.corr(), annot=True, cmap="coolwarm")

    plt.title("Correlation Heatmap")

    chart_path = os.path.join(CHART_FOLDER, "correlation_heatmap.png")

    plt.tight_layout()
    plt.savefig(chart_path)
    plt.close()

    return {
        "message": "Correlation Heatmap generated successfully",
        "chart": "correlation_heatmap.png"
    }