from reportlab.platypus import (
    Spacer,
    Table,
    TableStyle,
)

from reportlab.lib import colors

from app.report.helpers import add_section_header


def add_dataset_summary(story, insights):

    add_section_header(
        story,
        "DATASET SUMMARY"
    )

    table_data = [
        ["Metric", "Value"],
        ["Rows", insights["dataset_summary"]["rows"]],
        ["Columns", insights["dataset_summary"]["columns"]],
        ["Health Score", f"{insights['health_score']}%"],
        ["Duplicate Rows", insights["duplicate_rows"]],
    ]

    table = Table(
        table_data,
        colWidths=[220, 220]
    )

    table.setStyle(
        TableStyle([
            ("BACKGROUND", (0, 0), (-1, 0), colors.darkblue),
            ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),
            ("GRID", (0, 0), (-1, -1), 1, colors.black),
            ("BACKGROUND", (0, 1), (-1, -1), colors.beige),
            ("ALIGN", (0, 0), (-1, -1), "CENTER"),
            ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
        ])
    )

    story.append(table)

    story.append(
        Spacer(1, 20)
    )