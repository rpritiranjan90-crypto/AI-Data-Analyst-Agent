from app.services.dataset_service import get_latest_dataset
import pandas as pd


def detect_outliers(df):
    """
    Detect outliers using the IQR method.
    """

    outliers = {}

    numeric_df = df.select_dtypes(include=["number"])

    for column in numeric_df.columns:

        q1 = numeric_df[column].quantile(0.25)
        q3 = numeric_df[column].quantile(0.75)

        iqr = q3 - q1

        lower = q1 - 1.5 * iqr
        upper = q3 + 1.5 * iqr

        count = int(
            (
                (numeric_df[column] < lower)
                |
                (numeric_df[column] > upper)
            ).sum()
        )

        outliers[column] = count

    return outliers


def detect_correlations(df):
    """
    Detect strong correlations between numeric columns.
    """

    numeric_df = df.select_dtypes(include=["number"])

    if len(numeric_df.columns) < 2:
        return []

    correlation_matrix = numeric_df.corr()

    strong_correlations = []

    columns = correlation_matrix.columns

    for i in range(len(columns)):
        for j in range(i + 1, len(columns)):

            correlation = correlation_matrix.iloc[i, j]

            if abs(correlation) >= 0.70:

                strong_correlations.append({
                    "column_1": columns[i],
                    "column_2": columns[j],
                    "correlation": round(float(correlation), 2)
                })

    return strong_correlations


def generate_ai_insights():

    df = get_latest_dataset()

    if df is None:
        return {
            "success": False,
            "message": "No dataset uploaded."
        }

    numeric_columns = (
        df.select_dtypes(include=["number"])
        .columns
        .tolist()
    )

    categorical_columns = (
        df.select_dtypes(exclude=["number"])
        .columns
        .tolist()
    )

    missing_values = df.isnull().sum().to_dict()

    duplicate_rows = int(df.duplicated().sum())

    total_missing = sum(missing_values.values())

    outliers = detect_outliers(df)

    strong_correlations = detect_correlations(df)

    # -----------------------------
    # Dataset Health Score
    # -----------------------------

    health_score = 100

    if total_missing > 0:
        health_score -= min(total_missing * 2, 30)

    if duplicate_rows > 0:
        health_score -= min(duplicate_rows * 5, 20)

    total_outliers = sum(outliers.values())

    if total_outliers > 0:
        health_score -= min(total_outliers, 10)

    health_score = max(0, health_score)

    # -----------------------------
    # AI Recommendations
    # -----------------------------

    recommendations = []

    if total_missing == 0:
        recommendations.append("✅ No missing values detected.")
    else:
        recommendations.append(
            f"⚠️ Dataset contains {total_missing} missing values. Consider filling or removing them."
        )

    if duplicate_rows == 0:
        recommendations.append("✅ No duplicate rows found.")
    else:
        recommendations.append(
            f"⚠️ Dataset contains {duplicate_rows} duplicate rows. Consider removing them."
        )

    if total_outliers == 0:
        recommendations.append("✅ No significant outliers detected.")
    else:
        recommendations.append(
            f"⚠️ {total_outliers} potential outliers detected."
        )

    if strong_correlations:
        recommendations.append(
            "📊 Strong correlations detected. A Correlation Heatmap is recommended."
        )

    if len(numeric_columns) > 0:
        recommendations.append(
            "📈 Histogram, Box Plot and KDE Plot are recommended for numeric columns."
        )

    if len(categorical_columns) > 0:
        recommendations.append(
            "🥧 Pie Chart, Donut Chart and Count Plot are recommended for categorical columns."
        )

    if len(numeric_columns) >= 2:
        recommendations.append(
            "📉 Scatter Plot and Bubble Chart are recommended to analyze relationships."
        )

    return {
        "success": True,
        "message": "AI Insights generated successfully",

        "dataset_summary": {
            "rows": len(df),
            "columns": len(df.columns)
        },

        "numeric_columns": numeric_columns,

        "categorical_columns": categorical_columns,

        "missing_values": missing_values,

        "duplicate_rows": duplicate_rows,

        "outliers": outliers,

        "strong_correlations": strong_correlations,

        "health_score": health_score,

        "recommendations": recommendations
    }