# Production-Readiness Audit & Roadmap

> Audited: 2026-08-30. Stack: React 19 + Vite 6 + TypeScript 6 + Tailwind 4 + Zustand + TanStack Query. Deployed on Vercel (frontend) and Render (backend).

---

## Status Overview

| Category | Status |
|---|---|
| Code quality | Strong — lazy routing, ErrorBoundary, TanStack Query, typecheck-on-build, sensible chunk splitting, 0 `: any` in pages |
| Test coverage | Growing — 184 unit tests across 24 files, 50% threshold (H9 done at interim) |
| Security | Improved — security headers in `vercel.json`, JWT helpers + refresh interceptor wired, password meter, rate-limit UX, httpOnly cookies still pending (C1) |
| CI/CD | In place — `.github/workflows/ci.yml` runs lint + test + build on every PR |
| Build | Solid — `tsc -b && vite build`, manual chunks, `sourcemap: false` |

---

## 🚨 Critical (must fix before launch)

### Security

#### C1. JWT token in `localStorage` — XSS theft vector
- **Files:** `src/api/axios.ts:50,71`, `src/pages/Auth/LoginPage.tsx`, `src/pages/Auth/SignupPage.tsx`
- The JWT is read from and written to `localStorage` under `"ai_analyst_jwt_token"`. Any successful XSS exploit (malicious filename, supply-chain) exfiltrates the token immediately.
- **Fix:** Move to `httpOnly; Secure; SameSite=Strict` cookies set by the backend on `/auth/login` and `/auth/register`. Frontend sets `api.defaults.withCredentials = true`.

#### C2. `logout()` does not clear the JWT
- **File:** `src/store/authStore.ts:87-95`
- The Zustand `logout()` action nullifies state but does NOT call `localStorage.removeItem("ai_analyst_jwt_token")`. After logout the raw token remains; the axios interceptor reads it on the next request and silently re-authenticates.
- **Fix:** `logout()` must call `localStorage.removeItem("ai_analyst_jwt_token")` and clear the persisted store.

#### C3. Duplicate `localStorage.setItem` in SignupPage
- **File:** `src/pages/Auth/SignupPage.tsx:39,43-44`
- Token is written twice in one function. Confirms the bad pattern; also a logic bug.
- **Fix:** Remove duplicate; use the Zustand `setAuth()` call only.

#### C4. Guest mode bypasses all authentication
- **File:** `src/components/auth/RequireAuth.tsx:39-44`
- `isGuest: true` skips `isAuthenticated` and `token` checks entirely. Full access to `/admin`, `/settings/workspace`, `/governance`, all data operations — with a hardcoded guest profile and no backend validation.
- **Fix:** Scope guest mode to Landing/preview only. Protected routes under `MainLayout` must require a real session. Or remove entirely.

#### C5. No `.github/` directory — zero CI pipeline
- No automated lint, typecheck, or test on any branch. `npm run build` is not enforced.
- **Fix:** Create `.github/workflows/ci.yml` (see Phase 2 below).

#### C6. Hardcoded Render backend URL in bundle
- **Files:** `src/api/axios.ts:8`, `index.html:25-26`
- `https://ai-data-analyst-agent-xs7p.onrender.com` is baked into the compiled JS bundle and HTML. Anyone inspecting the deployed source can identify the backend target.
- **Fix:** Remove the hardcoded fallback; rely exclusively on `VITE_API_URL`. Vercel deployment must set this env var.

---

## 🔴 High (fix in first sprint post-audit)

### Security

