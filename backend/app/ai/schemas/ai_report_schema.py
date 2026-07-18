from pydantic import BaseModel


class AIReport(BaseModel):
    executive_summary: str
    dataset_overview: str
    data_quality: str
    statistical_analysis: str
    chart_interpretation: str
    business_insights: str
    risk_assessment: str
    recommendations: str
    conclusion: str