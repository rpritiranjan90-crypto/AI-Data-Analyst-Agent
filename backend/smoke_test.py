"""End-to-end smoke test for the AI Data Analyst Agent backend.

Run while the backend is listening on http://localhost:8000:
    pip install httpx
    python backend/smoke_test.py
"""
from __future__ import annotations

import io
import sys
import time

import httpx

BASE = "http://localhost:8000"
TIMEOUT = 30.0

# Tiny CSV payload used for upload
SAMPLE_CSV = b"name,age,score\nAlice,30,85\nBob,25,72\nCarol,40,90\nDave,35,68\nEve,28,95\n"

results: list[tuple[str, bool, str]] = []


def step(name: str, ok: bool, detail: str = "") -> None:
    results.append((name, ok, detail))
    icon = "[OK]" if ok else "[FAIL]"
    print(f"  {icon}  {name}  {detail}")


def main() -> int:
    with httpx.Client(base_url=BASE, timeout=TIMEOUT) as c:
        print("=" * 60)
        print("AI Data Analyst Agent - Smoke Test")
        print("=" * 60)

        # 1. Health
        r = c.get("/health")
        step("Health endpoint responds 200", r.status_code == 200, f"({r.status_code})")
        step("Health payload has 'status' field", r.status_code == 200 and "status" in r.json(), "")

        # 2. Security headers
        for h in ["content-security-policy", "x-frame-options", "x-content-type-options", "strict-transport-security"]:
            step(f"Security header: {h}", h in r.headers, "")

        # 3. Auth: register
        ts = int(time.time())
        email = f"smoke_{ts}@example.com"
        pw = "Smokepw123!"
        r = c.post("/api/auth/register", json={"email": email, "password": pw})
        step("Register new user", r.status_code in (200, 201), f"({r.status_code})")

        # 4. Auth: login
        r = c.post("/api/auth/login", json={"email": email, "password": pw})
        step("Login with new user", r.status_code == 200, f"({r.status_code})")
        token = r.json().get("access_token") or r.json().get("token", "")
        step("Login returns token", bool(token), "")
        auth = {"Authorization": f"Bearer {token}"} if token else {}

        # 5. Auth: me
        r = c.get("/api/auth/me", headers=auth)
        step("GET /api/auth/me", r.status_code == 200, f"({r.status_code})")

        # 6. Upload
        files = {"file": ("smoke.csv", io.BytesIO(SAMPLE_CSV), "text/csv")}
        r = c.post("/upload", files=files, headers=auth)
        step("Upload sample CSV", r.status_code == 200, f"({r.status_code})")
        if r.status_code == 200:
            step("Upload returns metadata", "metadata" in r.json(), "")

        # 7. Datasets list (paginated)
        r = c.get("/api/datasets/list", headers=auth)
        step("List datasets (paginated)", r.status_code == 200, f"({r.status_code})")
        if r.status_code == 200:
            p = r.json()
            step("List has has_next field", "has_next" in p, "")
            step("List has page field", "page" in p, "")

        # 8. Analysis summary
        r = c.get("/api/analysis/summary", headers=auth)
        step("Analysis summary", r.status_code == 200, f"({r.status_code})")

        # 9. Auto-clean
        r = c.post("/clean/auto-clean", headers=auth)
        step("Auto-clean dataset", r.status_code == 200, f"({r.status_code})")

        # 10. Chart generation
        r = c.post("/visualization/generate",
                    json={"chart_type": "histogram", "x_column": "age"}, headers=auth)
        step("Generate histogram", r.status_code == 200, f"({r.status_code})")
        if r.status_code == 200:
            step("Chart returns image_url", "image_url" in r.json(), "")

        # 11. Governance stats
        r = c.get("/api/governance/stats", headers=auth)
        step("Governance stats", r.status_code == 200, f"({r.status_code})")
        if r.status_code == 200:
            step("Governance has token_consumption", "token_consumption" in r.json(), "")

        # 12. AI usage
        r = c.get("/api/governance/usage", headers=auth)
        step("AI usage endpoint", r.status_code == 200, f"({r.status_code})")

        # 13. Admin stats
        r = c.get("/api/admin/stats", headers=auth)
        step("Admin stats", r.status_code == 200, f"({r.status_code})")

        # 14. Admin audit-logs (paginated)
        r = c.get("/api/admin/audit-logs?page=1&page_size=10", headers=auth)
        step("Audit logs (paginated)", r.status_code == 200, f"({r.status_code})")
        if r.status_code == 200:
            p = r.json()
            step("Audit has page+has_next", "page" in p and "has_next" in p, "")

        # 15. Readiness check
        r = c.get("/api/readiness/check", headers=auth)
        step("Production readiness check", r.status_code == 200, f"({r.status_code})")

    print("=" * 60)
    passed = sum(1 for _, ok, _ in results if ok)
    total = len(results)
    print(f"Result: {passed}/{total} checks passed")
    return 0 if passed == total else 1


if __name__ == "__main__":
    sys.exit(main())