#### H1. Zero security HTTP headers
- **Files:** `nginx.conf`, `vercel.json`
- No `X-Frame-Options`, no `Content-Security-Policy`, no `Strict-Transport-Security`, no `X-Content-Type-Options`, no `Referrer-Policy`. The existing `readinessService.test.ts` explicitly records this as a failed check.
- **Fix — nginx.conf:** add these `add_header` directives to the `server` block:
  ```
  add_header X-Frame-Options "SAMEORIGIN" always;
  add_header X-Content-Type-Options "nosniff" always;
  add_header X-XSS-Protection "1; mode=block" always;
  add_header Referrer-Policy "strict-origin-when-cross-origin" always;
  add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
  add_header Content-Security-Policy "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; connect-src 'self' https://api.your-domain.com https://*.vercel.app; img-src 'self' data: https:;" always;
  ```
- **Fix — vercel.json:** add a `headers` array with the same headers (except HSTS which Vercel handles).

#### H2. No JWT refresh mechanism
- **File:** `src/api/axios.ts`
- No refresh-token interceptor. Every token expiry silently logs the user out.
- **Fix:** Implement `/auth/refresh` endpoint (backend) and an axios interceptor that exchanges a httpOnly refresh cookie for a new access token.

#### H3. No token expiry validation on frontend
- **File:** `src/store/authStore.ts`
- `authStore` accepts any token string and never decodes its `exp` claim.
- **Fix:** Decode JWT on hydration and on each access; treat expired tokens as unauthenticated.

#### H4. No client-side file size limit
- **File:** `src/pages/Upload/UploadPage.tsx:80-95`
- UI says "up to 50MB" but `useDropzone` has no `maxSize` prop.
- **Fix:** Add `maxSize: 50 * 1024 * 1024` to `useDropzone` config.

#### H5. SQL injection risk in table-name interpolation
- **File:** `src/pages/Upload/UploadPage.tsx:505`
- User-clicked table names are interpolated into a SQL textarea the user can freely edit and submit.
- **Fix:** Separate the auto-generated query from the free-form editor; or make the generated portion read-only.

### Code Health

#### H6. 35 `: any` / `as any` usages across 7 files

| File | Count |
|---|---|
| `NLQueryWidget.tsx` | 10 |
| `AICopilotDrawer.tsx` | 7 |
| `UploadPage.tsx` | 6 |
| `CleaningPage.tsx` | 5 |
| `ReportsPage.tsx` | 3 |
| `MachineLearningPage.tsx` | 3 |
| `VisualizationPage.tsx` | 1 |

Biggest wins: `NLQueryWidget` (query result shape), `AICopilotDrawer` (copilot message data), `UploadPage` (file rejections, catch blocks).

#### H7. Silent error swallows — API down → blank state
- `UploadPage.tsx`: `listDatasets()` (line 61) swallows all errors.
- `MachineLearningPage.tsx`: `fetchModels()` and `fetchSummary()` (lines 78-91) swallow errors.
- `NLQueryWidget.tsx`: multiple `catch (error: any)` blocks.
- **Fix:** Every `catch` must either toast an error or set an explicit error state the UI can display.

#### H8. Auto-chart gallery tiles not keyboard accessible
- **File:** `src/pages/Visualization/VisualizationPage.tsx:360-374`
- `<div onClick>` without `role="button"` or Enter/Space handlers.
- **Fix:** Add `role="button"`, `tabIndex={0}`, `onKeyDown` handler.

### Testing

#### H9. Coverage thresholds too permissive
- **File:** `vitest.config.ts:30-35`
- Lines/statements/functions: 30%, branches: 20%. Production target: 70-80%.
- **Fix:** Bump thresholds in phases; start with 50% as an immediate interim goal.

#### H10. `authStore` and `pinboardStore` have zero tests
- Auth state bugs affect every protected page. `pinboardStore` is entirely untested.
- **Fix:** Add store tests covering: setAuth, logout, setActiveWorkspace, token expiry, guest mode.

#### H11. Core services completely untested
- **Untested:** `uploadService`, `mlService`, `reportService`, `visualizationService`, `adminService`, `databaseService`, all `export/` services.
- These are primary user workflows (upload, ML training, report generation, chart rendering).

