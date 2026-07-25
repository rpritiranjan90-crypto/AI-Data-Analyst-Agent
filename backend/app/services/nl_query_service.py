from __future__ import annotations
import re
from typing import Any
import pandas as pd
from app.services.duckdb_service import DuckDBService


class NaturalLanguageQueryService:
    """
    Natural Language Query & Data Conversation Engine.
    Converts plain English queries into pandas operations & DuckDB SQL queries.
    """

    @staticmethod
    def process_query(dataframe: pd.DataFrame, query: str) -> dict[str, Any]:
        q_lower = query.lower().strip()
        cols = dataframe.columns.tolist()
        num_cols = dataframe.select_dtypes(include=["number"]).columns.tolist()
        cat_cols = dataframe.select_dtypes(include=["object", "category"]).columns.tolist()

        # 1. Top N records
        match_top = re.search(r"top\s+(\d+)", q_lower)
        limit = int(match_top.group(1)) if match_top else 10

        # Check for column references in query
        matched_num_col = next((c for c in num_cols if c.lower() in q_lower), num_cols[0] if num_cols else None)
        matched_cat_col = next((c for c in cat_cols if c.lower() in q_lower), cat_cols[0] if cat_cols else None)

        if "missing" in q_lower or "null" in q_lower:
            missing_counts = dataframe.isna().sum().to_dict()
            return {
                "query": query,
                "result_type": "table",
                "summary": "Missing data count for all columns in active dataset.",
                "data": [{"column": k, "missing_count": int(v)} for k, v in missing_counts.items()],
                "code": "df.isna().sum()",
            }

        if ("top" in q_lower or "highest" in q_lower or "max" in q_lower) and matched_num_col:
            sql = f'SELECT * FROM dataset ORDER BY "{matched_num_col}" DESC LIMIT {limit}'
            res_data = DuckDBService.query(dataframe, sql)
            return {
                "query": query,
                "result_type": "table",
                "summary": f"Top {limit} records sorted by highest '{matched_num_col}'.",
                "data": res_data,
                "code": f'df.sort_values(by="{matched_num_col}", ascending=False).head({limit})',
            }

        if ("group" in q_lower or "by" in q_lower or "average" in q_lower or "sum" in q_lower) and matched_cat_col and matched_num_col:
            agg_func = "SUM" if "sum" in q_lower or "total" in q_lower else "AVG"
            sql = f'SELECT "{matched_cat_col}", {agg_func}("{matched_num_col}") as aggregate_value FROM dataset GROUP BY "{matched_cat_col}" ORDER BY aggregate_value DESC LIMIT {limit}'
            res_data = DuckDBService.query(dataframe, sql)
            return {
                "query": query,
                "result_type": "table",
                "summary": f"{agg_func.title()} of '{matched_num_col}' grouped by '{matched_cat_col}'.",
                "data": res_data,
                "code": f'df.groupby("{matched_cat_col}")["{matched_num_col}"].{agg_func.lower()}()',
            }

        # Fallback: General preview / filter query
        sql = f"SELECT * FROM dataset LIMIT {limit}"
        res_data = DuckDBService.query(dataframe, sql)
        return {
            "query": query,
            "result_type": "table",
            "summary": f"Sample dataset records ({limit} rows) matching query.",
            "data": res_data,
            "code": f"df.head({limit})",
        }
