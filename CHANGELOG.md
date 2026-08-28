# Changelog

All notable changes to the AI Data Analyst Agent will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Planned
- Multi-stage backend Dockerfile
- CSP nonce-based headers for production
- AI token usage tracking with cost estimation
- Database connector (PostgreSQL, MySQL, Snowflake) UI
- Real-time collaboration with WebSocket presence

## [2.0.0] - 2026-08-28

### Added
- OWASP-compliant security middleware (CSP, HSTS, X-Frame-Options, X-Content-Type-Options, Referrer-Policy)
- Per-IP rate limiting (120 req/60s global, 10 req/60s on uploads)
- JWT secret resolution from environment variable (ephemeral fallback in dev, required in production)
- Security audit job in CI (pip-audit, npm audit, .env tracking check, hardcoded-secret regex)
- New endpoints: `/api/datasets/list`, `/api/governance/stats`, `/api/readiness/check`, `/api/admin/audit-logs`
- First-time onboarding tour on Dashboard
- Loading states with spinners on critical actions
- Empty-state banners on all pages
- Active dataset badge in sidebar
- Comprehensive project documentation: README, ARCHITECTURE.md, API.md, PROJECT_GUIDE.md, ERROR_CODES.md

### Changed
- CORS now uses explicit whitelist (no `*`)
- All error responses follow `{ success, message, detail, code }` shape
- Frontend `datasetStore` persists to `localStorage` (was `sessionStorage`)
- Login page no longer shows hardcoded demo credentials
- `home` route reads version from `APP_VERSION` env var

### Removed
- `report_service_old.py` (dead code)
- Hardcoded Gemini API key from `.env`

### Fixed
- Admin stats endpoint no longer 500s on Header object access
- E2E tests use `import.meta.url` for ESM-compatible `__dirname`
- `ProductionReadinessPage` auto-runs checks on mount via `useEffect`
- `DecisionCenterPage` imports `Upload` icon correctly

## [1.0.0] - 2026-01-15

### Added
- Initial public release
- 23 frontend routes
- 15 backend route modules
- 19+ chart visualization types
- 6 ML model types (Random Forest, Linear/Logistic Regression, Decision Tree, Gradient Boosting, KNN, SVM)
- AI assistant powered by Google Gemini
- PDF and PPTX report generation
- 5 Playwright E2E test projects (Chromium, Firefox, WebKit, Edge, Mobile Chrome)
- Docker Compose multi-container setup
- CI pipeline (lint, test, build, security audit)
- Rate limiting at the auth layer
- PBKDF2-SHA256 password hashing (100k iterations)
- HS256 JWT authentication
