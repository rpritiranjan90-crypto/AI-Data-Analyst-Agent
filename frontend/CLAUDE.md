# CLAUDE.md

AI Data Analyst Agent — frontend workspace. This file is loaded on every turn. Keep it lean.

## Stack
- React 19 + TypeScript 5 + Vite 6
- Tailwind CSS v4, clsx + tailwind-merge (`cn` in `src/lib/utils.ts`)
- Zustand (global state) + TanStack Query (server state)
- Sonner (toasts), Framer Motion (animation), Lucide (icons)
- Vitest (unit) + Playwright (`e2e/`)
- Lint: `oxlint`

## Scripts
- `npm run dev` — Vite dev server
- `npm run build` — `tsc -b && vite build` (typecheck + bundle)
- `npm run lint` — `oxlint`
- `npm run test` — Vitest single run
- `npm run preview` — Vite preview

## Repo layout (frontend/)
- `src/api/` — axios client (`axios.ts`), endpoint registry (`endpoints.ts`), query client
- `src/lib/` — shared utilities: `jwt.ts`, `passwordStrength.ts`, `utils.ts`
- `src/services/` — typed API call wrappers (one per backend domain, incl. `authService.ts`)
- `src/store/` — Zustand stores: `authStore`, `datasetStore`, `pinboardStore`
- `src/types/` — shared TS interfaces (`dataset.ts`, `api.ts`, `export.ts`)
- `src/pages/` — route components, grouped by feature
- `src/components/ui/` — design-system primitives (Button, Card, Skeleton, Spinner, …)
- `src/features/` — cross-page workflows (analysis, workflow)
- `src/routes/AppRouter.tsx` — single routing entry
- `src/lib/utils.ts` — `cn` helper, shared utilities
- `e2e/` — Playwright suites

## Conventions
- **No `any`.** Define explicit interfaces in `src/types/` for every API response shape.
- **State:** global app state in Zustand (`datasetStore` holds the active dataset metadata). Server cache in TanStack Query. Component-local `useState` only for view state.
- **API calls** live in `src/services/` — never call `axios` directly from components.
- **UI components** stay presentational; business workflows live in `src/features/`.
- **Loading:** use `Skeleton` (mirrors real layout) over `Spinner` where layout space allows. Always handle `loading`, `empty`, `error` states.
- **Errors:** wrap heavy components in `ErrorBoundary` (`src/components/ErrorBoundary.tsx`).
- **Toasts:** use `sonner` — never `alert()`.
- **A11y:** WCAG-AA. Charts get `role="img"` + `aria-label`. Cmd/Ctrl+K is the copilot trigger. Esc dismisses modals. Interactive elements need visible focus rings.

## Where to look
- Dataset metadata model → `src/types/dataset.ts`
- Active dataset state → `src/store/datasetStore.ts`
- API endpoint registry → `src/api/endpoints.ts`
- JWT helpers (decode / expired / msUntilExpiry) → `src/lib/jwt.ts`
- Auth cookie helpers (readAccessCookie / clearAccessCookie) → `src/lib/cookie.ts`
- Auth refresh & 401 / 429 interceptors → `src/api/axios.ts`
- Password strength meter → `src/lib/passwordStrength.ts` (wired into `SignupPage.tsx`)
- Existing skeleton pattern → `src/pages/Admin/AdminPortalPage.tsx`

## Detailed standards
See `docs/ARCHITECTURE.md` for layered architecture, security, ML/visualization, and testing standards. Don't duplicate that content here — `CLAUDE.md` is the short version.