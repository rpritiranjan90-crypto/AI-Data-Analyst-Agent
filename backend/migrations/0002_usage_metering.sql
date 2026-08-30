-- ============================================================
-- AI Data Analyst Agent — Phase 2B Migration
-- Adds: workspace_usage (counters for usage metering)
-- Run:   python scripts/apply_migrations.py
-- ============================================================

BEGIN;

-- ─────────────────────────────────────────────
-- workspace_usage
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS workspace_usage (
    workspace_id          UUID PRIMARY KEY REFERENCES workspaces(id) ON DELETE CASCADE,
    rows_uploaded         BIGINT NOT NULL DEFAULT 0,
    ai_calls              BIGINT NOT NULL DEFAULT 0,
    reports_generated     BIGINT NOT NULL DEFAULT 0,
    ml_models_trained     BIGINT NOT NULL DEFAULT 0,
    current_period_start  TIMESTAMPTZ NOT NULL DEFAULT now(),
    last_activity_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at            TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE workspace_usage IS
  'Per-workspace usage counters for billing/metering. Reset each billing period.';

ALTER TABLE workspace_usage ENABLE ROW LEVEL SECURITY;

-- RLS: users can only see/update their own workspace's usage
CREATE POLICY "workspace_usage_select_own"
    ON workspace_usage FOR SELECT
    USING (workspace_id = (auth.jwt() ->> 'workspace_id')::uuid);

CREATE POLICY "workspace_usage_update_own"
    ON workspace_usage FOR UPDATE
    USING (workspace_id = (auth.jwt() ->> 'workspace_id')::uuid);

-- Auto-create usage row when workspace is created
CREATE OR REPLACE FUNCTION create_workspace_usage()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO workspace_usage (workspace_id, current_period_start)
    VALUES (NEW.id, now())
    ON CONFLICT (workspace_id) DO NOTHING;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS on_workspace_created ON workspaces;
CREATE TRIGGER on_workspace_created
    AFTER INSERT ON workspaces
    FOR EACH ROW EXECUTE FUNCTION create_workspace_usage();

-- Backfill usage rows for any existing workspaces
INSERT INTO workspace_usage (workspace_id, current_period_start)
SELECT id, now() FROM workspaces
ON CONFLICT (workspace_id) DO NOTHING;

COMMIT;
