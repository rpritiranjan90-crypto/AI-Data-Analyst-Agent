"""
app/core/supabase.py
--------------------
Application-wide Supabase client singleton.
Uses the service_role key so RLS is bypassed — every request is
already scoped to the correct workspace via JWT workspace_id claim.
"""
from __future__ import annotations

import os
from functools import lru_cache

import supabase
from dotenv import load_dotenv

load_dotenv()


@lru_cache(maxsize=1)
def get_supabase_client() -> supabase.Client:
    url = os.environ.get("SUPABASE_URL", "").rstrip("/")
    key = os.environ.get("SUPABASE_SERVICE_KEY", "")

    if not url or not key:
        raise RuntimeError(
            "SUPABASE_URL and SUPABASE_SERVICE_KEY must be set. "
            "See docs/SUPABASE_SETUP.md for instructions."
        )

    return supabase.create_client(url, key)


# Short alias
def get_db() -> supabase.Client:
    return get_supabase_client()
