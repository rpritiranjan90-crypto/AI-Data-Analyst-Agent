from app.services.dataset_cache import DatasetCache


def recommend_charts():
    """
    Recommend charts based on the currently loaded dataset.
    """

    df = DatasetCache.get_dataset()

    if df is None:
        return {
            "success": False,
            "message": "No dataset is currently loaded."
        }

    recommendations = []

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

    # Numeric columns
    for column in numeric_columns:

        recommendations.append({
            "column": column,
            "chart": "Histogram",
            "reason": "Continuous numeric data"
        })

        recommendations.append({
            "column": column,
            "chart": "Box Plot",
            "reason": "Outlier detection"
        })

        recommendations.append({
            "column": column,
            "chart": "KDE Plot",
            "reason": "Density estimation"
        })

    # Categorical columns
    for column in categorical_columns:

        recommendations.append({
            "column": column,
            "chart": "Count Plot",
            "reason": "Categorical frequency"
        })

        recommendations.append({
            "column": column,
            "chart": "Pie Chart",
            "reason": "Category proportion"
        })

        recommendations.append({
            "column": column,
            "chart": "Donut Chart",
            "reason": "Category distribution"
        })

    # Relationships
    if len(numeric_columns) >= 2:

        for i in range(len(numeric_columns)):
            for j in range(i + 1, len(numeric_columns)):

                recommendations.append({
                    "columns": [
                        numeric_columns[i],
                        numeric_columns[j]
                    ],
                    "chart": "Scatter Plot",
                    "reason": "Relationship between two numeric columns"
                })

                recommendations.append({
                    "columns": [
                        numeric_columns[i],
                        numeric_columns[j]
                    ],
                    "chart": "Hexbin Plot",
                    "reason": "High-density relationship analysis"
                })

    return {
        "success": True,
        "total_recommendations": len(recommendations),
        "recommended_charts": recommendations
    }