"""
seed_demo.py
------------
Creates a demo workspace and admin user in Supabase, mirroring what was
previously hardcoded in auth_service.py (USERS_DB).

Run ONCE after apply_migrations.py when setting up the live demo URL.

Usage:
    python scripts/seed_demo.py

Environment variables required:
    SUPABASE_URL        e.g. https://xxxxxxxxxxxx.supabase.co
    SUPABASE_SERVICE_KEY  service_role key (bypasses RLS)
    JWT_SECRET          must match the value in Render env vars
"""
from __future__ import annotations

import hashlib
import os
import sys
import time
import uuid
from pathlib import Path

import httpx


# ── constants (must match auth_service.py) ──────────────────────
ITERATIONS = 100_000
SALT_BYTES = 16
DIGEST = "sha256"


def _get_env(name: str) -> str:
    val = os.environ.get(name)
    if not val:
        sys.exit(f"[seed_demo] ERROR: {name} is not set. Exiting.")
    return val


def _hash_password(password: str) -> str:
    """PBKDF2-SHA256, 100k iterations — mirrors auth_service.py."""
    salt = os.urandom(SALT_BYTES)
    key = hashlib.pbkdf2_hmac(DIGEST, password.encode(), salt, ITERATIONS)
    return f"{salt.hex()}${key.hex()}"


def _table_request(
    supabase_url: str,
    service_key: str,
    method: str,
    table: str,
    data: dict | None = None,
    params: dict | None = None,
    query: str | None = None,
) -> httpx.Response:
    base = f"{supabase_url}/rest/v1/{table}"
    headers = {
        "apikey": service_key,
        "Authorization": f"Bearer {service_key}",
        "Content-Type": "application/json",
        "Prefer": "return=representation",
    }
    if query:
        base += f"?name=eq.{query}"
    client = httpx.Client(timeout=30)
    if method == "GET":
        return client.get(base, headers=headers, params=params)
    elif method == "POST":
        return client.post(base, headers=headers, json=data)
    elif method == "PATCH":
        return client.patch(base, headers=headers, json=data, params=params)
    elif method == "DELETE":
        return client.delete(base, headers=headers, params=params)
    else:
        raise ValueError(f"Unknown method: {method}")


def main() -> None:
    supabase_url = _get_env("SUPABASE_URL")
    service_key = _get_env("SUPABASE_SERVICE_KEY")

    admin_email = "admin@aianalyst.com"
    admin_password = "Admin@123456"
    admin_name = "Data Analyst Admin"
    workspace_name = "AI Analyst Demo"
    demo_password_hash = _hash_password(admin_password)

    # ── 1. Create user ─────────────────────────────────────────
    user_id = str(uuid.uuid4())
    user_payload = {
        "id": user_id,
        "email": admin_email,
        "password_hash": demo_password_hash,
        "full_name": admin_name,
    }

    resp = _table_request(supabase_url, service_key, "POST", "users", data=user_payload)
    if resp.status_code in (201, 409):  # 409 = already exists
        if resp.status_code == 409:
            print("  ℹ  User already exists — skipping user creation.")
            # Look up existing user ID
            get_resp = _table_request(
                supabase_url, service_key, "GET",
                "users", params={"email": f"eq.{admin_email}"}
            )
            if get_resp.status_code == 200:
                existing = get_resp.json()
                if existing:
                    user_id = existing[0]["id"]
                    print(f"  ℹ  Using existing user ID: {user_id}")
            else:
                sys.exit(f"  ✗ Could not look up existing user: {get_resp.text}")
        else:
            print("  ✓ User created.")
    else:
        print(f"  ✗ User creation failed: {resp.status_code} {resp.text}")
        # Don't exit — workspace might still work

    # ── 2. Create demo workspace ────────────────────────────────
    ws_id = str(uuid.uuid4())
    ws_payload = {
        "id": ws_id,
        "name": workspace_name,
        "owner_user_id": user_id,
        "plan": "free",
    }

    resp = _table_request(supabase_url, service_key, "POST", "workspaces", data=ws_payload)
    if resp.status_code in (201, 409):
        if resp.status_code == 409:
            print("  ℹ  Workspace already exists — skipping workspace creation.")
            get_resp = _table_request(
                supabase_url, service_key, "GET",
                "workspaces", params={"owner_user_id": f"eq.{user_id}"}
            )
            if get_resp.status_code == 200:
                existing = get_resp.json()
                if existing:
                    ws_id = existing[0]["id"]
                    print(f"  ℹ  Using existing workspace ID: {ws_id}")
    else:
        print(f"  ✗ Workspace creation failed: {resp.status_code} {resp.text}")

    # ── 3. Add workspace_member entry ─────────────────────────────
    member_payload = {
        "workspace_id": ws_id,
        "user_id": user_id,
        "role": "owner",
        "invited_by": user_id,
    }
    resp = _table_request(
        supabase_url, service_key, "POST", "workspace_members", data=member_payload
    )
    if resp.status_code in (201, 409):
        print("  ✓ Workspace membership created.")
    else:
        print(f"  ℹ  Workspace membership: {resp.status_code} (may already exist)")

    # ── 4. Update user's default_workspace_id ────────────────────
    patch_resp = _table_request(
        supabase_url, service_key, "PATCH",
        "users",
        data={"default_workspace_id": ws_id},
        params={"id": f"eq.{user_id}"},
    )
    if patch_resp.status_code < 400:
        print("  ✓ User default_workspace_id set.")
    else:
        print(f"  ℹ  User default_workspace_id update: {patch_resp.status_code}")

    print("\n✓ Demo seed complete.")
    print(f"\n  Admin credentials (use on the live app):")
    print(f"  Email:    {admin_email}")
    print(f"  Password: {admin_password}")
    print(f"  Workspace: {workspace_name} (id: {ws_id})")


if __name__ == "__main__":
    main()
