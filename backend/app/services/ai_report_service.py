from app.ai.engines.ai_engine import AIEngine
from app.ai.schemas.ai_report_schema import AIReport
from app.ai.parser.report_parser import ReportParser


class AIReportService:
    """
    Generates structured AI reports.
    """

    def __init__(self):
        self.engine = AIEngine()

    def generate_report(self, insights):

        prompt = f"""
You are a Senior Business Data Analyst.

Create a concise professional business report using the following dataset.

Dataset Summary:
{insights['dataset_summary']}

Health Score:
{insights['health_score']}

Missing Values:
{insights['missing_values']}

Outliers:
{insights['outliers']}

Strong Correlations:
{insights['strong_correlations']}

Recommendations:
{insights['recommendations']}

Return ONLY the following sections exactly:

## Executive Summary

## Dataset Overview

## Data Quality Analysis

## Statistical Analysis

## Chart Interpretation

## Business Insights

## Risk Assessment

## Recommendations

## Conclusion

Keep every section concise.
Avoid markdown except the required headings.
"""

        response = self.engine.generate(prompt)

        if not response.success:

            print("\n========== AI REPORT ERROR ==========")
            print(response.error)
            print("=====================================\n")

            fallback = (
                f"AI Error:\n{response.error}"
            )

            return AIReport(
                executive_summary=fallback,
                dataset_overview=fallback,
                data_quality=fallback,
                statistical_analysis=fallback,
                chart_interpretation=fallback,
                business_insights=fallback,
                risk_assessment=fallback,
                recommendations=fallback,
                conclusion=fallback,
            )

        return ReportParser.parse(response.response)