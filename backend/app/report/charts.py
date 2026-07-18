import os

from reportlab.platypus import (
    Image,
    Paragraph,
    Spacer,
)
from reportlab.lib.units import inch

from app.report.helpers import add_section_header
from app.report.styles import NORMAL_STYLE


def add_chart(
    story,
    title,
    filename,
    width=6,
    height=4
):
    """
    Add a chart image to the PDF report.
    """

    add_section_header(
        story,
        title.upper()
    )

    chart_path = os.path.join(
        "charts",
        filename
    )

    if os.path.exists(chart_path):

        chart = Image(
            chart_path,
            width=width * inch,
            height=height * inch
        )

        chart.hAlign = "CENTER"

        story.append(chart)

    else:

        story.append(
            Paragraph(
                f"{filename} not found.",
                NORMAL_STYLE
            )
        )

    story.append(
        Spacer(1, 20)
    )


def add_all_charts(story):
    """
    Add all available charts to the report.
    """

    chart_list = [
        ("Histogram", "histogram.png", 6, 4),
        ("Box Plot", "box_plot.png", 6, 4),
        ("Correlation Heatmap", "correlation_heatmap.png", 6, 5),
        ("Pie Chart", "pie_chart.png", 5, 5),
        ("Count Plot", "count_plot.png", 6, 4),
    ]

    for title, filename, width, height in chart_list:

        chart_path = os.path.join(
            "charts",
            filename
        )

        if os.path.exists(chart_path):

            add_chart(
                story,
                title,
                filename,
                width,
                height
            )