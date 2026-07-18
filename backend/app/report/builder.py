import os
from datetime import datetime

from reportlab.platypus import (
    SimpleDocTemplate,
    Image,
    Spacer,
)

from reportlab.lib.units import inch
from app.report.page_template import PageTemplate
from app.report.sections import (
    add_cover_page,
    add_report_metadata,
    add_dataset_summary,
    add_health_score,
    add_missing_values,
    add_outlier_analysis,
    add_strong_correlation_analysis,
    add_ai_recommendations,
    add_executive_summary,
    add_dataset_overview,
    add_data_quality_analysis,
    add_statistical_analysis,
    add_business_insights,
    add_risk_assessment,
    add_conclusion,
)

from app.report.charts import add_all_charts


class ReportBuilder:

    def __init__(self, insights):

        self.insights = insights
        self.story = []

        self.report_folder = "reports"

        os.makedirs(
            self.report_folder,
            exist_ok=True
        )

        timestamp = datetime.now().strftime(
            "%Y%m%d_%H%M%S"
        )

        self.filename = os.path.join(
            self.report_folder,
            f"AI_Data_Analyst_Report_{timestamp}.pdf"
        )

        self.document = SimpleDocTemplate(
            self.filename
        )

    def build(self):

        # ==========================================
        # COMPANY LOGO
        # ==========================================

        logo_path = os.path.join(
            "assets",
            "logo.png"
        )

        if os.path.exists(logo_path):

            logo = Image(
                logo_path,
                width=1.5 * inch,
                height=1.5 * inch
            )

            logo.hAlign = "CENTER"

            self.story.append(logo)
            self.story.append(
                Spacer(1, 20)
            )

        # ==========================================
        # COVER PAGE
        # ==========================================

        add_cover_page(
            self.story
        )

        # ==========================================
        # EXECUTIVE SUMMARY (AI)
        # ==========================================

        add_executive_summary(
            self.story,
            self.insights
        )

        # ==========================================
        # REPORT INFORMATION
        # ==========================================

        add_report_metadata(
            self.story
        )

        # ==========================================
        # DATASET SUMMARY
        # ==========================================

        add_dataset_summary(
            self.story,
            self.insights
        )

        # ==========================================
        # DATASET HEALTH
        # ==========================================

        add_health_score(
            self.story,
            self.insights
        )

        # ==========================================
        # MISSING VALUES
        # ==========================================

        add_missing_values(
            self.story,
            self.insights
        )

        # ==========================================
        # DATA VISUALIZATIONS
        # ==========================================

        add_all_charts(
            self.story
        )

        # ==========================================
        # OUTLIER ANALYSIS
        # ==========================================

        add_outlier_analysis(
            self.story,
            self.insights
        )

        # ==========================================
        # CORRELATION ANALYSIS
        # ==========================================

        add_strong_correlation_analysis(
            self.story,
            self.insights
        )

        # ==========================================
        # AI DATASET OVERVIEW
        # ==========================================

        add_dataset_overview(
            self.story,
            self.insights
        )

        # ==========================================
        # AI DATA QUALITY ANALYSIS
        # ==========================================

        add_data_quality_analysis(
            self.story,
            self.insights
        )

        # ==========================================
        # AI STATISTICAL ANALYSIS
        # ==========================================

        add_statistical_analysis(
            self.story,
            self.insights
        )

        # ==========================================
        # AI BUSINESS INSIGHTS
        # ==========================================

        add_business_insights(
            self.story,
            self.insights
        )

        # ==========================================
        # AI RISK ASSESSMENT
        # ==========================================

        add_risk_assessment(
            self.story,
            self.insights
        )

        # ==========================================
        # AI RECOMMENDATIONS
        # ==========================================

        add_ai_recommendations(
            self.story,
            self.insights
        )

        # ==========================================
        # CONCLUSION
        # ==========================================

        add_conclusion(
            self.story,
            self.insights
        )

        return (
            self.document,
            self.story,
            self.filename
        )