-- ============================================================
-- AI Data Analyst Agent — Phase 2D Migration
-- Adds: workspace_onboarding (onboarding checklist state)
-- Run:   python scripts/apply_migrations.py
-- ============================================================

BEGIN;

CREATE TABLE IF NOT EXISTS workspace_onboarding (
    workspace_id  UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    step_id       TEXT NOT NULL,
    completed_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
    PRIMARY KEY (workspace_id, step_id)
);

COMMENT ON TABLE workspace_onboarding IS
  'Onboarding step completion tracking. Each row = one completed step.';

ALTER TABLE workspace_onboarding ENABLE ROW LEVEL SECURITY;

-- RLS: members can see/update their own workspace's onboarding state
CREATE POLICY "workspace_onboarding_select_own"
    ON workspace_onboarding FOR SELECT
    USING (workspace_id = (auth.jwt() ->> 'workspace_id')::uuid);

CREATE POLICY "workspace_onboarding_insert_own"
    ON workspace_onboarding FOR INSERT
    WITH CHECK (workspace_id = (auth.jwt() ->> 'workspace_id')::uuid);

CREATE POLICY "workspace_onboarding_update_own"
    ON workspace_onboarding FOR UPDATE
    USING (workspace_id = (auth.jwt() ->> 'workspace_id')::uuid);

COMMIT;
