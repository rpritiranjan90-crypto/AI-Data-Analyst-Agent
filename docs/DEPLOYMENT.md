# Deployment Guide

This guide covers deploying the AI Data Analyst Agent to popular platforms.

## Table of Contents

- [Architecture](#architecture)
- [Prerequisites](#prerequisites)
- [Option 1 — Vercel + Render (Easiest)](#option-1--vercel--render)
- [Option 2 — Single-VPS Docker (Most Control)](#option-2--single-vps-docker)
- [Option 3 — Kubernetes (Production Scale)](#option-3--kubernetes)
- [HTTPS Setup](#https-setup)
- [Monitoring](#monitoring)
- [Backups](#backups)

## Architecture

```
                         ┌──────────────────────────┐
                         │   Cloudflare / Nginx     │
                         │   (TLS, WAF, Rate Limit) │
                         └─────────────┬────────────┘
                                       │
              ┌────────────────────────┴────────────────────┐
              │                                             │
       ┌──────▼──────┐                              ┌───────▼────────┐
       │   Vercel    │                              │  Render / VPS  │
       │  (Frontend) │ ────────────HTTPS──────────▶│  (FastAPI)     │
       │  React SPA  │                              │  + DuckDB      │
       └─────────────┘                              └────────────────┘
```

## Prerequisites

Before deploying you need:

1. **Domain name** (e.g. `analyst.your-domain.com`)
2. **API key** for the AI provider (Gemini recommended — free tier available)
3. **JWT_SECRET** — generate with:
   ```bash
   python -c "import secrets; print(secrets.token_urlsafe(48))"
   ```
4. **Docker Hub / GHCR account** (for Option 2/3)

## Environment Variables

### Backend (required in production)

| Variable | Required | Description |
|----------|----------|-------------|
| `APP_ENV` | yes | `production` |
| `JWT_SECRET` | yes | 32+ chars random string |
| `GEMINI_API_KEY` | optional | AI features if missing disabled |
| `CORS_ALLOWED_ORIGINS` | yes | Comma-separated list of frontend URLs |
| `LOG_LEVEL` | no | Default `INFO` |
| `MAX_FILE_SIZE_MB` | no | Default `100` |

### Frontend (build-time)

| Variable | Required | Description |
|----------|----------|-------------|
| `VITE_API_URL` | yes | Full URL of backend (no trailing slash) |
| `VITE_APP_NAME` | no | Browser title |

## Option 1 — Vercel + Render (Easiest)

### Frontend on Vercel

1. Push to GitHub.
2. Go to https://vercel.com/new and import the repo.
3. Set:
   - **Root directory**: `frontend`
   - **Build command**: `npm run build`
   - **Output directory**: `dist`
   - **Environment variables**: `VITE_API_URL=https://api.your-domain.com`
4. Deploy. Vercel gives you a `*.vercel.app` URL.

### Backend on Render

1. Go to https://render.com and create a new **Web Service** from the GitHub repo.
2. Set:
   - **Root directory**: `backend`
   - **Build command**: `pip install -r requirements.txt`
   - **Start command**: `uvicorn app.main:app --host 0.0.0.0 --port $PORT --workers 4`
   - **Environment variables**: `APP_ENV`, `JWT_SECRET`, `GEMINI_API_KEY`
   - **Plan**: Starter ($7/mo) or higher
3. Render gives you a `*.onrender.com` URL.

### Custom domain

In Vercel: Project → Settings → Domains. In Render: Service → Settings → Custom Domain.

## Option 2 — Single-VPS Docker (Most Control)

Works on any VPS: DigitalOcean, Hetzner, AWS Lightsail, etc.

### One-time setup

```bash
# SSH into the VPS
ssh root@your-vps-ip

# Install Docker
curl -fsSL https://get.docker.com | sh

# Create app directory
mkdir -p /opt/ai-analyst && cd /opt/ai-analyst
```

### docker-compose.production.yml

```yaml
version: '3.8'

services:
  caddy:
    image: caddy:2
    ports: ["80:80", "443:443"]
    volumes:
      - ./Caddyfile:/etc/caddy/Caddyfile
      - caddy_data:/data
    restart: unless-stopped

  backend:
    build: ./backend
    environment:
      - APP_ENV=production
      - JWT_SECRET=${JWT_SECRET}
      - GEMINI_API_KEY=${GEMINI_API_KEY}
      - CORS_ALLOWED_ORIGINS=https://${DOMAIN}
    volumes:
      - backend_uploads:/app/uploads
      - backend_reports:/app/reports
    restart: unless-stopped

  frontend:
    build:
      context: ./frontend
      args:
        - VITE_API_URL=https://${DOMAIN}
    restart: unless-stopped

volumes:
  backend_uploads:
  backend_reports:
  caddy_data:
```

### Caddyfile (auto-HTTPS)

```
${DOMAIN} {
    reverse_proxy frontend:80
    handle /api/* {
        reverse_proxy backend:8000
    }
    handle /ws/* {
        reverse_proxy backend:8000
    }
}
```

Caddy auto-provisions Let's Encrypt certificates — no manual cert management.

### Deploy

```bash
JWT_SECRET=$(python -c "import secrets; print(secrets.token_urlsafe(48))") \
GEMINI_API_KEY=your-key-here \
DOMAIN=analyst.your-domain.com \
docker compose -f docker-compose.production.yml up -d --build
```

## Option 3 — Kubernetes (Production Scale)

For teams expecting >1000 RPS.

### Backend Deployment (excerpt)

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: ai-analyst-backend
spec:
  replicas: 3
  selector:
    matchLabels: { app: ai-analyst-backend }
  template:
    metadata:
      labels: { app: ai-analyst-backend }
    spec:
      containers:
        - name: backend
          image: ghcr.io/your-org/ai-analyst-backend:v2.0.0
          ports: [{ containerPort: 8000 }]
          env:
            - name: APP_ENV
              value: production
            - name: JWT_SECRET
              valueFrom:
                secretKeyRef:
                  name: ai-analyst-secrets
                  key: jwt-secret
          resources:
            requests: { cpu: 500m, memory: 512Mi }
            limits: { cpu: 2, memory: 2Gi }
```

For a complete Kustomize / Helm chart, see the `deploy/k8s/` folder (coming soon — contribution welcome).

## HTTPS Setup

The easiest path is Caddy (auto-renews certs). For nginx:

1. Install certbot: `apt install certbot python3-certbot-nginx`
2. Run: `certbot --nginx -d analyst.your-domain.com`
3. Certbot auto-renews via systemd timer.

## Monitoring

### Logs

```bash
docker compose logs -f --tail=200
```

### Health check

The backend exposes `/health` (returns 200 if app is up) and `/api/readiness/check` (returns readiness score). Point your uptime monitor at:

```
GET https://your-domain.com/health   # expect 200 within 5s
```

Recommended free services: UptimeRobot, Better Uptime, Healthchecks.io.

### Error tracking

Add Sentry for production:

```bash
pip install sentry-sdk[fastapi]
```

```python
import sentry_sdk
sentry_sdk.init(dsn=os.getenv("SENTRY_DSN"), traces_sample_rate=0.1)
```

## Backups

| Data | How to back up |
|------|----------------|
| Uploaded datasets | `tar czf uploads-$(date +%F).tgz /var/lib/docker/volumes/.../uploads` |
| Generated reports | Same — `tar czf reports-$(date +%F).tgz ...` |
| Trained ML models | (in-memory only — retrain on recovery) |
| User accounts | (in-memory — production should swap for PostgreSQL) |

Schedule daily via cron:

```cron
0 2 * * * cd /opt/ai-analyst && ./scripts/backup.sh
```

## Upgrading

```bash
git pull
docker compose -f docker-compose.production.yml up -d --build
```

The backend has no persistent state in v2.x so rolling upgrades are safe (memory caches reset, but data on disk is untouched).

---

## Production Readiness Checklist

Run through this list before going live. Each item is either **critical** (block deployment) or **recommended** (deploy with a known limitation).

### Critical (must pass)

- [x] **`JWT_SECRET` is set** — backend refuses to start in `production` without it (enforced by `_resolve_jwt_secret()`)
- [x] **`APP_ENV=production`** — enables HSTS, tightens CSP, enforces 32-char secret minimum
- [x] **HTTPS termination** — use Caddy (auto-Let's-Encrypt) or a managed LB (Cloudflare/Render)
- [x] **`CORS_ALLOWED_ORIGINS` set to your domain only** — never `*` in production
- [x] **WebSocket auth enabled** — `ws://host/ws/collaborate?token=<jwt>` requires a valid JWT (returns 4001 if missing/invalid)
- [x] **Rate limiting active** — 120 req/min/IP globally, 10/min for uploads (returns 429 with `Retry-After`)
- [x] **Security headers** — CSP, HSTS, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy
- [x] **Sentry DSN set** (`SENTRY_DSN` and `VITE_SENTRY_DSN`) — capture errors in both frontend and backend
- [x] **Backend runs as non-root user** — `appuser:1000` (set in Dockerfile)
- [x] **Healthcheck configured** — `/health` returns 200 when app is up

### Recommended (deploy with caveat)

- [ ] **Redis-backed rate limiter** — current in-memory limiter undercounts across multiple replicas. Swap to `slowapi` + Redis before horizontal scaling.
- [ ] **DuckDB shared state** — currently each uvicorn worker has its own DuckDB instance. Datasets uploaded to worker A are not visible to worker B. Options:
  - Sticky sessions (LB-level)
  - Externalize dataset metadata to Redis or PostgreSQL
  - Run a single-worker deployment (simpler for low traffic)
- [ ] **Persistent database for users** — current `USERS_DB` is in-memory and resets on restart. Move to PostgreSQL before public launch.
- [ ] **Backup strategy scheduled** — cron job to back up `uploads/`, `reports/`, `generated_charts/` to S3 or equivalent
- [ ] **Load test run** — execute a quick k6/Locust test against staging to confirm rate-limit thresholds are appropriate
- [ ] **Uptime monitoring** — point UptimeRobot or Better Uptime at `/health` and `/api/readiness/check`
- [ ] **Log aggregation** — forward Docker logs to Datadog/Loki/CloudWatch

### Verification commands

```bash
# 1. Health
curl -fI https://your-domain.com/health
# expect: HTTP/2 200

# 2. Security headers
curl -sI https://your-domain.com/health | grep -E "Strict-Transport|X-Frame|Content-Security"
# expect: all three present

# 3. Rate limit (should return 429 after 120 reqs in 60s)
for i in {1..125}; do curl -s -o /dev/null -w "%{http_code}\n" https://your-domain.com/health; done | sort | uniq -c

# 4. WebSocket auth (should fail without token)
wscat -c wss://your-domain.com/ws/collaborate
# expect: connection closed with code 4001

# 5. Readiness score
curl -s https://your-domain.com/api/readiness/check | jq .total_score
# expect: 80+ on a healthy production deployment
```
