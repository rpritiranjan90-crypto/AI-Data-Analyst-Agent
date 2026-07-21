from __future__ import annotations

from datetime import datetime
from uuid import uuid4

import pandas as pd

from app.services.agent.context import AgentContext

from app.services.analysis.analysis_service import (
    AnalysisService,
)

from app.services.cleaning.cleaning_service import (
    CleaningService,
)

from app.services.dataset.dataset_service import (
    DatasetService,
)

from app.services.insights.ai_insights_service import (
    AIInsightsService,
)

from app.services.ml.automl_service import (
    AutoMLService,
)

from app.services.ml.explainability_service import (
    ExplainabilityService,
)

from app.services.ml.prediction_service import (
    PredictionService,
)

from app.services.ml.recommendation_service import (
    RecommendationService,
)

from app.services.visualization.visualization_service import (
    VisualizationService,
)


class AgentOrchestrator:
    """
    Enterprise AI Agent Orchestrator.

    This class coordinates every backend module.

    It NEVER performs business logic.

    It only orchestrates services.
    """

    @classmethod
    def create_context(
        cls,
        dataframe: pd.DataFrame,
        target: str | None = None,
        objective: str | None = None,
    ) -> AgentContext:
        """
        Create a workflow execution context.
        """

        context = AgentContext(
            dataframe=dataframe,
            target=target,
            objective=objective,
        )

        context.workflow_id = str(
            uuid4()
        )

        context.started_at = (
            datetime.utcnow().isoformat()
        )

        return context
    @classmethod
    def analyze(
        cls,
        dataframe: pd.DataFrame,
        target: str | None = None,
        objective: str | None = None,
    ) -> dict:
        """
        Execute the complete AI workflow.
        """

        context = cls.create_context(
            dataframe=dataframe,
            target=target,
            objective=objective,
        )

        try:

            cls._validate(
                context,
            )

            cls._dataset_summary(
                context,
            )

            cls._analysis(
                context,
            )

            context.complete()

            context.finished_at = (
                datetime.utcnow().isoformat()
            )

            return context.to_dict()

        except Exception as error:

            context.add_error(
                str(error)
            )

            context.finished_at = (
                datetime.utcnow().isoformat()
            )

            return context.to_dict()

    @staticmethod
    def _validate(
        context: AgentContext,
    ) -> None:
        """
        Validate uploaded dataset.
        """

        context.mark_step(
            "dataset_validation"
        )

        DatasetService.validate_dataset(
            context.dataframe,
        )

    @staticmethod
    def _dataset_summary(
        context: AgentContext,
    ) -> None:
        """
        Generate dataset summary.
        """

        context.mark_step(
            "dataset_summary"
        )

        context.metadata = (
            DatasetService.dataset_summary(
                context.dataframe,
            )
        )

    @staticmethod
    def _analysis(
        context: AgentContext,
    ) -> None:
        """
        Execute exploratory analysis.
        """

        context.mark_step(
            "analysis"
        )

        context.analysis = (
            AnalysisService.dataset_analysis(
                context.dataframe,
            )
        )