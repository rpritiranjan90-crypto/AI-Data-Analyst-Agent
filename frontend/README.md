# AI Data Analyst Agent — Frontend

React 19 + Vite 8 + Tailwind CSS v4 single-page application that powers the AI Data Analyst Agent enterprise platform.

[![CI](https://github.com/<OWNER>/<REPO>/actions/workflows/ci.yml/badge.svg)](https://github.com/<OWNER>/<REPO>/actions/workflows/ci.yml)
[![codecov](https://codecov.io/gh/<OWNER>/<REPO>/branch/main/graph/badge.svg)](https://codecov.io/gh/<OWNER>/<REPO>)

> **Note:** Replace `<OWNER>/<REPO>` in the badge URLs above with your actual GitHub path (e.g. `pritiranjan-rout/AI-Data-Analyst-Agent`).

## Tech Stack

- **Framework:** React 19.2 with React Router 7
- **Build Tool:** Vite 8.1 (ESM, HMR, code-splitting via React.lazy)
- **Styling:** Tailwind CSS v4.3 (Vite plugin)
- **State Management:** Zustand 5 (with localStorage persistence)
- **Data Fetching:** TanStack Query 5 + Axios 1.18
- **Forms:** React Hook Form 7 + Zod 4
- **Charts:** Recharts 3
- **Icons:** Lucide React
- **Animations:** Framer Motion 12
- **PDF/Excel:** jsPDF 4, html2canvas, xlsx
- **CSV Parsing:** PapaParse 5
- **E2E Testing:** Playwright 1.50 (5 browser projects)

## Available Scripts

```bash
# Install dependencies
npm install

# Start dev server on default port (http://localhost:5173)
npm run dev

# Start dev server on a specific port
npm run dev -- --port 5176

# TypeScript type-check (no emit)
npx tsc --noEmit

# Production build
npm run build

# Preview production build
npm run preview

# Lint
npm run lint

# Run Playwright E2E tests
npm run test:e2e

# Run E2E tests against a specific base URL
PLAYWRIGHT_TEST_BASE_URL=http://localhost:5176 npx playwright test
```

## Environment Variables

Create a `.env` file in the frontend root:

```bash
# Backend API base URL. Default: http://127.0.0.1:8000
VITE_API_URL=http://127.0.0.1:8000
```

The Vite dev server reads this at startup. Restart `npm run dev` after changing.

## Project Structure

```
frontend/
├── e2e/                          # Playwright E2E test suite
│   ├── pages/                    # Page Object Model classes
│   ├── specs/                    # Test spec files
│   └── utils/                    # Shared test utilities
├── public/                       # Static assets served as-is
├── src/
│   ├── api/                      # Axios client + service layer
│   ├── components/               # Reusable UI components
│   │   ├── layout/               # Sidebar, TopBar, etc.
│   │   └── ui/                   # Button, Card, Modal, EmptyState
│   ├── pages/                    # Route components (23 pages)
│   ├── store/                    # Zustand stores
│   ├── types/                    # Shared TypeScript types
│   ├── App.tsx                   # Root component with routes
│   ├── main.tsx                  # React entry point
│   └── index.css                 # Global Tailwind imports
├── .env                          # Local environment variables
├── playwright.config.ts          # E2E test config
├── vite.config.ts                # Vite build config
├── tailwind.config.js            # Tailwind theme config
└── package.json                  # Dependencies and scripts
```

## Routes (23)

| Path | Page | Notes |
|---|---|---|
| `/` | Landing | Public marketing page |
| `/login` | Login | JWT auth |
| `/signup` | Signup | User registration |
| `/dashboard` | Dashboard | KPI cards, AI insights |
| `/upload` | Upload | CSV / DB / joiner tabs |
| `/cleaning` | Cleaning | Data cleaning operations |
| `/visualization` | Visualization | Chart generation |
| `/analysis` | Analysis | Dataset summary |
| `/recommendation` | Recommendation | AI chart recommendations |
| `/machine-learning` | ML | Train & predict |
| `/simulator` | Simulator | What-if scenarios |
| `/knowledge` | Knowledge | RAG document indexing |
| `/governance` | Governance | AI usage metrics |
| `/readiness` | Readiness | Production health checks |
| `/reports` | Reports | PDF/PPTX generation |
| `/admin` | Admin | Workspace admin |
| `/decision-center` | Decision | AI-suggested actions |
| `/data-fabric` | DataFabric | Dataset catalog |
| `/pricing` | Pricing | Plan tiers |
| `/help` | Help | FAQ & docs |
| `/privacy-policy` | Privacy | Legal |
| `/terms-of-service` | Terms | Legal |
| `*` | 404 | Not found |

## E2E Testing

The Playwright suite runs 5 browser projects (Chromium, Firefox, WebKit, Edge, Mobile Chrome) and covers 20+ test cases across auth, dashboard, cleaning, ML, knowledge, governance, and navigation.

```bash
# First time: install browsers
npx playwright install --with-deps chromium

# Run all tests
npx playwright test

# Run only Chromium
npx playwright test --project=chromium

# Show HTML report
npx playwright show-report
```

## Building for Production

```bash
npm run build
```

Outputs to `dist/`. The frontend Dockerfile uses a multi-stage build (Node builder → nginx server) and serves on port 80.

## License

MIT
