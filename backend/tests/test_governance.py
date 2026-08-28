"""
Tests for the /api/governance/stats endpoint.
These endpoints allow unauthenticated access (MVP mode).
"""
from __future__ import annotations


def test_governance_stats_success(client):
    """GET /api/governance/stats returns governance metrics without auth."""
    resp = client.get("/api/governance/stats")
    assert resp.status_code == 200, resp.json()
    data = resp.json()
    # Response uses GovernanceStatsResponse fields:
    # token_consumption, request_metrics, ai_provider_status, safety_policies
    assert "token_consumption" in data
    assert "request_metrics" in data
    assert "ai_provider_status" in data
    assert "safety_policies" in data


def test_governance_stats_requires_auth(client):
    """Governance stats allow guest access (no auth required)."""
    resp = client.get("/api/governance/stats")
    assert resp.status_code == 200, resp.json()


def test_governance_record_metrics(client):
    """POST /api/governance/record accepts metrics without auth."""
    resp = client.post(
        "/api/governance/record",
        json={"tokens": 100, "latency_ms": 500, "success": True},
    )
    assert resp.status_code == 200, resp.json()


def test_governance_health(client):
    """GET /api/governance/health returns AI provider health."""
    resp = client.get("/api/governance/health")
    assert resp.status_code == 200, resp.json()
    data = resp.json()
    assert "provider" in data
    assert "status" in data
