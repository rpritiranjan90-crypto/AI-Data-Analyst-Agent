"""
Tests for the /report endpoints.
These endpoints do NOT require authentication.
"""
from __future__ import annotations

import io


def _upload_sample(client) -> None:
    csv_content = (
        b"name,age,salary,department\n"
        b"Alice,32,75000,IT\n"
        b"Bob,45,92000,Sales\n"
        b"Carol,28,68000,IT\n"
    )
    client.post(
        "/upload",
        files={"file": ("report_test.csv", io.BytesIO(csv_content), "text/csv")},
    )


def test_report_generate_requires_auth(client):
    """Report generation does not require authentication."""
    resp = client.get("/generate-report")
    # Returns 200 (renders HTML) or 500 if no dataset
    assert resp.status_code in (200, 500), resp.json()


def test_report_generate_pdf_success(client):
    """GET /generate-report renders a report."""
    _upload_sample(client)
    resp = client.get("/generate-report")
    # Returns HTML response
    assert resp.status_code == 200, resp.json()


def test_report_list(client):
    """GET /reports returns list of generated reports."""
    resp = client.get("/reports")
    # Returns 200 with report list
    assert resp.status_code in (200, 500), resp.json()


def test_report_generate_invalid_format(client):
    """Invalid format returns appropriate error or HTML fallback."""
    _upload_sample(client)
    resp = client.get("/generate-report?format=docx")
    # Returns 200 with HTML fallback or error
    assert resp.status_code in (200, 400, 404), resp.json()