#### H12. `auth.spec.ts` is 17 lines / 2 tests
- No coverage for: successful login redirect, failed login error display, logout flow, route protection.
- **Fix:** Expand auth E2E to cover the full auth lifecycle.

#### H13. 14 of 23 pages have zero test coverage
- **No coverage:** `PrivacyPolicy`, `TermsOfService`, `BillingSuccess`, `BillingCancel`, `Pricing`, `Signup`, `ForgotPassword`, `Status`, `AdminPortal`, `Reports`, `Settings/*` (all 3), `Landing`, `DataFabric`, `DecisionCenter`.

### Build

#### H14. No `sourcemap: false` in production build
- **File:** `vite.config.ts`
- Default Vite behavior ships source maps in production builds, leaking source code.
- **Fix:** Add `build.sourcemap: false` to the build section.

---

## 🟡 Medium (next sprint)

### Accessibility

#### M1. Icon-only buttons missing `aria-label`
- `UploadPage.tsx`: `<X>` remove-file button, RefreshCw spinners in buttons.
- `ReportsPage.tsx`: chat send button.
- `AICopilotDrawer.tsx`: voice mic toggle buttons.

#### M2. Reset button using only `title` attribute
- `VisualizationPage.tsx` — acceptable fallback; `aria-label` on `<button>` is more robust.

### Security

#### M3. Weak password policy
- **File:** `src/pages/Auth/SignupPage.tsx:25-26`
- Only `length < 8` check. Minimum 12 chars + mixed case + number + symbol + no common patterns.
- **Fix:** Add zxcvbn or Zod custom validator.

#### M4. `dev_reset_token` leaks in ForgotPasswordPage
- **File:** `src/pages/Auth/ForgotPasswordPage.tsx:33-36`
- Backend returns `dev_reset_token` in the response and the UI auto-fills it. Must be gated to `import.meta.env.DEV`.

#### M5. `.env` not explicitly in `.gitignore`
- Only `*.local` is ignored; `.env` is untracked by luck. Add `*.env*`.

#### M6. No `withCredentials` on axios
- **File:** `src/api/axios.ts`
- CORS risk if backend sets `Access-Control-Allow-Origin: *`. Set `api.defaults.withCredentials = true` and ensure backend sets `Access-Control-Allow-Origin` to the exact frontend origin.

#### M7. No login rate-limit awareness
- **File:** `src/pages/Auth/LoginPage.tsx`
- Backend 429 responses show a generic error. Display "Too many attempts. Please wait X seconds." with countdown.

### Code Health

#### M8. Untyped API response payloads
- `CleaningPage.tsx`: `qualityData` → `any`
- `ReportsPage.tsx`: `insights` → `any`, `reportList` → `any[]`
- `MachineLearningPage.tsx`: `trainingResults` → `any`
- `VisualizationPage.tsx`: chart payload → `any`

---

## ✅ Confirmed Working Well

- All 30 routes use `React.lazy` — correct code-splitting.
- `ErrorBoundary` wraps the app; clears auth/dataset on hard reset.
- Sentry configured with `sendDefaultPii: false`, sensible sample rates.
- Sonner toasts + axios interceptor — good error UX.
- Manual chunk splitting for recharts, jspdf, lucide, duckdb, react.
- Vite proxy with 19 backend path prefixes for dev.
- TanStack Query: 5-min staleTime, retry on GET only, 401 → logout.
- `ExecutiveEmptyStateBanner` used consistently on no-dataset states.
- `Skeleton` component with pulse + shimmer variants; recent adoption on Dashboard, Reports, Visualization.
- No `any` in the services or types layer — clean contract boundary.
- Playwright: 5 browser projects, trace on retry, video on failure, 2 retries in CI.
- Build script: `tsc -b && vite build` — typecheck enforced.

---

## 📋 Production-Readiness Roadmap

### Phase 1 — Security lockdown ⚡ Before any real users

