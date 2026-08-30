# Supabase Setup — Free Persistent Database

> Supabase gives you a hosted PostgreSQL database, Row Level Security (RLS),
> and file storage — all on the free tier (500 MB database, 1 GB storage).
> This replaces the in-memory `USERS_DB` and filesystem storage, making your
> app persistent across restarts.

---

## Step 1 — Create a Supabase Project

1. Go to [https://supabase.com](https://supabase.com) and sign up (free).
2. Click **New Project** → give it a name like `ai-data-analyst`.
3. Choose a region close to your users.
4. Save the **Database Password** somewhere safe — you'll need it.
5. Wait ~2 minutes for the project to provision.

---

## Step 2 — Get Your API Keys

1. Go to **Project Settings → API** in the Supabase dashboard.
2. Copy these two values:

| Variable | Where to find it |
|---|---|
| `SUPABASE_URL` | Near the top: `https://xxxxxxxxxxxx.supabase.co` |
| `SUPABASE_SERVICE_KEY` | Under "service_role" in the API keys table (NOT the `anon` key) |

> **Security:** The `service_role` key bypasses Row Level Security — never expose it to the browser. It stays only in the backend's environment.

---

## Step 3 — Run the Database Migration

On your local machine (or CI), set the env vars and run the migration script:

```bash
cd backend
export SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
export SUPABASE_SERVICE_KEY=eyJhbGc...   # service_role key
python scripts/apply_migrations.py
```

Expected output:
```
Applying: 0001_init.sql
  ✓ 0001_init.sql applied successfully.

✓ All migrations applied.
```

---

## Step 4 — Seed the Demo User

The migration creates the schema, but no data. Run the seed script to create the
`admin@aianalyst.com` demo account:

```bash
cd backend
export SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
export SUPABASE_SERVICE_KEY=eyJhbGc...
python scripts/seed_demo.py
```

Expected output:
```
  ✓ User created.
  ✓ Workspace created.
  ✓ Workspace membership created.
  ✓ User default_workspace_id set.

✓ Demo seed complete.

  Admin credentials (use on the live app):
  Email:    admin@aianalyst.com
  Password:  Admin@123456
  Workspace: AI Analyst Demo (id: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx)
```

---

## Step 5 — Add the Env Vars to Render

1. Go to your Render dashboard → **Backend Web Service → Environment**.
2. Add these two new variables:

```
SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
SUPABASE_SERVICE_KEY=eyJhbGc...     # service_role key
```

3. **Remove** `JWT_SECRET` fallback — set a real `JWT_SECRET` too:
   ```bash
   python -c "import secrets; print(secrets.token_urlsafe(48))"
   ```

4. Click **Save Changes** → the service will redeploy automatically.

---

## Step 6 — Verify

```bash
# Test the backend health (should still be 200)
curl https://ai-data-analyst-agent-xs7p.onrender.com/health

# Test a login with the seeded admin user
curl -X POST https://ai-data-analyst-agent-xs7p.onrender.com/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@aianalyst.com","password":"Admin@123456"}'
# Should return a JWT with a workspace_id claim
```

In the Supabase dashboard, open **Table Editor → users** — you should see the admin row.
Open **workspaces** — you should see the `AI Analyst Demo` row.

---

## How the Schema Works

Every table has **Row Level Security (RLS)** enabled. The key policy pattern:

```sql
CREATE POLICY "datasets_workspace_isolation"
  ON datasets FOR ALL
  USING (workspace_id = (auth.jwt() ->> 'workspace_id')::uuid);
```

This means: even if a user somehow injects a different `workspace_id` in their JWT,
PostgreSQL enforces that they can only read/write their own workspace's rows.
Supabase resolves `auth.jwt()` from the `Authorization: Bearer <token>` header automatically.

---

## Supabase Free Tier Limits

| Resource | Free Limit | Overage |
|---|---|---|
| PostgreSQL database | 500 MB | $5/GB/month |
| Storage (file uploads) | 1 GB | $0.99/GB/month |
| Egress bandwidth | 2 GB/month | $0.50/GB |
| Email (via Resend, not Supabase) | — | — |

This is enough for ~50 active users on a demo/pilot.

---

## Troubleshooting

**"relation does not exist" error after migration:**
Wait 2 minutes — Supabase takes a moment to propagate the schema. Retry the migration script.

**"JWT payload missing workspace_id":**
This means the user logged in before the migration was applied, or Supabase returned a stale JWT. Log out and log back in — the login endpoint re-issues a fresh JWT.

**Migration script fails with 403:**
You're using the `anon` key instead of the `service_role` key. The anon key can't bypass RLS, which is needed for the migration. Get the service_role key from **Project Settings → API**.
