# Contributing to AI Data Analyst Agent

Thanks for your interest in contributing! This document explains how to set up the project locally, propose changes, and submit pull requests.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Quick Setup](#quick-setup)
- [Development Workflow](#development-workflow)
- [Coding Standards](#coding-standards)
- [Commit & PR Guidelines](#commit--pr-guidelines)
- [Testing](#testing)
- [Documentation](#documentation)
- [Project Structure](#project-structure)

## Code of Conduct

This project follows a [Contributor Covenant](https://www.contributor-covenant.org/) spirit:

- Be respectful. Assume good faith.
- No harassment, discrimination, or personal attacks.
- Focus on what's best for the community.
- Show empathy towards other contributors.

## Quick Setup

### Prerequisites

- **Python 3.11+** (with `pip` and `venv`)
- **Node.js 20+** and `npm` (use `nvm` to install)
- **Docker 24+** and `docker compose` (optional, for containerized dev)
- **Git**

### First-time setup

```bash
# 1. Clone
git clone https://github.com/personal/AI-Data-Analyst-Agent.git
cd AI-Data-Analyst-Agent

# 2. Backend
cd backend
python -m venv .venv
source .venv/bin/activate    # Windows: .venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env        # fill in JWT_SECRET and GEMINI_API_KEY
cd ..

# 3. Frontend
cd frontend
npm install
cp .env.example .env
cd ..

# 4. Run tests
cd backend && pytest -q && cd ..
cd frontend && npx tsc --noEmit && cd ..
```

### Running locally

```bash
# Terminal 1 — backend
cd backend && uvicorn app.main:app --reload

# Terminal 2 — frontend
cd frontend && npm run dev
```

Open http://localhost:5173 (frontend) and http://localhost:8000/docs (Swagger).

## Development Workflow

1. **Create a feature branch** off `main`:
   ```bash
   git checkout -b feat/add-export-csv
   ```
2. **Make focused commits** (one logical change per commit).
3. **Add tests** for any new behavior (pytest for backend, vitest/RTL for frontend).
4. **Update docs** if you change a public API or add a user-facing feature.
5. **Run the full test suite** before opening a PR.
6. **Open a Pull Request** against `main` and fill out the template.

## Coding Standards

### Python (backend)

- **Style**: PEP 8 + type hints everywhere. Use `ruff` for linting.
- **Naming**: `snake_case` for functions/variables, `PascalCase` for classes.
- **Imports**: Absolute imports only (`from app.services.x import y`).
- **Type hints**: Required for all public functions. Use `Optional[T]` not `T | None` for Python 3.10 compat.
- **Docstrings**: Google-style for public classes and functions.
- **Error handling**: Use the custom `AppException` subclasses (`ValidationException`, `NotFoundException`, etc.). Never return 200 with an `error` field.

### TypeScript (frontend)

- **Style**: ESLint + Prettier defaults.
- **Naming**: `PascalCase` for components, `camelCase` for variables/functions, `SCREAMING_SNAKE_CASE` for constants.
- **No `any`**: Use proper types or `unknown` + runtime checks.
- **Component size**: Keep components under 250 lines. Extract sub-components.
- **Service files**: One API domain per file. Always include explicit return types.

### CSS

- Tailwind v4 utility-first. Avoid `@apply` for one-offs.
- Component-specific styles live in `index.css` under a clear comment.
- Dark mode: use the `dark:` variant for all color overrides.

## Commit & PR Guidelines

### Commit messages

We follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <short summary>

<body — wrap at 72 chars, explain *why* not *what*>

<footer — references, breaking changes>
```

Types: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `chore`, `ci`, `build`.

Examples:
- `feat(ml): add isolation forest anomaly detection`
- `fix(upload): truncate filenames longer than 255 chars`
- `docs(readme): add demo screenshots section`

### Pull Request template

- [ ] Linked to a GitHub issue (or explained why not)
- [ ] Tests added/updated and passing locally
- [ ] `npx tsc --noEmit` passes
- [ ] `pytest` passes with coverage ≥ 50%
- [ ] Documentation updated (if applicable)
- [ ] No new secrets / hardcoded credentials

## Testing

| Layer | Tool | Location |
|-------|------|----------|
| Backend unit | `pytest`, `pytest-cov` | `backend/tests/` |
| Frontend unit | `vitest`, `@testing-library/react` | `frontend/src/__tests__/` |
| E2E | `playwright` | `frontend/e2e/` |

### Running the full suite

```bash
# Backend
cd backend
pytest --cov=app --cov-report=term

# Frontend
cd frontend
npx tsc --noEmit
npx playwright test --reporter=list
```

Coverage gate: backend must stay at ≥ 50% line coverage. Frontend has no hard gate yet but please add tests for any new component.

## Documentation

- Update `docs/API.md` when adding/changing endpoints.
- Update `docs/ERROR_CODES.md` for any new error codes.
- Update `docs/ARCHITECTURE.md` if you change a service boundary.
- Add a `CHANGELOG.md` entry under the current version section.

## Project Structure

```
AI-Data-Analyst-Agent/
├── backend/                    FastAPI application
│   ├── app/
│   │   ├── routes/             API endpoints
│   │   ├── services/           Business logic
│   │   ├── middleware/         Auth, rate limit, audit
│   │   ├── ai/                 AI provider abstraction
│   │   ├── schemas/            Pydantic models
│   │   ├── exceptions/         Custom exceptions
│   │   ├── common/             Shared utilities
│   │   └── main.py             FastAPI app factory
│   ├── tests/                  pytest suite
│   ├── requirements.txt
│   └── Dockerfile              Multi-stage
├── frontend/                   React 19 + Vite 8
│   ├── src/
│   │   ├── pages/              Route components
│   │   ├── components/         Reusable UI
│   │   ├── services/           API client wrappers
│   │   ├── store/              Zustand stores
│   │   ├── types/              Shared TS types
│   │   ├── layouts/            App shells
│   │   └── routes/             Router config
│   ├── e2e/                    Playwright tests
│   ├── nginx.conf
│   └── Dockerfile
├── docs/                       User-facing documentation
├── .github/
│   ├── workflows/              CI pipelines
│   ├── ISSUE_TEMPLATE/         (please add — see "Wanted contributions")
│   └── CODEOWNERS              Code review owners
├── docker-compose.yml          Production stack
├── docker-compose.staging.yml  Staging stack
├── ARCHITECTURE.md
├── CHANGELOG.md
├── CONTRIBUTING.md             (this file)
├── LICENSE
├── README.md
└── SECURITY.md
```

## Wanted contributions

We especially welcome help with:

- **GitHub issue templates** (`.github/ISSUE_TEMPLATE/`)
- **Vitest setup** for frontend unit tests
- **Mermaid architecture diagram** for `docs/ARCHITECTURE.md`
- **i18n prep** (extract hardcoded English strings)
- **Accessibility audit** (axe-core + Playwright a11y tests)

## License

By contributing, you agree that your contributions will be licensed under the [MIT License](LICENSE).
