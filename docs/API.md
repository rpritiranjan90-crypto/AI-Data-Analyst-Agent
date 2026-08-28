# API Reference

All endpoints are versioned under `/api` (with the exception of `/auth/*`, `/upload`, and the home/health endpoints which remain unversioned for backwards compatibility). Authentication is via `Authorization: Bearer <token>` header.

## Base URL

- Local: `http://127.0.0.1:8000`
- Production: `https://ai-data-analyst-agent-xs7p.onrender.com`

## Authentication

### POST /auth/login
Login with email + password.
```json
// Request
{ "email": "user@example.com", "password": "secure_password" }

// Response 200
{ "token": "eyJhbGciOi...", "token_type": "bearer", "user": { "id": "...", "email": "...", "name": "...", "role": "..." } }

// Response 401
{ "success": false, "message": "Incorrect email or password.", "code": "ERR_AUTH_INVALID_CREDENTIALS" }
```

### POST /auth/register
Register a new user.
```json
{ "email": "user@example.com", "password": "secure_password", "name": "Display Name" }

// Response 201
{ "success": true, "user": { "id": "...", "email": "...", "name": "...", "role": "owner" }, "token": "eyJ..." }
```

### GET /auth/me
Get current user from token.

## Data

### POST /upload
Upload a dataset file (multipart/form-data).
- Max size: 50MB
- Allowed extensions: `.csv`, `.xlsx`, `.xls`, `.json`, `.parquet`

### GET /latest-dataset
Returns metadata for the most recently uploaded dataset.

### GET /api/datasets/list
Paginated list of all datasets on the server.
```json
{ "success": true, "total": 12, "items": [{ "filename": "...", "size_bytes": 12345, "uploaded_at": "2026-01-15T..." }] }
```

### POST /datasets/join
Join two datasets on a key column.
```json
{ "left_filename": "a.csv", "right_filename": "b.csv", "left_on": "id", "right_on": "user_id", "how": "inner" }
```

## Cleaning

### POST /clean/auto
One-click auto-clean (fill nulls + dedupe + type inference).

### POST /clean/fill-missing
Impute missing values in a column.
```json
{ "column": "age", "method": "mean" }
// methods: mean, median, mode, constant, ffill, bfill
```

### POST /clean/remove-outliers
Remove outliers using IQR or Z-Score.
```json
{ "column": "salary", "method": "iqr", "threshold": 1.5 }
```

### POST /clean/drop-columns
Remove one or more columns.
```json
{ "columns": ["ssn", "phone"] }
```

### POST /clean/cast-types
Cast a column to a new type.
```json
{ "column": "date_str", "target_type": "datetime" }
// target_type: int, float, str, datetime, category
```

## Analysis

### POST /analysis/summary
Get summary statistics (mean, median, std, count, min, max).

### POST /analysis/describe
Get pandas describe() output.

### POST /analysis/query
Execute a raw DuckDB SQL query.
```json
{ "sql": "SELECT * FROM dataset WHERE age > 30 LIMIT 10" }
```

## Visualization

### POST /visualization/generate
Generate a chart and return PNG image path.
```json
{ "chart_type": "bar", "x_column": "region", "y_column": "sales", "theme": "default" }
// chart_type: bar, line, scatter, pie, histogram, boxplot, violin, heatmap, countplot, ...
```

## Machine Learning

### POST /ml/train
Train a model.
```json
{ "target": "churned", "algorithm": "random_forest", "test_size": 0.2 }
// algorithm: random_forest, linear_regression, logistic_regression, decision_tree, gradient_boosting, knn, svm
// Response: 200 on success, 200 with success=false on unknown algorithm (pipeline degrades gracefully)
```

### POST /ml/predict
Run inference on new data.
```json
{ "model_id": "...", "input": [{ ... }] }
```

### GET /ml/feature-importance
Return feature importance for the last trained tree-based model.

## AI

### GET /ai-insights
Generate AI insights for the current dataset.

### POST /ai-insights/auto-insights
Run automatic AI analysis.

### POST /chat
Send a natural language question to the AI assistant.
```json
{ "message": "What is the average salary by department?" }
```

## Reports

### POST /report/generate
Generate a PDF or PPTX report.
```json
{ "format": "pdf", "sections": ["summary", "cleaning", "visualization", "ml"] }
// format: pdf, pptx
```

## Governance

### GET /api/governance/stats
Get AI usage metrics.
```json
{ "total_calls": 142, "total_tokens_estimated": 28400, "total_cost_estimated": 0.42, "calls_by_endpoint": {...} }
```

## Readiness

### GET /api/readiness/check
Run production health checks and return score.
```json
{ "score": 85, "checks": [{ "name": "JWT_SECRET set", "passed": true }, ...] }
```

## Admin

### GET /api/admin/stats
Get workspace statistics.

### GET /api/admin/audit-logs?page=1&page_size=50
Get paginated audit log of mutating API calls.

## WebSocket

### WS /ws/collaborate
Real-time collaboration channel. Messages are broadcast to all connected clients.

## Error Codes

| Code | HTTP | Trigger |
|---|---|---|
| `ERR_AUTH_INVALID_CREDENTIALS` | 401 | Wrong email/password |
| `ERR_AUTH_TOKEN_EXPIRED` | 401 | JWT past expiry |
| `ERR_AUTH_UNAUTHORIZED` | 403 | Missing/invalid auth on protected route |
| `ERR_UPLOAD_TOO_LARGE` | 413 | File > 50MB |
| `ERR_UPLOAD_INVALID_EXTENSION` | 400 | File extension not in whitelist |
| `ERR_VALIDATION_FIELD_REQUIRED` | 422 | Missing required body field |
| `ERR_RATE_LIMIT_EXCEEDED` | 429 | Too many requests in window |
| `ERR_AI_PROVIDER_UNAVAILABLE` | 503 | Gemini API key invalid or service down |
| `ERR_DATASET_NOT_FOUND` | 404 | No dataset loaded |
| `ERR_PROCESSING_FAILED` | 500 | Backend processing error |
