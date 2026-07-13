import os

from app.utils.chart_utils import finish_chart
from app.utils.response import success_response


def save_chart(
    config,
    chart_name,
    df,
    **extra
):
    filename = f"{chart_name}.{config.image_format}"

    chart_path = os.path.join(
        "charts",
        filename
    )

    finish_chart(
        chart_path,
        config
    )

    return success_response(
        message=f"{chart_name.replace('_',' ').title()} generated successfully",
        chart=filename,
        rows=len(df),
        columns=len(df.columns),
        **extra
    )