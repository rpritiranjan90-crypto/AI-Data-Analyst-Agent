-- ============================================================
-- AI Data Analyst Agent — Phase 1 Migration
-- Creates: workspaces, users, workspace_members, datasets,
--          reports, charts, ml_models, audit_log, email_events
-- Run:   python scripts/apply_migrations.py
-- ============================================================

BEGIN;

-- ─────────────────────────────────────────────
-- workspaces
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS workspaces (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name            TEXT NOT NULL,
    owner_user_id   UUID NOT NULL,
    plan            TEXT NOT NULL DEFAULT 'free'
                    CHECK (plan IN ('free', 'pro', 'enterprise')),
    stripe_customer_id  TEXT,
    stripe_subscription_id TEXT,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE workspaces IS 'Top-level tenant container. Each paying account = one workspace.';

ALTER TABLE workspaces ENABLE ROW LEVEL SECURITY;

-- RLS: users can only read workspaces they belong to
CREATE POLICY "workspaces_select_own"
    ON workspaces FOR SELECT
    USING (
        id IN (
            SELECT workspace_id FROM workspace_members
            WHERE user_id = (auth.jwt() ->> 'user_id')::uuid
        )
    );

-- RLS: only workspace owner can update workspace settings
CREATE POLICY "workspaces_update_owner"
    ON workspaces FOR UPDATE
    USING (owner_user_id = (auth.jwt() ->> 'user_id')::uuid);

-- ─────────────────────────────────────────────
-- users
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS users (
    id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email                 TEXT NOT NULL UNIQUE,
    password_hash         TEXT NOT NULL,
    full_name             TEXT,
    avatar_url            TEXT,
    default_workspace_id  UUID REFERENCES workspaces(id) ON DELETE SET NULL,
    created_at            TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at            TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE users IS 'Application users. Auth is handled by this app (JWT), not Supabase Auth.';

ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- RLS: users can read their own record
CREATE POLICY "users_select_self"
    ON users FOR SELECT
    USING (id = (auth.jwt() ->> 'user_id')::uuid);

-- RLS: users can update their own profile
CREATE POLICY "users_update_self"
    ON users FOR UPDATE
    USING (id = (auth.jwt() ->> 'user_id')::uuid);

-- ─────────────────────────────────────────────
-- workspace_members
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS workspace_members (
    workspace_id  UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    user_id       UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role          TEXT NOT NULL DEFAULT 'member'
                  CHECK (role IN ('owner', 'admin', 'member', 'viewer')),
    invited_by    UUID REFERENCES users(id),
    joined_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
    PRIMARY KEY (workspace_id, user_id)
);

COMMENT ON TABLE workspace_members IS 'Maps users to workspaces with a role.';

ALTER TABLE workspace_members ENABLE ROW LEVEL SECURITY;

-- RLS: members can see who else is in their workspace
CREATE POLICY "members_select_own_workspace"
    ON workspace_members FOR SELECT
    USING (
        workspace_id IN (
            SELECT workspace_id FROM workspace_members
            WHERE user_id = (auth.jwt() ->> 'user_id')::uuid
        )
    );

-- RLS: workspace owner/admin can add/remove members
CREATE POLICY "members_manage_by_owner_admin"
    ON workspace_members FOR INSERT
    WITH CHECK (
        workspace_id IN (
            SELECT workspace_id FROM workspace_members
            WHERE  user_id  = (auth.jwt() ->> 'user_id')::uuid
              AND  role IN ('owner', 'admin')
        )
    );

CREATE POLICY "members_delete_by_owner_admin"
    ON workspace_members FOR DELETE
    USING (
        workspace_id IN (
            SELECT workspace_id FROM workspace_members
            WHERE  user_id  = (auth.jwt() ->> 'user_id')::uuid
              AND  role IN ('owner', 'admin')
        )
    );

-- ─────────────────────────────────────────────
-- datasets
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS datasets (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id    UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    name            TEXT NOT NULL,
    description     TEXT,
    storage_path    TEXT NOT NULL,          -- Supabase Storage path: datasets/wsid/did/filename
    original_name   TEXT,                   -- original uploaded filename
    file_size       BIGINT,                 -- bytes
    row_count       INTEGER,
    col_count       INTEGER,
    file_type       TEXT,                   -- csv, xlsx, json, parquet
    created_by      UUID REFERENCES users(id),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE datasets IS 'Uploaded dataset metadata. File bodies live in Supabase Storage.';

ALTER TABLE datasets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "datasets_workspace_isolation"
    ON datasets FOR ALL
    USING (workspace_id = (auth.jwt() ->> 'workspace_id')::uuid);

-- ─────────────────────────────────────────────
-- reports
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS reports (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id    UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    dataset_id      UUID REFERENCES datasets(id) ON DELETE SET NULL,
    name            TEXT NOT NULL,
    format          TEXT NOT NULL,          -- pdf, pptx
    storage_path    TEXT NOT NULL,
    file_size       BIGINT,
    created_by      UUID REFERENCES users(id),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE reports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "reports_workspace_isolation"
    ON reports FOR ALL
    USING (workspace_id = (auth.jwt() ->> 'workspace_id')::uuid);

-- ─────────────────────────────────────────────
-- charts
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS charts (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id    UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    dataset_id      UUID REFERENCES datasets(id) ON DELETE SET NULL,
    name            TEXT NOT NULL,
    chart_type      TEXT NOT NULL,
    storage_path    TEXT NOT NULL,
    config          JSONB,                 -- full Recharts/chart config
    created_by      UUID REFERENCES users(id),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE charts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "charts_workspace_isolation"
    ON charts FOR ALL
    USING (workspace_id = (auth.jwt() ->> 'workspace_id')::uuid);

-- ─────────────────────────────────────────────
-- ml_models
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS ml_models (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id    UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    dataset_id      UUID REFERENCES datasets(id) ON DELETE SET NULL,
    name            TEXT NOT NULL,
    model_type      TEXT NOT NULL,
    target_column   TEXT,
    metrics         JSONB,                 -- {accuracy, r2_score, f1, ...}
    storage_path    TEXT,
    created_by      UUID REFERENCES users(id),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE ml_models ENABLE ROW LEVEL SECURITY;

CREATE POLICY "ml_models_workspace_isolation"
    ON ml_models FOR ALL
    USING (workspace_id = (auth.jwt() ->> 'workspace_id')::uuid);

-- ─────────────────────────────────────────────
-- audit_log  (supplements in-memory ring buffer)
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS audit_log (
    id              BIGSERIAL PRIMARY KEY,
    workspace_id    UUID,
    user_id         UUID,
    action          TEXT NOT NULL,
    resource_type   TEXT,
    resource_id     TEXT,
    ip_address      INET,
    user_agent      TEXT,
    request_method  TEXT,
    request_path    TEXT,
    status_code     INTEGER,
    latency_ms      INTEGER,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE audit_log IS 'Append-only audit trail. workspace_id may be null for unauthenticated requests.';

ALTER TABLE audit_log ENABLE ROW LEVEL SECURITY;

-- Admins can read all audit entries for their workspaces
CREATE POLICY "audit_log_select_admin"
    ON audit_log FOR SELECT
    USING (
        workspace_id IN (
            SELECT workspace_id FROM workspace_members
            WHERE  user_id  = (auth.jwt() ->> 'user_id')::uuid
              AND  role IN ('owner', 'admin')
        )
    );

-- Everyone writes their own actions
CREATE POLICY "audit_log_insert_own"
    ON audit_log FOR INSERT
    WITH CHECK (
        user_id = (auth.jwt() ->> 'user_id')::uuid
        OR user_id IS NULL   -- allow unauthenticated writes from middleware
    );

-- ─────────────────────────────────────────────
-- email_events
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS email_events (
    id          BIGSERIAL PRIMARY KEY,
    user_id     UUID REFERENCES users(id) ON DELETE SET NULL,
    email       TEXT NOT NULL,
    type        TEXT NOT NULL,             -- reset_password | team_invite | payment_receipt
    resend_id   TEXT,
    status      TEXT NOT NULL DEFAULT 'sent',  -- sent | delivered | bounced | complained
    error       TEXT,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE email_events ENABLE ROW EMISSION;

ALTER TABLE email_events ENABLE ROW LEVEL SECURITY;

-- Admins can view email events for their workspace
CREATE POLICY "email_events_select_admin"
    ON email_events FOR SELECT
    USING (
        user_id IN (
            SELECT um.user_id FROM workspace_members um
            JOIN workspace_members self ON um.workspace_id = self.workspace_id
            WHERE self.user_id = (auth.jwt() ->> 'user_id')::uuid
              AND self.role IN ('owner', 'admin')
        )
    );

-- System inserts (via service role key) bypass RLS
-- INSERT-only from app via service role key

-- ─────────────────────────────────────────────
-- INDEXES
-- ─────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_datasets_workspace_id   ON datasets(workspace_id);
CREATE INDEX IF NOT EXISTS idx_datasets_created_by     ON datasets(created_by);
CREATE INDEX IF NOT EXISTS idx_reports_workspace_id   ON reports(workspace_id);
CREATE INDEX IF NOT EXISTS idx_charts_workspace_id    ON charts(workspace_id);
CREATE INDEX IF NOT EXISTS idx_ml_models_workspace_id ON ml_models(workspace_id);
CREATE INDEX IF NOT EXISTS idx_audit_log_workspace_id ON audit_log(workspace_id);
CREATE INDEX IF NOT EXISTS idx_audit_log_user_id     ON audit_log(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_log_created_at  ON audit_log(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_email_events_user_id  ON email_events(user_id);
CREATE INDEX IF NOT EXISTS idx_email_events_type    ON email_events(type);
CREATE INDEX IF NOT EXISTS idx_workspace_members_user_id ON workspace_members(user_id);

COMMIT;