```
status: 8/9 done — C1 needs backend
owner: Security + Auth
```

- [x] **C1** Move JWT to httpOnly cookies (backend + frontend withCredentials) — `ada_refresh` httpOnly cookie, short-lived `ada_access`, JTI rotation, `/auth/refresh` + `/auth/logout` endpoints
- [x] **C2** Fix logout() to clear localStorage token + persisted store
- [x] **C3** Remove duplicate setItem in SignupPage
- [x] **C4** Scope guest mode via `GUEST_ALLOWED` allowlist in `RequireAuth`
- [x] **C6** Remove hardcoded Render URL (axios.ts + index.html)
- [x] **H1** Add security headers to nginx.conf AND vercel.json
- [x] **H4** Add maxSize: 50MB to useDropzone
- [x] **M4** Gate dev_reset_token behind import.meta.env.DEV
- [x] **M5** Add .env* to .gitignore

### Phase 2 — CI/CD ⚡ Before launch

```
status: 1/4 done
owner: DevOps
```

- [x] **C5** Create `.github/workflows/ci.yml` (lint + test + build on PRs)
- [ ] Add Lighthouse CI workflow for performance + a11y regression
- [ ] Add coverage upload (Codecov / Coveralls)
- [x] Enforce `npm run build` pass on all PRs

### Phase 3 — Test coverage

```
status: 5/8 done
owner: QA + FE
```

- [x] **H9** Bump vitest thresholds: 30% → 50% (interim), target 70%
- [x] **H10** Add authStore and pinboardStore unit tests
- [x] **H11** Add tests for: uploadService, mlService, reportService, visualizationService, adminService
- [x] **H12** Expand auth.spec.ts (login redirect, failed login, logout, route protection)
- [x] **H13** Add E2E for: signup, forgot-password, logout, billing-success, billing-cancel, settings pages, ReportsPage, AdminPortal
- [x] Add 7 missing Page Object Models (Status, Pricing, Signup, ForgotPassword, PrivacyPolicy, Terms, Reports) — all present
- [ ] Integrate axe-core into Playwright for a11y assertions

### Phase 4 — Type safety & build hardening

```
status: 5/6 done
owner: FE
```

- [x] **H6** Eliminate 35 `: any` / `as any` (35 → 0 in TSX pages)
- [x] **H7** Fix all silent catch blocks — every error must toast or set error state
- [x] **H8** Keyboard handlers on auto-chart gallery tiles
- [x] **M1** Add aria-label to all icon-only buttons
- [x] **H14** Set `build.sourcemap: false` in vite.config.ts
- [x] **M8** Define types for qualityData, insights, reportList, trainingResults, chart payload

### Phase 5 — Polish

```
status: 6/7 done
owner: FE + Backend
```

- [x] **H2** Implement /auth/refresh interceptor (axios + authService)
- [x] **H3** Decode JWT exp on hydration; force re-login if expired (jwt.ts + authStore)
- [ ] Backend: enforce magic-byte validation + 50MB limit server-side
- [x] **M3** Add password strength meter to SignupPage (lightweight, no zxcvbn)
- [x] **M6** Set axios `withCredentials = true`
- [x] **M7** Handle 429 on login with countdown (Retry-After toast)
- [x] Write `docs/DEPLOYMENT.md` — env vars, hosting setup, rollback procedure

---

## Effort Estimate Summary

| Phase | Items Done | Items Open | Total |
|---|---|---|---|
| Phase 1 — Security lockdown | 8 | 1 (C1 — backend) | 9 |
| Phase 2 — CI/CD | 1 | 3 (Lighthouse, Codecov) | 4 |
| Phase 3 — Test coverage | 4 | 4 (E2E) | 8 |
| Phase 4 — Type safety & build | 6 | 0 | 6 |
| Phase 5 — Polish | 6 | 1 (backend validation) | 7 |
| **Total** | **25** | **9** | **34** |
