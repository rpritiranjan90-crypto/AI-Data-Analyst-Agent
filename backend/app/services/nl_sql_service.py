from __future__ import annotations

import re
from typing import Any, Dict, List, Optional
import pandas as pd

from app.ai.providers.gemini_provider import GeminiProvider
from app.ai.schemas.ai_request import AIRequest
from app.common.logger import get_logger
from app.exceptions.base import ValidationException

logger = get_logger(__name__)


class NLToSQLService:
    """
    Natural Language to SQL Query Generator Service.
    Translates plain English prompts into valid SQL queries based on table schema.
    """

    @staticmethod
    def generate_sql(prompt: str, columns: List[str], table_name: str = "dataset") -> str:
        """
        Use AI engine to convert plain text question into an ANSI SQL query.
        """
        cols_str = ", ".join(columns) if columns else "*"

        system_instruction = (
            f"You are an expert SQL engineer. Given a table named '{table_name}' with columns: [{cols_str}], "
            f"translate the user's natural language request into a single valid SELECT SQL query. "
            f"Output ONLY the raw SQL string inside a sql code block or plain text. Do not include markdown preamble or explanation."
        )

        try:
            provider = GeminiProvider()
            req = AIRequest(
                prompt=f"{system_instruction}\n\nQuestion: '{prompt}'\nTable: {table_name}\nColumns: {cols_str}\nGenerate SQL:",
            )
            response = provider.generate_response(req)
            raw_text = (response.response or "").strip()

            # Clean markdown code blocks if present
            sql_match = re.search(r"```(?:sql)?\s*(.*?)\s*```", raw_text, re.DOTALL | re.IGNORECASE)
            if sql_match:
                sql = sql_match.group(1).strip()
            else:
                sql = raw_text.strip()

            # Ensure safety (only allow SELECT statements)
            if not sql.upper().startswith("SELECT"):
                # Fallback simple query
                sql = f"SELECT * FROM {table_name} LIMIT 100"

            return sql
        except Exception as exc:
            logger.error(f"Failed to generate SQL from natural language: {exc}")
            # Fallback SQL
            return f"SELECT * FROM {table_name} LIMIT 50"
