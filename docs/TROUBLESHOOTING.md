# Troubleshooting Guide

Common issues and their fixes. If your problem isn't here, file an [issue](../../issues/new/choose).

## Table of Contents

- [Installation](#installation)
- [Authentication](#authentication)
- [Uploads](#uploads)
- [AI Features](#ai-features)
- [Charts & Visualization](#charts--visualization)
- [Machine Learning](#machine-learning)
- [Deployment](#deployment)
- [Performance](#performance)

## Installation

### `pip install` fails on pandas

**Cause**: Missing C compiler.

**Fix** (Ubuntu/Debian):
```bash
sudo apt install build-essential python3-dev
```

**Fix** (macOS):
```bash
xcode-select --install
```

### `npm install` fails with EACCES

**Cause**: Permissions on the global npm prefix.

**Fix**:
```bash
# Use nvm instead of system node
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
nvm install 20
```

### Backend won't start: `JWT_SECRET must be set in production`

**Cause**: Missing or empty `JWT_SECRET` env var.

**Fix**:
```bash
export JWT_SECRET="$(python -c 'import secrets; print(secrets.token_urlsafe(48))')"
# Add to your .env or deployment config
```

### Port 8000 already in use

**Cause**: Another service (or a zombie uvicorn) holds the port.

**Fix**:
```bash
# Linux / macOS
lsof -ti:8000 | xargs kill -9
# Windows
netstat -ano | findstr :8000
taskkill /PID <pid> /F
```

## Authentication

### `AUTH004 — Invalid email or password` on a fresh user

**Cause**: User wasn't registered yet, OR the backend was restarted (in-memory user store is wiped).

**Fix**: Register the user first via `POST /api/auth/register` or the signup UI.

### JWT token expired

**Cause**: Tokens expire after 24 hours (configurable in `app/config.py`).

**Fix**: Re-login. The frontend should auto-redirect to `/login` on 401.

### `CORS error: No 'Access-Control-Allow-Origin' header`

**Cause**: Backend's `CORS_ALLOWED_ORIGINS` doesn't include your frontend URL.

**Fix**: Add it to `backend/.env`:
```
CORS_ALLOWED_ORIGINS=http://localhost:5173,https://your-domain.com
```

## Uploads

### `UPLOAD002 — File exceeds maximum allowed size of 100 MB`

**Cause**: Dataset too large.

**Fix**:
- Sample down the CSV (e.g. `df.sample(n=100000)`) before uploading
- Or raise the limit in `backend/.env`:
  ```
  MAX_FILE_SIZE_MB=500
  ```

### `UPLOAD004 — Invalid .xlsx file signature`

**Cause**: File was renamed (e.g. `.csv` → `.xlsx`) or corrupted in transfer.

**Fix**: Re-export from the original application (Excel, Google Sheets) and try again.

### Upload succeeds but `dataset` is empty

**Cause**: CSV has only a header row, or the encoding isn't UTF-8.

**Fix**: Open the file in a text editor and check that:
- There's at least one data row
- The encoding is UTF-8 (not UTF-16 or Latin-1)

## AI Features

### `AI001 — Gemini API key not configured`

**Cause**: `GEMINI_API_KEY` is missing or empty.

**Fix**:
1. Get a key at https://aistudio.google.com/app/apikey
2. Add to `backend/.env`:
   ```
   GEMINI_API_KEY=AIzaSy...
   ```
3. Restart the backend.

### `AI003 — Rate limit exceeded`

**Cause**: Free tier of Gemini has ~15 requests/min.

**Fix**: Wait 60 seconds, or upgrade to a paid Gemini tier.

### AI insights return very generic results

**Cause**: Dataset is too small or has too many missing values.

**Fix**: Clean the dataset first (use `auto-clean`), then re-run AI insights.

## Charts & Visualization

### Chart image is broken / 404

**Cause**: The chart file wasn't created on disk.

**Fix**:
1. Check `backend/logs/` for errors
2. Make sure the column type matches the chart type (e.g. histogram needs numeric)
3. Try a different chart type from `/visualization/supported`

### `VIZ001 — Unknown chart type`

**Cause**: Frontend sent a chart_type not in the supported list.

**Fix**: Check `frontend/src/types/api.ts` for the `ChartType` union, and ensure your selection matches one of those.

## Machine Learning

### `ML004 — Insufficient data for train/test split`

**Cause**: Dataset has fewer than 10 rows.

**Fix**: Upload a larger dataset (aim for 100+ rows for meaningful results).

### `ML002 — Target column is not numeric for regression`

**Cause**: You selected a categorical target but used a regression model.

**Fix**: Either:
- Choose `random_forest`, `gradient_boosting`, or `knn` (these handle both)
- Or pre-encode the categorical column to numbers (e.g. 0/1)

### Model accuracy is very low

**Cause**: Class imbalance, irrelevant features, or noise in data.

**Fix**:
- Remove highly correlated features
- Use class_weight='balanced' (already default in logistic_regression)
- Try a different model (gradient_boosting usually wins on tabular data)

## Deployment

### Docker container exits immediately

**Fix**:
```bash
docker compose logs backend
# Look for Python traceback or missing env var
```

### Caddy fails to get HTTPS certificate

**Cause**: DNS not pointing to the VPS, or port 80 blocked.

**Fix**:
```bash
# Verify DNS
dig +short your-domain.com
# Should return your VPS IP
# Verify port 80 is open
sudo ufw status
```

### Frontend shows "Network Error" on API calls

**Cause**: `VITE_API_URL` was set wrong at build time.

**Fix**: Rebuild the frontend with the correct URL:
```bash
docker compose build --build-arg VITE_API_URL=https://api.your-domain.com frontend
docker compose up -d frontend
```

## Performance

### Backend uses too much memory

**Cause**: DuckDB in-memory dataset is large.

**Fix**:
- Switch from `in-memory` to `temp_directory` in `duckdb_service.py`
- Or limit the dataset size on upload

### First request is slow (>5s)

**Cause**: Backend is loading the model on first use.

**Fix**: This is normal cold-start. Subsequent requests are fast.

### Frontend bundle is large

**Cause**: All routes are eagerly loaded.

**Fix**: All routes are already code-split via `React.lazy` in `AppRouter.tsx`. Verify the `dist/assets/` folder has multiple chunks.

## Still stuck?

1. Check the logs: `docker compose logs -f` or `tail -200 backend/logs/app.log`
2. Search the [discussions](../../discussions)
3. File a [bug report](../../issues/new?template=bug_report.yml)
