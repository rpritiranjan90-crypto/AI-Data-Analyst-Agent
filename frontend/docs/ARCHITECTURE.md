# Architecture & Engineering Standards

This document covers layered architecture, data flow, security, ML/visualization conventions, and testing standards. See `CLAUDE.md` for the high-level overview.

---

## 1. Frontend Architecture

### Layered structure

```
src/api/       — axios instance, base URL, interceptors, query client
src/lib/       — shared utilities (jwt, passwordStrength, cn, etc.)
src/services/  — typed API call wrappers (one service per backend domain)
src/store/     — Zustand global stores
src/features/  — business workflows (cross-page)
src/pages/     — route components (thin, orchestrate)
src/components/ui/ — design-system primitives
```

**Rule:** API calls go in `src/services/`. Never call `axios` directly from a component.

### State management

| Concern | Tool | Example |
|---|---|---|
| Global app state | Zustand | `useDatasetStore` (active dataset metadata) |
| Server cache | TanStack Query | report lists, chart endpoints |
| Component view state | `useState` | open/closed, form fields |

`datasetStore` (`src/store/datasetStore.ts`) holds the active `DatasetResponse`. Pages read from it, services call `setDataset` on success.

### Error handling

- Never swallow errors silently.
- Wrap heavy components in `ErrorBoundary` (`src/components/ErrorBoundary.tsx`).
- Show meaningful empty states via `ExecutiveEmptyStateBanner` or `EmptyState`.
- Use `sonner` toasts (`toast.success`, `toast.error`) — never `alert()`.
- Loading states: prefer `Skeleton` over `Spinner` where layout space is available.

---

## 2. Backend Architecture (future / split deployment)

> When a Python/FastAPI backend is added, the following applies.

### Layered structure

```
app/routes/      — route handlers (validate, call service, return APIResponse)
app/services/    — business logic, DuckDB transforms, ML, AI calls
app/schemas/     — Pydantic v2 input/output models
app/common/     — response wrapper, matplotlib config, shared utilities
```

**Rule:** Business logic goes in `app/services/`. Route handlers never contain business logic directly.

### Response wrapper

All endpoints return via `APIResponse.success()` or `APIResponse.failure()` from `app/common/responses.py`.

```python
return APIResponse.success(data={"result": value})
return APIResponse.failure(code="DATASET_NOT_FOUND", detail="Dataset X does not exist")
```

### Error codes

Reference `docs/ERROR_CODES.md` for domain-specific error codes. Never raise raw `HTTPException`.

### AI provider calls

- Use `Gemini-3.5-flash` → fallback chain via `app.config.py`.
- Never hardcode API keys or model names in service code.
- Sanitize markdown fences from AI JSON responses before parsing.
- Track token consumption for governance and billing.

### DuckDB

- All user dataset queries go through `duckdb_service.py`.
- Parameterized queries only — no string interpolation.
- Read-only table allowlists on live SQL connectors.

### ML / Visualization

- Scikit-learn pipelines handle imputation, encoding, scaling, train/test split safely.
- Matplotlib figures run headless via `matplotlib.use('Agg')` configured in `app.common.matplotlib_config`.
- Always call `plt.close('all')` after saving to prevent memory leaks.

---

## 3. Security Standards

### Frontend

- Never commit secrets to source (API keys, tokens). Use environment variables (`VITE_` prefix).
- File upload: validate extension AND magic bytes on the backend before parsing.
- Max upload: 100 MB (enforced in backend `config.py`).
- Sanitize filenames server-side to prevent path traversal.

### Auth / Tokens

- JWT tokens: HS256 signed, verified via `get_current_user` dependency on every protected route.
- Passwords: PBKDF2-SHA256, ≥100,000 iterations, per-user salt.
- Rate limiting: 120 req/60s global, 10 req/60s on file uploads.

#### Client-side token lifecycle (C1)

Tokens are stored in browser cookies, not `localStorage`, to eliminate the XSS-token-theft attack surface.

| Cookie | TTL | httpOnly | Purpose |
|---|---|---|---|
| `ada_access` | 15 min | No | Read by JS, copied into `Authorization: Bearer …` header on every request |
| `ada_refresh` | 7 days | **Yes** | Sent only to `/auth/refresh`; invisible to JS even in an XSS attack |

**Refresh token rotation (JTI):** every `/auth/refresh` call issues a new jti and invalidates the old one. If a refresh token is used twice (theft signal), all refresh tokens for that user are revoked and they must re-authenticate.

| Concern | Implementation |
|---|---|
| Read access token | `src/lib/cookie.ts` — `readAccessCookie()` → axios interceptor |
| Clear access cookie | `src/lib/cookie.ts` — `clearAccessCookie()` (logout, 401) |
| Decode / expiry check | `src/lib/jwt.ts` (`decodeJwt`, `isJwtExpired`, `msUntilExpiry`) |
| Drop expired on hydration | `authStore.ts` — `onRehydrateStorage` prefers cookie, falls back to silent refresh |
| Drop expired before request | `axios.ts` request interceptor calls `clearAccessCookie()` |
| Auto-refresh on 401 | `axios.ts` response interceptor with `inFlightRefresh` singleton; `__isRefresh` flag |
| Logout | `authStore.logout()` → `POST /auth/logout` (revokes refresh tokens server-side) + clears client cookie |
| 429 handling | `axios.ts` response interceptor reads `Retry-After` header, surfaces toast |
| Backend refresh | `POST /auth/refresh` — reads httpOnly `ada_refresh`, rotates jti, returns new `ada_access` cookie |
| Backend secrets | `JWT_SECRET` (access tokens), `REFRESH_TOKEN_SECRET` (refresh tokens); both required in production |
| Password strength | `src/lib/passwordStrength.ts` — 6-rule lightweight estimator, score 0–4 |

---

## 4. Testing Standards

### Frontend

```bash
npm run test    # Vitest single run
npm run build  # tsc -b && vite build
npm run lint   # oxlint
```

- Unit tests for utility functions, hooks, Zustand store mutations in `src/__tests__/`.
- E2E workflows in `e2e/` via Playwright.
- Every new component gets a smoke test at minimum.

### Backend (when present)

```bash
pytest --cov=app --cov-fail-under=50
```

- Unit + integration tests in `backend/tests/test_<feature>.py`.
- Use mock datasets from `conftest.py` — avoid live external services.
- Maintain ≥50% coverage.

---

## 5. TypeScript Conventions

- **No `any`.** Every API response gets an explicit interface in `src/types/`.
- Use `interface` for object shapes, `type` for unions/aliases.
- Prop types on components are explicit (no spread-`...rest` without type safety).

## 6. Accessibility

- All `<canvas>`/SVG charts: `role="img"` + meaningful `aria-label`.
- Focus ring on all interactive elements (`:focus-visible`).
- Modals: dismiss on `Esc`, return focus on close.
- Copilot trigger: `Cmd/Ctrl+K`.
- WCAG-AA contrast minimum.
