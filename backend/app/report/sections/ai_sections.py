from reportlab.platypus import (
    Paragraph,
    Spacer,
)

from app.report.styles import NORMAL_STYLE
from app.report.helpers import add_section_header
from app.report.text_formatter import AITextFormatter


def add_executive_summary(story, insights):

    add_section_header(
        story,
        "EXECUTIVE SUMMARY"
    )

    story.append(
        Paragraph(
            AITextFormatter.clean(
                insights.get(
                    "executive_summary",
                    "No executive summary available."
                )
            ),
            NORMAL_STYLE
        )
    )

    story.append(
        Spacer(1, 20)
    )


def add_dataset_overview(story, insights):

    add_section_header(
        story,
        "DATASET OVERVIEW"
    )

    story.append(
        Paragraph(
            AITextFormatter.clean(
                insights.get(
                    "dataset_overview",
                    "No AI dataset overview available."
                )
            ),
            NORMAL_STYLE
        )
    )

    story.append(
        Spacer(1, 20)
    )


def add_data_quality_analysis(story, insights):

    add_section_header(
        story,
        "DATA QUALITY ANALYSIS"
    )

    story.append(
        Paragraph(
            AITextFormatter.clean(
                insights.get(
                    "data_quality",
                    "No AI data quality analysis available."
                )
            ),
            NORMAL_STYLE
        )
    )

    story.append(
        Spacer(1, 20)
    )


def add_statistical_analysis(story, insights):

    add_section_header(
        story,
        "STATISTICAL ANALYSIS"
    )

    story.append(
        Paragraph(
            AITextFormatter.clean(
                insights.get(
                    "statistical_analysis",
                    "No AI statistical analysis available."
                )
            ),
            NORMAL_STYLE
        )
    )

    story.append(
        Spacer(1, 20)
    )


def add_business_insights(story, insights):

    add_section_header(
        story,
        "BUSINESS INSIGHTS"
    )

    story.append(
        Paragraph(
            AITextFormatter.clean(
                insights.get(
                    "business_insights",
                    "No AI business insights available."
                )
            ),
            NORMAL_STYLE
        )
    )

    story.append(
        Spacer(1, 20)
    )


def add_risk_assessment(story, insights):

    add_section_header(
        story,
        "RISK ASSESSMENT"
    )

    story.append(
        Paragraph(
            AITextFormatter.clean(
                insights.get(
                    "risk_assessment",
                    "No AI risk assessment available."
                )
            ),
            NORMAL_STYLE
        )
    )

    story.append(
        Spacer(1, 20)
    )


def add_conclusion(story, insights):

    add_section_header(
        story,
        "CONCLUSION"
    )

    story.append(
        Paragraph(
            AITextFormatter.clean(
                insights.get(
                    "conclusion",
                    "No AI conclusion available."
                )
            ),
            NORMAL_STYLE
        )
    )

    story.append(
        Spacer(1, 20)
    )