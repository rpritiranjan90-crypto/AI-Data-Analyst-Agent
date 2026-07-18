import os

from app.services.ai_insights_service import generate_ai_insights
from app.services.ai_report_service import AIReportService
from app.report.builder import ReportBuilder
from app.report.page_template import PageTemplate

ai_service = AIReportService()


def generate_report():

    # Generate dataset insights
    insights = generate_ai_insights()

    # Generate AI report
    ai_report = ai_service.generate_report(
        insights
    )

    # Merge AI report into insights
    insights["executive_summary"] = (
        ai_report.executive_summary
    )

    insights["dataset_overview"] = (
        ai_report.dataset_overview
    )

    insights["data_quality"] = (
        ai_report.data_quality
    )

    insights["statistical_analysis"] = (
        ai_report.statistical_analysis
    )

    insights["chart_interpretation"] = (
        ai_report.chart_interpretation
    )

    insights["business_insights"] = (
        ai_report.business_insights
    )

    insights["risk_assessment"] = (
        ai_report.risk_assessment
    )

    insights["conclusion"] = (
        ai_report.conclusion
    )

    # Keep AI recommendations separate so existing list-based
    # recommendations continue to work.
    insights["ai_recommendations"] = (
        ai_report.recommendations
    )

    # Build PDF
    builder = ReportBuilder(
        insights
    )

    document, story, filename = builder.build()

    document.build(
        story,
        onFirstPage=PageTemplate.draw,
        onLaterPages=PageTemplate.draw,
)

    return {
        "success": True,
        "message": "PDF Report Generated Successfully",
        "report": os.path.basename(filename)
    }


def list_reports():

    REPORT_FOLDER = "reports"

    if not os.path.exists(REPORT_FOLDER):
        return {
            "success": False,
            "message": "No reports folder found."
        }

    reports = sorted(
        [
            file
            for file in os.listdir(REPORT_FOLDER)
            if file.endswith(".pdf")
        ],
        reverse=True
    )

    return {
        "success": True,
        "total_reports": len(reports),
        "reports": reports
    }


def download_report(filename):

    from fastapi.responses import FileResponse

    file_path = os.path.join(
        "reports",
        filename
    )

    if not os.path.exists(file_path):
        return {
            "success": False,
            "message": "Report not found."
        }

    return FileResponse(
        path=file_path,
        media_type="application/pdf",
        filename=filename
    )


def delete_report(filename):

    file_path = os.path.join(
        "reports",
        filename
    )

    if not os.path.exists(file_path):
        return {
            "success": False,
            "message": "Report not found."
        }

    os.remove(file_path)

    return {
        "success": True,
        "message": f"{filename} deleted successfully."
    }