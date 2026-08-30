# Pricing — Plan Limits & Feature Gates

> This document describes what each plan tier unlocks in terms of actual
> backend limits. These limits are enforced server-side so clients can't
> bypass them by modifying the frontend.

---

## Plan Tiers

| | Free | Pro ($29/mo) | Enterprise ($299/mo) |
|---|---|---|---|
| **Upload limits** | | | |
| Max file size | 10 MB | 100 MB | Unlimited |
| Max rows per dataset | 50,000 | 500,000 | Unlimited |
| Storage (Supabase) | 100 MB | 1 GB | 10 GB |
| Max datasets | 5 | 50 | Unlimited |
| **AI limits** | | | |
| AI insights / day | 10 | 100 | Unlimited |
| AI copilot queries / day | 20 | 500 | Unlimited |
| RAG documents | 5 | 50 | 500 |
| **ML limits** | | | |
| AutoML training | ✗ | ✓ | ✓ |
| Max training rows | — | 200,000 | Unlimited |
| Saved ML models | 2 | 20 | Unlimited |
| **Features** | | | |
| Charts | 19 types | 19 types + PNG export | 19 types + PNG + SVG |
| Data cleaning ops | Basic | All | All + batch |
| Reports | PDF preview | PDF + PPTX | PDF + PPTX + branded |
| Team members | 1 | 10 | Unlimited |
| Webhooks | ✗ | ✗ | ✓ |
| Priority support | ✗ | ✗ | ✓ |

---

## How Limits Are Enforced

Limits are enforced at the **FastAPI route level** using the `require_plan()` dependency from `app/core/auth_deps.py`.

Example — enforcing max file size:

```python
# backend/app/routes/upload.py
from app.core.auth_deps import RequireProDep

@router.post("/upload")
def upload(
    file: UploadFile,
    user: RequireProDep,   # Pro or Enterprise required for files > 10MB
    workspace_id: WorkspaceIDDep,
):
    if file.size > 100 * 1024 * 1024:
        raise HTTPException(402, "This file exceeds the 100MB Pro limit.")
    # ... rest of upload logic
```

Example — enforcing AI request limits:

```python
# backend/app/services/ai_token_tracker.py
def check_ai_limit(workspace_id: str, plan: str) -> bool:
    daily_limit = {"free": 10, "pro": 100, "enterprise": float("inf")}
    used = get_daily_ai_requests(workspace_id)
    return used < daily_limit.get(plan, 0)
```

---

## Changing Limits

To adjust limits, edit these files:

| Limit type | Where to edit |
|---|---|
| File size | `backend/app/routes/upload.py` |
| AI requests/day | `backend/app/services/ai_token_tracker.py` |
| ML training rows | `backend/app/routes/ml.py` |
| Team member cap | `backend/app/routes/workspaces.py` |
| Storage quota | `backend/app/services/storage_service.py` |

After editing, push to `main` — CI/CD automatically deploys to Render.

---

## Usage Metering (Phase 2)

Phase 1 does not yet implement live usage counters. Phase 2 will add:

- `workspace_usage` table in Supabase tracking: rows_uploaded, ai_requests, reports_generated, ml_models_trained.
- Daily reset of AI request counters.
- Warning banner when user is at 80% of their plan limit.
- Admin view in `/admin` showing all workspaces and their usage.

---

## Plan Upgrade Flow

```
User clicks "Upgrade to Pro"
        ↓
Frontend → POST /billing/checkout {plan: "pro"}
        ↓
Backend creates Stripe Checkout session
        ↓
User enters card in Stripe Checkout
        ↓
Stripe → POST /webhooks/stripe (checkout.session.completed)
        ↓
Backend → Supabase: UPDATE workspaces SET plan='pro' WHERE id=workspace_id
        ↓
Frontend → POST /billing/confirm?session_id=...
        ↓
User redirected to /billing/success → sees success message
        ↓
Workspace plan in Supabase is now 'pro' → all Pro features unlocked
```

---

## Plan Downgrade Flow

```
User goes to /settings/workspace → "Manage Billing"
        ↓
Opens Stripe Customer Portal
        ↓
Cancels or downgrades subscription
        ↓
Stripe → POST /webhooks/stripe (customer.subscription.updated / deleted)
        ↓
Backend → Supabase: UPDATE workspaces SET plan='free' WHERE id=workspace_id
        ↓
User's access to Pro features is revoked on next API call
```

> **Note:** On downgrade, existing Pro features (saved ML models, charts) remain accessible,
> but new Pro actions (uploading >10MB, training AutoML) are blocked immediately.
