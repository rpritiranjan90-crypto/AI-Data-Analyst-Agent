import re

from app.ai.schemas.ai_report_schema import AIReport


class ReportParser:
    """
    Parses AI report text into structured sections.
    """

    HEADINGS = {
        "executive summary": "executive_summary",
        "dataset overview": "dataset_overview",
        "data quality analysis": "data_quality",
        "statistical analysis": "statistical_analysis",
        "chart interpretation": "chart_interpretation",
        "business insights": "business_insights",
        "risk assessment": "risk_assessment",
        "recommendations": "recommendations",
        "conclusion": "conclusion",
    }

    @classmethod
    def parse(cls, text: str) -> AIReport:

        sections = {
            value: ""
            for value in cls.HEADINGS.values()
        }

        current = None

        for line in text.splitlines():

            line = line.strip()

            if not line:
                continue

            # Remove markdown symbols
            cleaned = re.sub(r"^[#*\-\s]+", "", line).strip().lower()

            if cleaned in cls.HEADINGS:
                current = cls.HEADINGS[cleaned]
                continue

            if current:
                sections[current] += line + "\n"

        return AIReport(**sections)