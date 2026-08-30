-- ============================================================
-- AI Data Analyst Agent — Phase 2C Migration
-- Adds: gdpr_export_requests (GDPR data export queue)
-- Run:   python scripts/apply_migrations.py
-- ============================================================

BEGIN;

CREATE TABLE IF NOT EXISTS gdpr_export_requests (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    workspace_id    UUID REFERENCES workspaces(id) ON DELETE CASCADE,
    status          TEXT NOT NULL DEFAULT 'pending'
                    CHECK (status IN ('pending', 'processing', 'ready', 'expired', 'failed')),
    expires_at      TIMESTAMPTZ,
    storage_path    TEXT,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    completed_at    TIMESTAMPTZ
);

COMMENT ON TABLE gdpr_export_requests IS
  'GDPR Article 20 data portability — stores export job metadata.';

ALTER TABLE gdpr_export_requests ENABLE ROW LEVEL SECURITY;

-- RLS: users can only see/delete their own export requests
CREATE POLICY "gdpr_export_own"
    ON gdpr_export_requests FOR ALL
    USING (user_id = (auth.jwt() ->> 'user_id')::uuid);

COMMIT;
