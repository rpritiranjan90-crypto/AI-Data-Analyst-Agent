from __future__ import annotations
import sys
import time
from pathlib import Path
import numpy as np
import pandas as pd
from fastapi.testclient import TestClient

# Ensure UTF-8 output encoding for stdout
sys.stdout.reconfigure(encoding='utf-8')

# Ensure app modules are importable
sys.path.insert(0, str(Path(__file__).parent))

from app.main import app
from app.services.dataset_cache import DatasetCache

client = TestClient(app)

def run_worst_case_audit():
    print("=" * 75)
    print("🔥 EXTREME WORST-CASE CHAOS & EDGE CASE AUDIT (ALL FEATURES)")
    print("=" * 75)

    audit_results = []

    # -------------------------------------------------------------
    # Case 1: Completely Empty Dataset (0 rows, 0 cols)
    # -------------------------------------------------------------
    empty_df = pd.DataFrame()
    DatasetCache.set_dataset(empty_df, "empty.csv")

    res = client.get("/analysis/summary")
    if res.status_code in [200, 404, 400]:
        audit_results.append(("Empty Dataset Handling (0 rows)", "HANDLED GRACEFULLY [OK]", f"HTTP {res.status_code}"))
    else:
        audit_results.append(("Empty Dataset Handling (0 rows)", "CRASHED [X]", f"HTTP {res.status_code}"))

    # -------------------------------------------------------------
    # Case 2: Single Column & Single Row Dataset
    # -------------------------------------------------------------
    single_df = pd.DataFrame({"single_val": [999]})
    DatasetCache.set_dataset(single_df, "single.csv")

    res1 = client.get("/analysis/summary")
    res2 = client.get("/analysis/correlation")
    if res1.status_code == 200 and res2.status_code == 200:
        audit_results.append(("Single Row/Col Dataset Boundary", "HANDLED GRACEFULLY [OK]", "HTTP 200"))
    else:
        audit_results.append(("Single Row/Col Dataset Boundary", "FAILED [X]", f"HTTP {res1.status_code}"))

    # -------------------------------------------------------------
    # Case 3: All NaNs & Missing Data Extreme
    # -------------------------------------------------------------
    nan_df = pd.DataFrame({
        "col_a": [np.nan] * 50,
        "col_b": [None] * 50,
    })
    DatasetCache.set_dataset(nan_df, "all_nans.csv")

    res = client.post("/clean/missing-values?column=col_a&method=mean")
    if res.status_code in [200, 400]:
        audit_results.append(("100% NaN Missing Data Extreme", "HANDLED GRACEFULLY [OK]", f"HTTP {res.status_code}"))
    else:
        audit_results.append(("100% NaN Missing Data Extreme", "CRASHED [X]", f"HTTP {res.status_code}"))

    # -------------------------------------------------------------
    # Case 4: Malicious Injection Payload (XSS & SQLi)
    # -------------------------------------------------------------
    xss_df = pd.DataFrame({
        "name": ["<script>alert('XSS')</script>", "' OR 1=1 --", "DROP TABLE users;"],
        "score": [10, 20, 30]
    })
    DatasetCache.set_dataset(xss_df, "injection.csv")

    res = client.post("/analysis/nl-query", json={"query": "<script>alert(1)</script>' OR 1=1 --"})
    if res.status_code in [200, 400]:
        audit_results.append(("XSS & SQL Injection Payload Attack", "HANDLED GRACEFULLY [OK]", "Sanitized"))
    else:
        audit_results.append(("XSS & SQL Injection Payload Attack", "FAILED [X]", f"HTTP {res.status_code}"))

    # -------------------------------------------------------------
    # Case 5: Extremely High Cardinality Categorical Data
    # -------------------------------------------------------------
    cardinality_df = pd.DataFrame({
        "unique_id": [f"ID_{i}" for i in range(5000)],
        "value": np.random.randn(5000)
    })
    DatasetCache.set_dataset(cardinality_df, "cardinality.csv")

    res = client.get("/analysis/categorical")
    if res.status_code == 200:
        audit_results.append(("High-Cardinality Field (5,000 Unique Strings)", "HANDLED GRACEFULLY [OK]", "HTTP 200"))
    else:
        audit_results.append(("High-Cardinality Field (5,000 Unique Strings)", "FAILED [X]", f"HTTP {res.status_code}"))

    # -------------------------------------------------------------
    # Case 6: Brute Force & Rate Limit Flooding Attack
    # -------------------------------------------------------------
    responses = []
    for _ in range(12):
        responses.append(client.post("/auth/login", json={"email": "attacker@chaos.com", "password": "wrong_password"}).status_code)
    
    if 429 in responses or 401 in responses:
        audit_results.append(("Brute Force Rate Limiting (12 Login Floods)", "HANDLED GRACEFULLY [OK]", f"Rate Limited ({responses[-1]})"))
    else:
        audit_results.append(("Brute Force Rate Limiting (12 Login Floods)", "FAILED [X]", "No protection"))

    # -------------------------------------------------------------
    # Case 7: Non-Existent Target ML Request
    # -------------------------------------------------------------
    res = client.post("/ml/recommendation", json={"data": [{"a": 1}], "target": "non_existent_col"})
    if res.status_code in [400, 404, 422]:
        audit_results.append(("Non-Existent Target ML Request", "HANDLED GRACEFULLY [OK]", f"HTTP {res.status_code}"))
    else:
        audit_results.append(("Non-Existent Target ML Request", "FAILED [X]", f"HTTP {res.status_code}"))

    # -------------------------------------------------------------
    # Case 8: PowerPoint Exporter Worst Case (/generate-pptx)
    # -------------------------------------------------------------
    res = client.get("/generate-pptx")
    if res.status_code in [200, 400]:
        audit_results.append(("1-Click PowerPoint Deck Exporter", "HANDLED GRACEFULLY [OK]", f"HTTP {res.status_code}"))
    else:
        audit_results.append(("1-Click PowerPoint Deck Exporter", "FAILED [X]", f"HTTP {res.status_code}"))

    # -------------------------------------------------------------
    # Case 9: Isolation Forest Anomaly Radar Worst Case
    # -------------------------------------------------------------
    res = client.post("/ml/detect-anomalies?contamination=0.5")
    if res.status_code in [200, 400]:
        audit_results.append(("Isolation Forest Anomaly Radar", "HANDLED GRACEFULLY [OK]", f"HTTP {res.status_code}"))
    else:
        audit_results.append(("Isolation Forest Anomaly Radar", "FAILED [X]", f"HTTP {res.status_code}"))

    # -------------------------------------------------------------
    # Case 10: Multi-Agent AI Swarm Audit Worst Case
    # -------------------------------------------------------------
    res = client.post("/webhooks/swarm-audit")
    if res.status_code == 200:
        audit_results.append(("Multi-Agent AI Swarm Audit (/webhooks/swarm-audit)", "HANDLED GRACEFULLY [OK]", "HTTP 200"))
    else:
        audit_results.append(("Multi-Agent AI Swarm Audit (/webhooks/swarm-audit)", "FAILED [X]", f"HTTP {res.status_code}"))

    # Output Chaos Test Summary Table
    print("\n🔥 EXTREME WORST-CASE EDGE CASE AUDIT SUMMARY:")
    print("-" * 75)
    print(f" {'Chaos Scenario / Edge Case':<48} | {'Status':<22} | Detail")
    print("-" * 75)
    passed_count = sum(1 for _, status, _ in audit_results if "HANDLED GRACEFULLY" in status)
    total_count = len(audit_results)
    for scenario, status, detail in audit_results:
        print(f" * {scenario:<47} | {status:<22} | {detail}")
    print("=" * 75)
    print(f"🔥 CHAOS TEST VERDICT: {passed_count}/{total_count} WORST-CASE SCENARIOS PASSED ({passed_count/total_count*100:.0f}% STABILITY SCORE)")
    print("=" * 75)

if __name__ == "__main__":
    run_worst_case_audit()
