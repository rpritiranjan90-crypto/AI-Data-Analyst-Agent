# What Makes This Project Different

> A guide to the features that distinguish this project from the typical
> "data analytics tool" college submission. Use this section in your report
> or viva to highlight why this is more than a CSV-to-chart converter.

Most "data analytics" projects stop at "upload CSV → make bar chart". This
platform goes further. Below is the 7-feature list that is uncommon among
student projects and which forms the **unique selling proposition** of the
AI Data Analyst Agent.

---

## 1. AI Copilot Drawer (Floating on Every Page)

Every page in the app has a **Cmd+K / Ctrl+K command palette** that opens
a floating AI assistant drawer. The user can ask the copilot questions
about the active dataset ("what's the average revenue per region?") and
get streaming responses — without leaving the current page. The drawer
keeps a per-session conversation history.

> **Why it's unique:** most analytics tools have a single chatbot page. We
> integrated the assistant into the global layout so the user never has
> to context-switch.

---

## 2. Natural Language → SQL

In the **Database Connector** view, the user types a plain English prompt
("Show top 10 customers by total sales amount last quarter") and the
backend's NL-to-SQL service generates a valid `SELECT` statement. The
user can review, edit, and execute it. The same engine powers the
database-backed datasets that feed the rest of the app.

> **Why it's unique:** only AutoML-grade commercial tools (DataRobot,
> Hex) ship this. The student-level version usually has a hand-coded
> schema dropdown.

---

## 3. Live SQL Database Connector with Table Allowlist Hardening

The user can point the app at a **live PostgreSQL, MySQL, or SQLite**
instance, browse its tables, and import any table as a first-class
dataset. The backend validates the query against a **table-name
allowlist** derived from the discovered tables, blocking SQL injection
even if a malicious client tries to interpolate identifiers into the
`FROM` clause.

> **Why it's unique:** SQL safety is a "real company" concern. Most
> student projects connect to a database and trust the user. We don't.

---

## 4. Autonomous AI Workflow Execution Agent

Click the **Cmd+K → "Run AI Workflow"** button and the app plans a
multi-step analysis pipeline (profile → clean → chart → ML → report)
**on its own**, executes each step, and shows a live progress modal.
The user can pause, cancel, or override any step.

> **Why it's unique:** LangChain-style agent loops are a research topic.
> Shipping one as a real production feature with a polished UI is rare.

---

## 5. Glassmorphism + Dark Mode + WCAG-AA Accessibility

The UI uses:
- **Glassmorphism** cards (backdrop-blur, layered transparency)
- **Full dark mode** (no `prefers-color-scheme: dark` trick — every
  chart, table, and chart label is hand-tuned for both themes)
- **ARIA labels** on every chart container (`role="img"` + descriptive
  `aria-label` so screen readers can announce "Bar chart of revenue by
  region, 12 bars")
- **Keyboard navigation** across the entire app, including the
  command palette, file upload, and join key column inputs

> **Why it's unique:** most student UIs are either light-mode only or
> use a "dark grey on dark grey" theme that violates WCAG contrast
> minimums. Ours passes.

---

## 6. Production-Grade DevOps

A complete **CI/CD pipeline on GitHub Actions** runs 5 jobs on every
push to `main`:

| Job | What it does |
|---|---|
| `backend-test` | 52 pytest cases, coverage gate, pip-audit |
| `frontend-build` | TypeScript check, 124 vitest cases, vite build |
| `e2e-tests` | Playwright suite (Dashboard, Cleaning, ML, Knowledge, etc.) |
| `docker-build` | Multi-stage Docker image builds successfully |
| `security-audit` | Hardcoded secret detection, npm audit, pip-audit |

Plus **multi-stage Dockerfiles** for both backend and frontend
(builder + runtime), and `docker-compose.yml` for local development.

> **Why it's unique:** most college projects don't have CI. Having
> green CI badges on the README is an immediate credibility signal.

---

## 7. Honest Security Posture

- **JWT auth with PBKDF2-SHA256** password hashing (100k iterations)
- **Rate limiting** with progressive delay on `/auth/login`
- **CORS** allowlisted to specific Vercel + localhost origins (no `*`)
- **Security headers** (`X-Content-Type-Options`, `X-Frame-Options`,
  `Strict-Transport-Security`, `Referrer-Policy`)
- **Audit log middleware** that records every mutating request
- **Generic error messages** to prevent account enumeration
- **`/admin/audit-logs`** endpoint with pagination for admin review
- **AIConfigBanner** that warns when `GEMINI_API_KEY` is missing —
  no silent failures

> **Why it's unique:** security is invisible until it breaks. Most
> student projects don't even validate input. Our `OWASP Top 10` coverage
> is documented in `docs/ARCHITECTURE.md`.

---

## Quick Elevator Pitch

> "Most data analytics tools give you a chart library. We give you an
> AI copilot that lives inside every page, a natural-language SQL engine
> that can talk to your live database safely, an autonomous workflow
> agent that plans its own analysis pipeline, and a CI/CD pipeline that
> proves all 176 tests pass on every commit."

Use this in your viva or abstract.
