import re

from reportlab.platypus import (
    Paragraph,
    Spacer,
)

from app.report.styles import NORMAL_STYLE
from app.report.helpers import add_section_header
from app.report.text_formatter import AITextFormatter


def add_ai_recommendations(story, insights):

    add_section_header(
        story,
        "AI RECOMMENDATIONS"
    )

    # ===================================
    # AI Generated Recommendations
    # ===================================

    ai_recommendations = insights.get(
        "ai_recommendations",
        ""
    )

    if ai_recommendations:

        story.append(
            Paragraph(
                AITextFormatter.clean(
                    ai_recommendations
                ),
                NORMAL_STYLE
            )
        )

    else:

        story.append(
            Paragraph(
                "No AI recommendations available.",
                NORMAL_STYLE
            )
        )

    story.append(
        Spacer(1, 15)
    )

    # ===================================
    # Rule-Based Recommendations
    # ===================================

    recommendations = insights.get(
        "recommendations",
        []
    )

    if recommendations:

        story.append(
            Paragraph(
                "<b>Rule-Based Recommendations</b>",
                NORMAL_STYLE
            )
        )

        story.append(
            Spacer(1, 10)
        )

        for recommendation in recommendations:

            recommendation = re.sub(
                r"[■▪►◉●•]+",
                "",
                recommendation
            ).strip()

            story.append(
                Paragraph(
                    f"✓ {recommendation}",
                    NORMAL_STYLE
                )
            )

    else:

        story.append(
            Paragraph(
                "No rule-based recommendations available.",
                NORMAL_STYLE
            )
        )

    story.append(
        Spacer(1, 20)
    )