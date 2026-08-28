"""
Tests for the /api/readiness/check endpoint.
These endpoints allow unauthenticated access (MVP mode).
"""
from __future__ import annotations


def test_readiness_check_returns_score(client):
    """GET /api/readiness/check returns a readiness score without auth."""
    resp = client.get("/api/readiness/check")
    assert resp.status_code == 200, resp.json()
    data = resp.json()
    # Response uses 'total_score', 'max_score', 'grade', 'checks'
    assert "total_score" in data
    assert "max_score" in data
    assert "grade" in data
    assert "checks" in data
    assert isinstance(data["checks"], list)
    assert "environment" in data


def test_readiness_requires_auth(client):
    """Readiness checks allow guest access (no auth required)."""
    resp = client.get("/api/readiness/check")
    assert resp.status_code == 200, resp.json()
