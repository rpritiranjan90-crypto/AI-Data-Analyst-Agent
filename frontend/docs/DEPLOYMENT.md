# Deployment Guide

> This guide covers deploying the AI Data Analyst frontend to Vercel and connecting it to the FastAPI backend.

---

## Architecture

```
Browser → Vercel CDN (frontend)
              ↓ env: VITE_API_URL
           FastAPI backend (Render / Railway / Fly.io)
```

- **Frontend:** React 19 + Vite 8, deployed to Vercel
- **Backend:** FastAPI, deployed separately (not in this repo)
- **Auth:** JWT in `localStorage` → migrate to httpOnly cookies (see Security below)

---

## Environment Variables

All are required at build time (Vercel → Settings → Environment Variables).

| Variable | Description | Example |
|---|---|---|
| `VITE_API_URL` | Full URL of the deployed backend | `https://your-backend.onrender.com` |
| `VITE_APP_URL` | Public URL of the frontend (for OAuth redirects) | `https://your-app.vercel.app` |

> **Important:** `VITE_API_URL` must be set for production builds. If omitted, the app falls back to `localhost:8000` in development only — requests will fail silently in production.

---

## Frontend Deployment (Vercel)

### Connect repo
```bash
vercel --prod
# or connect via https://vercel.com/new
```

### Required environment variables
Add in Vercel dashboard → Settings → Environment Variables:

| Name | Value | Environments |
|---|---|---|
| `VITE_API_URL` | `https://your-backend-url.onrender.com` | Production, Preview, Development |

### Custom domain (optional)
Vercel → Domains → Add. Update `VITE_APP_URL` env var after adding.

### Framework preset
Vercel auto-detects Vite. If not: **Other → Vite → Build Command: `npm run build` → Output Directory: `dist`.**

---

## Backend Requirements

### Endpoints the frontend calls
| Path | Method | Auth |
|---|---|---|
| `/auth/login` | POST | No |
| `/auth/register` | POST | No |
| `/auth/switch-workspace` | POST | Yes |
| `/upload` | POST | Yes |
| `/api/datasets/list` | GET | Yes |
| `/clean/*` | GET/POST | Yes |
| `/analysis/*` | GET/POST | Yes |
| `/visualization/*` | GET/POST | Yes |
| `/ml/*` | GET/POST | Yes |
| `/reports/*` | GET | Yes |
| `/ai/*` | POST | Yes |
| `/api/admin/*` | GET | Yes (Admin) |
| `/api/governance/*` | GET | Yes (Admin) |

### CORS
The backend must whitelist the frontend origin:
```python
# FastAPI main.py
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://your-frontend.vercel.app"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

> Without `allow_credentials=True`, the frontend's `withCredentials: true` requests will be rejected.

### Authentication
The frontend sends `Authorization: Bearer <token>` on every authenticated request. The backend should:
1. Verify the JWT signature
2. Check `exp` claim — reject if expired
3. Return `401` for invalid/expired tokens (frontend interceptor will clear session)

### File upload limits
- Max file size: **50 MB**
- Allowed types: `.csv`, `.xlsx`, `.xls`
- Enforce server-side with FastAPI's `UploadFile` size limit:
  ```python
  app.router.lifespan_context = ...
  # OR per-route:
  async def upload(file: UploadFile = File(...)):
      if file.size and file.size > 50 * 1024 * 1024:
          raise HTTPException(413, "File too large")
  ```

---

## Security Checklist

### Completed in this repo
- [x] Security headers in `vercel.json` (CSP, X-Frame-Options, HSTS, etc.)
- [x] `build.sourcemap: false` — no source map leakage
- [x] `withCredentials: true` on axios
- [x] JWT cleared on logout

### Pending backend work (not in this repo)
- [ ] **httpOnly cookies** — move JWT from `localStorage` to `httpOnly; Secure; SameSite=Strict` cookies set by `/auth/login` and `/auth/register`
- [ ] **Refresh token** — implement `/auth/refresh` endpoint; frontend interceptor exchanges httpOnly refresh cookie for new access token
- [ ] **Magic-byte validation** — validate uploaded files server-side (not just by extension)
- [ ] **Rate limiting** — 429 on `/auth/login` with `Retry-After` header

---

## Rollback Procedure

### Vercel
```bash
# Roll back to previous deployment
vercel rollback

# Or via dashboard: Deployments → choose deployment → ⋮ → Promote to Production
```

### Clear user sessions (emergency)
1. Vercel → Environment Variables → rotate `VITE_API_URL`
2. Or deploy a version that clears `localStorage` on load (add to `main.tsx`)

---

## Monitoring

### Sentry
Errors are reported to Sentry automatically. Configure in `src/main.tsx`:
```ts
Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_DSN,
  // sendDefaultPii: false (already set — no email/IP in events)
})
```

Add `VITE_SENTRY_DSN` to Vercel env vars.

### Uptime
`StatusPage.tsx` polls `/readiness` — deploy a status page at `your-backend-url/readiness`.

---

## Useful Scripts

```bash
# Local development (requires backend running)
npm run dev

# Typecheck + build
npm run build

# Run all tests
npm run test

# E2E tests (requires dev server running)
npm run test:e2e

# Lint
npm run lint

# Full validation (lint + test + build)
npm run validate
```
