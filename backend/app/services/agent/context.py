from __future__ import annotations

from dataclasses import dataclass, field
from typing import Any

import pandas as pd


@dataclass(slots=True)
class AgentContext:
    """
    Shared execution context for a single
    AI Agent workflow.

    Every service reads from and writes
    to this object.
    """

    dataframe: pd.DataFrame

    target: str | None = None

    objective: str | None = None

    metadata: dict[str, Any] = field(
        default_factory=dict
    )

    cleaning: dict[str, Any] = field(
        default_factory=dict
    )

    analysis: dict[str, Any] = field(
        default_factory=dict
    )

    visualizations: dict[str, Any] = field(
        default_factory=dict
    )

    insights: dict[str, Any] = field(
        default_factory=dict
    )

    recommendations: dict[str, Any] = field(
        default_factory=dict
    )

    automl: dict[str, Any] = field(
        default_factory=dict
    )

    prediction: dict[str, Any] = field(
        default_factory=dict
    )

    explainability: dict[str, Any] = field(
        default_factory=dict
    )

    report: dict[str, Any] = field(
        default_factory=dict
    )
    workflow_id: str | None = None

    current_step: str = "initialized"

    completed_steps: list[str] = field(
        default_factory=list
    )

    warnings: list[str] = field(
        default_factory=list
    )

    errors: list[str] = field(
        default_factory=list
    )

    started_at: str | None = None

    finished_at: str | None = None

    success: bool = False

    def mark_step(
        self,
        step: str,
    ) -> None:
        """
        Mark a workflow step as completed.
        """

        self.current_step = step

        if step not in self.completed_steps:

            self.completed_steps.append(
                step
            )

    def add_warning(
        self,
        warning: str,
    ) -> None:
        """
        Store a workflow warning.
        """

        self.warnings.append(
            warning
        )

    def add_error(
        self,
        error: str,
    ) -> None:
        """
        Store a workflow error.
        """

        self.errors.append(
            error
        )

    def complete(
        self,
    ) -> None:
        """
        Mark workflow as completed.
        """

        self.success = True

        self.current_step = "completed"

    def to_dict(
        self,
    ) -> dict[str, Any]:
        """
        Serialize workflow context.
        """

        return {
            "workflow_id": self.workflow_id,
            "success": self.success,
            "current_step": self.current_step,
            "completed_steps": self.completed_steps,
            "warnings": self.warnings,
            "errors": self.errors,
            "metadata": self.metadata,
            "cleaning": self.cleaning,
            "analysis": self.analysis,
            "visualizations": self.visualizations,
            "insights": self.insights,
            "recommendations": self.recommendations,
            "automl": self.automl,
            "prediction": self.prediction,
            "explainability": self.explainability,
            "report": self.report,
        }