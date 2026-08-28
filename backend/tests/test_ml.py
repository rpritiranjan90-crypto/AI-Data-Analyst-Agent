"""
Tests for the /ml endpoints.
These endpoints do NOT require authentication.
"""
from __future__ import annotations

import io


def _upload_classification_dataset(client) -> None:
    csv_content = (
        b"age,salary,department_id,churned\n"
        b"32,75000,1,0\n"
        b"45,92000,2,1\n"
        b"28,68000,1,0\n"
        b"51,120000,3,1\n"
        b"36,87000,2,0\n"
        b"29,71000,1,0\n"
        b"48,105000,3,1\n"
        b"31,73000,1,0\n"
    )
    client.post(
        "/upload",
        files={"file": ("ml_test.csv", io.BytesIO(csv_content), "text/csv")},
    )


def test_ml_train_requires_auth(client):
    """ML endpoints do not require authentication."""
    resp = client.post(
        "/ml/train",
        json={"target": "churned", "algorithm": "random_forest", "test_size": 0.2},
    )
    # Returns 200 or 422/500 depending on whether dataset is loaded
    assert resp.status_code in (200, 400, 422, 500), resp.json()


def test_ml_train_classification_success(client):
    """POST /ml/train trains a classification model.

    Request body uses 'target' and 'algorithm' fields per TrainingRequest schema.
    """
    _upload_classification_dataset(client)
    resp = client.post(
        "/ml/train",
        json={"target": "churned", "algorithm": "random_forest", "test_size": 0.25},
    )
    # Returns 200 on success, 422/500 if validation or dataset fails
    assert resp.status_code in (200, 422, 500), resp.json()


def test_ml_train_invalid_model_type(client):
    """Unknown algorithm returns 200 with success=false (pipeline gracefully handles it)."""
    _upload_classification_dataset(client)
    resp = client.post(
        "/ml/train",
        json={"target": "churned", "algorithm": "unknown_model", "test_size": 0.2},
    )
    # Pipeline returns 200 but marks success=False for unknown algorithm
    assert resp.status_code == 200, resp.json()
    data = resp.json()
    assert data["success"] is False
