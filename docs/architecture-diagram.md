# Architecture Diagram

This file contains a Mermaid diagram that can be rendered to PNG/SVG using https://mermaid.live or the VSCode Mermaid plugin.

---

## System Component Diagram

```mermaid
graph TB
    subgraph Client["🌐 Frontend (React 19)"]
        SPA["Single Page Application"]
        STORE["Zustand Store<br/>(localStorage persistence)"]
        QUERY["TanStack Query + Axios"]
    end

    subgraph Backend["⚙️ Backend (FastAPI)"]
        ROUTES["API Routes<br/>(/auth, /upload, /clean, ...)"]
        SERVICES["Service Layer"]
        AI["AI Service Layer<br/>(Gemini Factory)"]
        DB["DuckDB In-Memory Engine"]
        CACHE["TTL Cache<br/>(AI tokens, dataset profile)"]
    end

    subgraph Middleware["🛡️ Middleware Stack"]
        CORS["CORS"]
        RATE["Rate Limiter<br/>(IP sliding window)"]
        SECHEAD["Security Headers<br/>(CSP, HSTS, XFO)"]
        AUDIT["Audit Logger<br/>(mutating requests)"]
    end

    subgraph Storage["💾 Storage"]
        UPLOADS["Upload Directory<br/>(CSV, XLSX, Parquet)"]
        REPORTS["Reports<br/>(PDF, PPTX)"]
        CHARTS["Generated Charts<br/>(PNG)"]
    end

    SPA --> ROUTES
    QUERY --> ROUTES
    STORE --> UPLOADS
    ROUTES --> Middleware
    ROUTES --> SERVICES
    SERVICES --> DB
    SERVICES --> CACHE
    SERVICES --> AI
    SERVICES --> UPLOADS
    AI --> CHARTS
    DB --> UPLOADS
```

## Request Lifecycle — Upload + Analyze

```mermaid
sequenceDiagram
    participant User
    participant Frontend
    participant FastAPI
    participant DuckDB
    participant AI
    participant Storage

    User->>Frontend: Upload CSV file
    Frontend->>FastAPI: POST /upload (multipart/form-data)
    FastAPI->>Storage: Save file to disk
    Storage-->>FastAPI: file path
    FastAPI->>DuckDB: Load into memory
    DuckDB-->>FastAPI: DataFrame
    FastAPI->>DuckDB: Profile dataset
    DuckDB-->>FastAPI: metadata (rows, cols, types)
    FastAPI-->>Frontend: DatasetMetadata + profile
    Frontend->>User: Show KPI dashboard

    User->>Frontend: Click "Auto-Clean"
    Frontend->>FastAPI: POST /clean/auto-clean
    FastAPI->>DuckDB: fill_missing + remove_duplicates
    DuckDB-->>FastAPI: cleaned DataFrame
    FastAPI->>DuckDB: update in-memory
    DuckDB-->>FastAPI: cleaning_report
    FastAPI-->>Frontend: CleaningResult

    User->>Frontend: Click "Generate AI Insights"
    Frontend->>FastAPI: GET /api/ai-insights/summary
    FastAPI->>AI: Gemini generate_content
    AI-->>FastAPI: insights_text
    FastAPI->>DuckDB: fetch_metadata
    DuckDB-->>FastAPI: context
    FastAPI-->>Frontend: AIInsightResponse
```

## AI Provider Factory

```mermaid
graph LR
    Request["AI Request"] --> Factory["Provider Factory"]
    Factory -->|gemini| Gemini["GeminiProvider"]
    Factory -->|openai| OpenAI["OpenAIProvider"]
    Factory -->|ollama| Ollama["OllamaProvider"]
    Gemini --> Response["AIResponse"]
    OpenAI --> Response
    Ollama --> Response
```

## Security Middleware Stack

```mermaid
graph TB
    Start["Incoming Request"] --> RATE["Rate Limiter<br/>429 if over limit"]
    RATE --> SECHEAD["Security Headers<br/>(CSP, HSTS, XFO, XCTO)"]
    SECHEAD --> AUDIT["Audit Logger<br/>(records method/path/IP/user/status)"]
    AUDIT --> CORS["CORS Check<br/>403 if origin not allowed"]
    CORS --> Handler["Route Handler"]
```

## Deployment Architecture

```mermaid
graph LR
    User["Client Browser"] --> CF["Cloudflare<br/>(CDN + WAF + HTTPS)"]
    CF --> FE["Vercel<br/>(React SPA)"]
    CF --> BE["Render / VPS<br/>(FastAPI Backend)"]
    BE --> DB[("DuckDB<br/>In-Memory")]
    BE --> Disk[("Local Disk<br/>Uploads / Reports")]
```

---

## How to Render

### Option A — Mermaid Live (recommended for PNG export)
1. Open https://mermaid.live
2. Paste the diagram code (between the ```mermaid and ``` markers)
3. Click "Actions" → "PNG" or "SVG"
4. Save to `docs/architecture.png` (or `docs/architecture.svg`)

### Option B — VSCode Plugin
1. Install the "Markdown Preview Mermaid Support" extension
2. Open this file in VSCode
3. Right-click preview → "Open Preview" → right-click → "Copy Image"

### Option C — CLI with mermaid-cli
```bash
npm install -g @mermaid-js/mermaid-cli
mmdc -i docs/architecture-diagram.md -o docs/architecture.png -w 2400 -H 1600
```

### Option D — Python with mermaid-py
```python
import mermaid
diagrams = mermaid.parse_file("docs/architecture-diagram.md")
for name, code in diagrams.items():
    mermaid.render(code, f"docs/architecture-{name}.png", width=2400, height=1600)
```

After rendering, the diagrams will be available as PNGs in this `docs/` folder, ready to embed in the README.
