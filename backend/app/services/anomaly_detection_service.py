from __future__ import annotations
from typing import Any
import pandas as pd
from sklearn.ensemble import IsolationForest
from app.services.dataset_cache import DatasetCache

class AnomalyDetectionService:
    """
    AI Anomaly & Fraud Detection Radar using Isolation Forest.
    """

    @staticmethod
    def detect_anomalies(contamination: float = 0.05) -> dict[str, Any]:
        df = DatasetCache.get_dataset()
        if df is None:
            return {"success": False, "message": "No active dataset loaded for anomaly detection."}

        numeric_df = df.select_dtypes(include=["number"]).dropna()
        if numeric_df.empty:
            return {"success": False, "message": "No numeric features available for anomaly detection."}

        model = IsolationForest(contamination=contamination, random_state=42)
        preds = model.fit_predict(numeric_df)
        anomaly_scores = model.decision_function(numeric_df)

        anomalies_found = int((preds == -1).sum())
        normal_count = int((preds == 1).sum())

        return {
            "success": True,
            "message": f"Isolation Forest Anomaly Radar detected {anomalies_found} anomalous records out of {len(numeric_df)} rows.",
            "total_records": len(numeric_df),
            "anomalies_count": anomalies_found,
            "normal_count": normal_count,
            "contamination_rate": contamination,
            "risk_score_summary": {
                "min_score": round(float(anomaly_scores.min()), 4),
                "max_score": round(float(anomaly_scores.max()), 4),
            }
        }
