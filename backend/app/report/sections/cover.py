from datetime import datetime

from reportlab.platypus import (
    Paragraph,
    Spacer,
)

from app.report.styles import (
    TITLE_STYLE,
    SECTION_STYLE,
    NORMAL_STYLE,
)
def add_cover_page(story):
    story.append(
        Paragraph(
            "AI DATA ANALYST AGENT",
            TITLE_STYLE
        )
    )

    story.append(
        Paragraph(
            "<para align='center'>Professional Data Analysis Report</para>",
            SECTION_STYLE
        )
    )

    story.append(Spacer(1, 25))

    story.append(
        Paragraph(
            f"<b>Generated On:</b> {datetime.now().strftime('%d %B %Y %I:%M %p')}",
            NORMAL_STYLE
        )
    )

    story.append(
        Paragraph(
            "<b>Developer:</b> Pritiranjan Rout",
            NORMAL_STYLE
        )
    )

    story.append(
        Paragraph(
            "<b>Version:</b> 2.0.0",
            NORMAL_STYLE
        )
    )

    story.append(Spacer(1, 25))