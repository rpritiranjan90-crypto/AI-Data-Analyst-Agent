from reportlab.platypus import (
    Table,
    TableStyle,
    Spacer,
)
from reportlab.lib import colors
def add_section_header(story, title):
    table = Table(
        [[title]],
        colWidths=[450]
    )
    table.setStyle(
        TableStyle([
            ("BACKGROUND", (0, 0), (-1, -1), colors.darkblue),
            ("TEXTCOLOR", (0, 0), (-1, -1), colors.white),
            ("ALIGN", (0, 0), (-1, -1), "CENTER"),
            ("FONTNAME", (0, 0), (-1, -1), "Helvetica-Bold"),
            ("FONTSIZE", (0, 0), (-1, -1), 15),
            ("TOPPADDING", (0, 0), (-1, -1), 8),
            ("BOTTOMPADDING", (0, 0), (-1, -1), 8),
        ])
    )
    story.append(table)
    story.append(Spacer(1, 15))