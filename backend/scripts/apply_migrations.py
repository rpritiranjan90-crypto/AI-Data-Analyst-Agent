"""
apply_migrations.py
------------------
Reads all .sql files in backend/migrations/ (in order) and executes them
against the Supabase project configured via environment variables.

Usage:
    python scripts/apply_migrations.py [--dry-run]

Environment variables required:
    SUPABASE_URL          e.g. https://xxxxxxxxxxxx.supabase.co
    SUPABASE_SERVICE_KEY  anon key (for RLS bypass, use service_role key instead)

The service role key is required to bypass RLS during migrations.
"""
from __future__ import annotations

import argparse
import os
import sys
from pathlib import Path

import httpx


def get_env_or_die(name: str) -> str:
    val = os.environ.get(name)
    if not val:
        sys.exit(f"[apply_migrations] ERROR: {name} is not set. Exiting.")
    return val


def get_migration_files() -> list[Path]:
    """Return sorted .sql files in the migrations directory."""
    migrations_dir = Path(__file__).parent.parent / "migrations"
    files = sorted(migrations_dir.glob("*.sql"))
    if not files:
        sys.exit(f"[apply_migrations] ERROR: no .sql files found in {migrations_dir}")
    return files


def apply_migration(sql: str, supabase_url: str, service_key: str) -> httpx.Response:
    """Execute raw SQL against the Supabase project via the management API."""
    # Supabase provides a /rest/v1/rpc/exec_sql endpoint in the pg_meta extension.
    # Alternatively we use the Supabase CLI management API.
    # For self-hosted / custom Supabase instances, fall back to direct HTTP.
    endpoint = f"{supabase_url}/rest/v1/rpc/exec"

    headers = {
        "apikey": service_key,
        "Authorization": f"Bearer {service_key}",
        "Content-Type": "application/json",
        "Prefer": "return=minimal",
    }

    payload = {"query": sql}

    try:
        response = httpx.post(endpoint, json=payload, headers=headers, timeout=60)
        return response
    except httpx.ConnectError as exc:
        # Fallback: if pg_net / rpc is not available, try the Supabase management API
        mgmt_endpoint = (
            f"https://api.supabase.com/v1/projects/"
            f"{supabase_url.split('//')[1].split('.')[0]}/database/query"
        )
        mgmt_headers = {
            "Authorization": f"Bearer {service_key}",
            "Content-Type": "application/json",
        }
        response = httpx.post(
            mgmt_endpoint,
            json={"query": sql},
            headers=mgmt_headers,
            timeout=120,
        )
        return response


def main() -> None:
    parser = argparse.ArgumentParser(description="Apply Supabase migrations")
    parser.add_argument(
        "--dry-run",
        action="store_true",
        help="Print SQL without executing it",
    )
    parser.add_argument(
        "--file",
        type=str,
        default=None,
        help="Apply only this file (relative to migrations/)",
    )
    args = parser.parse_args()

    supabase_url = get_env_or_die("SUPABASE_URL")
    service_key = get_env_or_die("SUPABASE_SERVICE_KEY")

    files = get_migration_files()
    if args.file:
        files = [f for f in files if f.name == args.file]
        if not files:
            sys.exit(f"[apply_migrations] ERROR: no migration named {args.file}")

    for migration_file in files:
        print(f"\n{'[DRY-RUN] ' if args.dry_run else ''}Applying: {migration_file.name}")
        sql = migration_file.read_text(encoding="utf-8")

        if args.dry_run:
            print("─" * 60)
            print(sql[:500] + ("..." if len(sql) > 500 else ""))
            print("─" * 60)
            continue

        response = apply_migration(sql, supabase_url, service_key)
        if response.status_code < 400:
            print(f"  ✓ {migration_file.name} applied successfully")
        else:
            print(f"  ✗ {migration_file.name} FAILED ({response.status_code})")
            print(f"    {response.text[:500]}")
            sys.exit(1)

    print("\n✓ All migrations applied.")


if __name__ == "__main__":
    main()
