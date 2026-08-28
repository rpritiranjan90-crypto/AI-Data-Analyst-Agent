# AI Data Analyst Agent — College Major Project Guide

## Abstract

The AI Data Analyst Agent is a full-stack enterprise platform that democratizes data analysis by enabling non-technical users to upload, profile, clean, visualize, and apply machine learning to their datasets through a browser-based interface. The system combines a FastAPI backend (Python, Pandas, DuckDB, Scikit-Learn) with a React 19 frontend (TypeScript, Tailwind v4, Zustand) to deliver an end-to-end analytics pipeline. An AI assistant powered by Google Gemini provides natural language querying, automatic chart recommendations, and executive summaries. The platform implements OWASP security best practices, comprehensive error handling, and full-stack type safety.

## 1. Problem Statement

Modern organizations generate massive volumes of data but lack the technical expertise to extract insights. Existing tools fall into two categories:

1. **Technical tools** (Python notebooks, SQL) — require programming skills
2. **Enterprise BI** (Tableau, Power BI) — expensive ($50–$200/user/month) and require training

Small businesses, students, and non-technical professionals are underserved. They need a tool that:
- Accepts raw CSV files
- Cleans and profiles data automatically
- Generates visualizations without code
- Trains and applies ML models
- Outputs executive PDF reports

## 2. Literature Survey

| Tool | Strengths | Weaknesses |
|---|---|---|
| **Tableau** | Industry-leading viz, drag-and-drop UI | $75/user/month, desktop app, learning curve |
| **Power BI** | Microsoft integration, low cost | Windows-centric, limited ML |
| **DataRobot** | Automated ML, enterprise features | $100k+/year, opaque to users |
| **Streamlit** | Python-native, fast prototyping | Not production-grade, single-user |
| **Jupyter Notebooks** | Maximum flexibility | Requires Python, no sharing, error-prone |
| **Google Data Studio** | Free, web-based | Limited cleaning, no ML |

## 3. Proposed Solution

The AI Data Analyst Agent addresses the gap with these differentiators:

- **Free & Open Source** (MIT) — accessible to students and small businesses
- **Browser-Based** — no installation, cross-platform
- **AI-Powered** — natural language interface for non-technical users
- **End-to-End** — single tool from upload to executive report
- **Privacy-First** — local file storage, no third-party data sharing (only AI prompts)

## 4. System Requirements

### 4.1 Functional Requirements

| ID | Description |
|---|---|
| FR-1 | User can register and log in with email + password |
| FR-2 | User can upload CSV, XLSX, JSON, or Parquet files up to 50MB |
| FR-3 | System validates and profiles uploaded data (rows, columns, types, missing values) |
| FR-4 | User can apply data cleaning operations: fill nulls, remove outliers, drop columns, type-cast |
| FR-5 | User can generate 19+ chart types with column selectors and theme controls |
| FR-6 | User can train ML models (classification + regression) and view evaluation metrics |
| FR-7 | User can generate PDF or PPTX reports of the analysis |
| FR-8 | User can ask natural language questions about the dataset (AI-powered) |
| FR-9 | Admin can view system metrics: total uploads, API usage, AI cost, audit logs |
| FR-10 | System enforces rate limiting (120 req/60s global, 10 req/60s upload) |

### 4.2 Non-Functional Requirements

| ID | Description |
|---|---|
| NFR-1 | Response time < 2s for datasets ≤ 100k rows |
| NFR-2 | Availability: 99% (single-region deployment) |
| NFR-3 | Security: OWASP Top 10 compliance |
| NFR-4 | Browser support: Chrome, Firefox, Safari, Edge (latest 2 versions) |
| NFR-5 | Mobile-responsive (sidebar collapses on < 768px width) |
| NFR-6 | Accessibility: WCAG 2.1 AA contrast, keyboard navigation |
| NFR-7 | Type safety: TypeScript strict mode, Pydantic response models |

## 5. Module Description

| Module | Input | Output | Responsibility |
|---|---|---|---|
| `auth_service` | email, password | JWT token, user record | Hash, verify, issue tokens, enforce lockout |
| `dataset_service` | file path, contents | metadata, profile, statistics | Validate, load into DuckDB, compute profile |
| `cleaning_service` | column name, operation, params | cleaned DataFrame | Apply fill/drop/cast/outlier ops |
| `analysis_service` | dataset, query (SQL or NL) | result table, summary | Execute DuckDB SQL, return rows |
| `visualization_service` | dataset, chart type, columns | PNG image | Render matplotlib/seaborn/plotly chart |
| `ml_service` | dataset, model type, target col | trained model, metrics | Train, evaluate, predict |
| `ai_insights_service` | dataset, prompt | summary, sql, chart rec | Call Gemini, parse response |
| `report_service` | dataset, sections list | PDF/PPTX bytes | Build executive deck with reportlab/python-pptx |
| `governance_service` | in-memory usage log | usage stats, cost estimate | Track AI calls, estimate tokens + cost |
| `admin_service` | audit log buffer | paginated logs, stats | Surface workspace metrics |

## 6. Future Enhancements

1. **Multi-user workspaces** — shared datasets, role-based access control
2. **Real-time collaboration** — WebSocket-based dataset editing with presence indicators
3. **Streaming ingestion** — Kafka connector for live data feeds
4. **Model registry** — versioning and rollback for trained ML models
5. **AI fine-tuning** — custom Gemini model fine-tuned on user's historical analyses
6. **Mobile app** — React Native companion for on-the-go exploration

## 7. References

1. FastAPI Documentation — https://fastapi.tiangolo.com
2. React Documentation — https://react.dev
3. DuckDB Documentation — https://duckdb.org/docs
4. OWASP Top 10 — https://owasp.org/Top10
5. Scikit-Learn User Guide — https://scikit-learn.org
6. Google Gemini API — https://ai.google.dev
7. Pydantic V2 Migration Guide — https://docs.pydantic.dev/latest/migration
8. Tailwind CSS v4 Beta — https://tailwindcss.com/blog/tailwindcss-v4-beta
9. Zustand State Management — https://github.com/pmndrs/zustand
10. OWASP API Security Top 10 — https://owasp.org/API-Security/editions/2023
