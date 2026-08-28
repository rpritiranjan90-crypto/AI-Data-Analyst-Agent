# AI Data Analyst Agent — System Architecture

This document describes the complete system architecture, request lifecycle, and design decisions for the AI Data Analyst Agent platform.

## 1. High-Level Architecture

```
┌────────────────────────────────────────────────────────────────┐
│                       Browser (Client)                          │
│  React 19 + Vite 8 + Tailwind v4 + Zustand 5 + TanStack Query  │
└────────────────────────┬───────────────────────────────────────┘
                         │ HTTPS / JSON
                         ▼
┌────────────────────────────────────────────────────────────────┐
│                  FastAPI Application (Backend)                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ Middleware Stack (top → bottom)                            │  │
│  │  • IPRateLimitMiddleware   (120/60s global, 10/60s upload) │  │
│  │  • SecurityHeadersMiddleware (CSP, HSTS, X-Frame-Options) │  │
│  │  • CORSMiddleware           (whitelisted origins)         │  │
│  │  • Exception Handlers       (uniform JSON error shape)    │  │
│  └──────────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ Route Layer (20 routers)                                   │  │
│  │  Auth • Upload • Cleaning • Analysis • Visualization       │  │
│  │  AI • ML • Report • Webhooks • Governance • Admin         │  │
│  └──────────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ Service Layer                                              │  │
│  │  • AuthService      — JWT, password hashing, lockout       │  │
│  │  • DatasetService   — load, validate, store, list          │  │
│  │  • CleaningService  — fill, drop, transform, outliers      │  │
│  │  • AnalysisService  — DuckDB SQL, describe, summary        │  │
│  │  • VisualizationService — 19+ chart renderers              │  │
│  │  • MLService        — train, predict, feature importance   │  │
│  │  • AIInsightService — Gemini-powered summaries             │  │
│  │  • ReportService    — PDF/PPTX compilation                 │  │
│  │  • GovernanceService — usage tracking, cost estimation      │  │
│  └──────────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ Data Layer                                                 │  │
│  │  • DuckDB (in-memory OLAP)   • Pandas (DataFrame)          │  │
│  │  • File storage (uploads/, reports/, charts/)              │  │
│  └──────────────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────────┘
```

## 2. Request Lifecycle

### 2.1 Dataset Upload Flow

```
User → Frontend UploadPage
       │
       │ 1. POST /upload  (multipart/form-data)
       ▼
FastAPI route handler
       │
       │ 2. IPRateLimitMiddleware checks bucket (10/60s)
       │ 3. validate_upload()  — file size, extension, magic bytes
       │ 4. Save to UPLOAD_DIR/<sanitized_filename>
       │ 5. DatasetService.load_dataset()  — pandas.read_csv + DuckDB
       ▼
Return UploadResponse { metadata, profile, statistics }
       │
       ▼
Frontend stores in Zustand (persisted to localStorage)
       │
       ▼
Dashboard re-renders with new KPIs
```

### 2.2 AI Analysis Flow

```
User → "Analyze sales by region" (natural language)
       │
       │ 1. POST /ai-insights  { prompt, dataset_id }
       ▼
AIInsightService
       │
       │ 2. Construct Gemini prompt  (system: "You are a data analyst…")
       │ 3. Call Gemini API  (google-genai SDK)
       │ 4. Parse response  → { sql, summary, chart_recommendation }
       │ 5. Execute SQL on DuckDB  → result table
       ▼
Return { sql, summary, table, chart }
       │
       ▼
Frontend renders inline response with SQL syntax highlight
```

## 3. Authentication Flow

```
User submits login form
       │
       ▼
POST /auth/login  { email, password }
       │
       │ 1. Check rate limit  (3 attempts → progressive delay)
       │ 2. Lookup USERS_DB[email]
       │ 3. verify_password(password, stored_hash)
       │    — PBKDF2-SHA256 with 100k iterations
       │    — constant-time comparison
       │ 4. create_access_token({ sub: user_id, role })
       ▼
Return { access_token, user }
       │
       ▼
Frontend stores token in authStore
All subsequent requests include  Authorization: Bearer <token>
```

## 4. AI Provider Factory

The AI layer uses a factory pattern to swap providers without changing callers:

```python
provider_factory.create(provider="gemini", model="gemini-2.0-flash")
                  ↓
            GeminiProvider  (default)
                  ↓
   google_genai.Client.models.generate_content()
                  ↓
            ParsedResponse (Pydantic model)
```

Supported providers: **Gemini** (default), **OpenAI**, **Ollama** (local).

## 5. Security Middleware Stack

Middleware is registered in this order — earlier middleware short-circuits later work:

1. **IPRateLimitMiddleware** — checks per-IP sliding window; returns 429 if exceeded
2. **SecurityHeadersMiddleware** — injects CSP, HSTS, X-Frame-Options on every response
3. **CORSMiddleware** — checks `Origin` header against whitelist

## 6. Frontend Architecture

```
src/
├── api/         Axios client + service modules
├── components/  Reusable UI (Button, Card, Modal, Sidebar)
├── pages/       23 route components
├── services/    API call wrappers (one per feature domain)
├── store/       Zustand stores (dataset, auth)
└── types/       Shared TypeScript types
```

State is held in two Zustand stores:
- **useDatasetStore** — currently-loaded dataset metadata (persisted to localStorage)
- **useAuthStore** — current user, JWT, guest-mode flag

TanStack Query handles all server state (uploads, analysis results, recommendations) and provides automatic caching, refetching, and error retries.

## 7. Database Strategy

The platform uses **DuckDB in-memory** as the primary analytical engine:

- **Pros**: Zero setup, columnar storage, sub-second queries on 1M+ rows, SQL-compatible
- **Cons**: Not persistent across restarts (acceptable for demo + single-user)
- **Migration path**: PostgreSQL or Snowflake for production multi-user

User-uploaded files are stored on local disk in `backend/uploads/`. Reports land in `backend/reports/`. Charts in `backend/generated_charts/`.

## 8. Deployment Architecture

```
                     ┌─────────────────┐
                     │   Vercel CDN    │
                     │  (Frontend SPA) │
                     └────────┬────────┘
                              │ HTTPS
                              ▼
                     ┌─────────────────┐
                     │  Render Web     │
                     │  (FastAPI)      │
                     └────────┬────────┘
                              │
              ┌───────────────┼───────────────┐
              ▼               ▼               ▼
        ┌──────────┐    ┌──────────┐    ┌──────────┐
        │ uploads/ │    │ reports/ │    │  charts/ │
        └──────────┘    └──────────┘    └──────────┘
```

Dockerfile (frontend) is multi-stage: `node:20-alpine` builder → `nginx:alpine` server. Final image is ~25MB.
Dockerfile (backend) is single-stage `python:3.11-slim`. Migration to multi-stage in progress.

## 9. Future Scalability

| Concern | Current | Scale Path |
|---|---|---|
| Single-user | OK | Multi-tenant via row-level security in Postgres |
| Rate limiting | In-memory deque | Redis with sliding-window Lua script |
| File storage | Local disk | S3 + signed URLs |
| AI cost | Untracked | Token usage + cost guardrail per user |
| Real-time | WebSocket (1 endpoint) | WebSocket with rooms + presence |
| Background jobs | Inline | Celery + Redis broker |
