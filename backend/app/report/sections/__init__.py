from .cover import add_cover_page

from .metadata import add_report_metadata

from .dataset import add_dataset_summary

from .quality import (
    add_health_score,
    add_missing_values,
    add_outlier_analysis,
    add_strong_correlation_analysis,
)

from .ai_sections import (
    add_executive_summary,
    add_dataset_overview,
    add_data_quality_analysis,
    add_statistical_analysis,
    add_business_insights,
    add_risk_assessment,
    add_conclusion,
)
from .recommendations import (
    add_ai_recommendations,
)