# Error Codes Reference

Complete catalog of error codes returned by the AI Data Analyst Agent API.
All errors follow the standard envelope:

```json
{
  "success": false,
  "message": "Human-readable description",
  "errors": ["ERROR_CODE"],
  "metadata": { "path": "/api/...", "timestamp": "..." }
}
```

---

## HTTP Status Codes

| Status | Meaning | When Used |
|--------|---------|-----------|
| 400 | Bad Request | Malformed request body, invalid parameters |
| 401 | Unauthorized | Missing or invalid JWT token |
| 403 | Forbidden | Valid token but insufficient permissions |
| 404 | Not Found | Dataset, model, or resource not found |
| 422 | Validation Error | Request body fails Pydantic validation |
| 429 | Rate Limited | Too many requests from this IP |
| 500 | Internal Server Error | Unexpected backend failure |

---

## Application Error Codes

### Authentication & Authorization

| Code | HTTP | Trigger | Client Action |
|------|------|---------|---------------|
| `AUTH001` | 401 | Missing `Authorization: Bearer <token>` header | Attach valid JWT to request |
| `AUTH002` | 401 | Token expired (exp claim in past) | Re-authenticate via `/api/auth/login` |
| `AUTH003` | 401 | Token malformed or signature invalid | Re-authenticate via `/api/auth/login` |
| `AUTH004` | 401 | Invalid email or password | Check credentials and retry |
| `AUTH005` | 401 | User account disabled or deleted | Contact administrator |
| `AUTH006` | 422 | Email format invalid during registration | Provide a valid email address |
| `AUTH007` | 422 | Password too short (< 8 chars) | Use a password with at least 8 characters |

### Dataset & Upload

| Code | HTTP | Trigger | Client Action |
|------|------|---------|---------------|
| `UPLOAD001` | 400 | Empty file uploaded | Provide a file with at least one row |
| `UPLOAD002` | 400 | File exceeds 100 MB limit | Upload a smaller file or split the dataset |
| `UPLOAD003` | 400 | Unsupported file extension | Use CSV, XLSX, XLS, JSON, or Parquet |
| `UPLOAD004` | 400 | File signature mismatch (magic bytes) | Ensure file content matches its extension |
| `UPLOAD005` | 400 | Filename contains path traversal (`../`) | Remove path components from filename |
| `DATASET001` | 404 | No active dataset in memory | Upload a dataset first via `/upload` |
| `DATASET002` | 404 | Requested dataset not found on disk | Check filename and re-upload if needed |
| `DATASET003` | 400 | Dataset file corrupted or unreadable | Re-export and re-upload the dataset |

### Data Cleaning

| Code | HTTP | Trigger | Client Action |
|------|------|---------|---------------|
| `CLEAN001` | 400 | Column does not exist in dataset | Check column names with `/analysis/describe` |
| `CLEAN002` | 400 | Column is not numeric (for outlier removal) | Select a numeric column |
| `CLEAN003` | 400 | Invalid fill method | Use: `mean`, `median`, `mode`, `constant`, `ffill`, `bfill` |
| `CLEAN004` | 400 | Invalid data type for conversion | Use: `int`, `float`, `str`, `datetime`, `category` |
| `CLEAN005` | 400 | Constant value required for method `constant` | Provide a `value` parameter |
| `CLEAN006` | 400 | Z-score threshold out of range (must be > 0) | Set threshold between 0.1 and 10 |

### Analysis & Visualization

| Code | HTTP | Trigger | Client Action |
|------|------|---------|---------------|
| `VIZ001` | 400 | Unknown chart type | Check `/visualization/supported` for valid types |
| `VIZ002` | 400 | Column not found for chart axis | Verify column name with `/analysis/columns` |
| `VIZ003` | 400 | Insufficient data for chart (need >= 2 rows) | Upload a dataset with more data |
| `VIZ004` | 400 | Invalid SQL query syntax | Review SQL query and retry |
| `VIZ005` | 400 | SQL query references non-existent column | Check available columns and update query |
| `QUERY001` | 400 | SQL injection attempt detected | Use parameterized queries; do not concatenate user input |
| `QUERY002` | 400 | Query returned no results | Adjust query conditions |
| `QUERY003` | 403 | SQL query contains write keywords (INSERT/UPDATE/DELETE) | Use read-only SELECT queries only |

### Machine Learning

| Code | HTTP | Trigger | Client Action |
|------|------|---------|---------------|
| `ML001` | 400 | Target column not found | Specify a valid column name from the dataset |
| `ML002` | 400 | Target column is not numeric for regression | Select a numeric target column |
| `ML003` | 400 | Target column is not categorical for classification | Select a categorical target column |
| `ML004` | 400 | Insufficient data for train/test split | Dataset needs at least 10 rows |
| `ML005` | 400 | `test_size` must be between 0.1 and 0.9 | Set test_size within the valid range |
| `ML006` | 400 | Too many features (all columns selected) | Exclude the target column from features |
| `ML007` | 404 | Trained model not found | Train a model first via `/api/ml/train` |

### Reports

| Code | HTTP | Trigger | Client Action |
|------|------|---------|---------------|
| `REPORT001` | 400 | Invalid report format | Use `pdf` or `pptx` |
| `REPORT002` | 400 | No sections selected for report | Include at least one valid section |
| `REPORT003` | 500 | Report generation failed | Retry; check that dataset and charts exist |
| `REPORT004` | 404 | Dataset or chart not found for report | Run analysis before generating report |

### AI & Governance

| Code | HTTP | Trigger | Client Action |
|------|------|---------|---------------|
| `AI001` | 503 | Gemini API key not configured | Set `GEMINI_API_KEY` in `backend/.env` |
| `AI002` | 503 | Gemini API returned 503 (overloaded) | Wait and retry the request |
| `AI003` | 429 | Gemini rate limit exceeded | Wait before sending more AI requests |
| `AI004` | 401 | Invalid Gemini API key | Verify `GEMINI_API_KEY` in `backend/.env` |
| `AI005` | 504 | Gemini request timed out | Retry with a smaller dataset or simpler query |
| `AI006` | 500 | AI response parsing failed | Retry; report issue if it persists |
| `GOVERNANCE001` | 500 | Governance metrics store unavailable | Restart the backend server |

### Rate Limiting

| Code | HTTP | Trigger | Client Action |
|------|------|---------|---------------|
| `RATE001` | 429 | Too many requests from this IP | Wait 60 seconds and retry |
| `RATE002` | 429 | Upload rate limit exceeded | Reduce upload frequency |

### General

| Code | HTTP | Trigger | Client Action |
|------|------|---------|---------------|
| `GEN001` | 500 | Internal server error | Check backend logs; retry or report issue |
| `GEN002` | 503 | Service temporarily unavailable | Wait and retry |
| `VALIDATION001` | 422 | Pydantic validation failure | Check request body schema and field types |
| `NOT_FOUND` | 404 | Resource not found | Verify the resource exists before accessing |

---

## Error Response Examples

### Authentication Error
```json
{
  "success": false,
  "message": "Invalid email or password.",
  "errors": ["AUTH004"],
  "metadata": {
    "path": "/api/auth/login",
    "timestamp": "2026-08-28T10:30:00Z"
  }
}
```

### Validation Error (422)
```json
{
  "success": false,
  "message": "Request validation failed.",
  "errors": ["VALIDATION_ERROR"],
  "metadata": {
    "validation_errors": [
      { "field": "email", "message": "value is not a valid email address", "type": "value_error" }
    ],
    "path": "/api/auth/register",
    "timestamp": "2026-08-28T10:30:00Z"
  }
}
```

### Rate Limited (429)
```json
{
  "success": false,
  "message": "Too many requests. Please wait 60 seconds.",
  "errors": ["RATE001"],
  "metadata": {
    "path": "/api/analysis/query",
    "retry_after": 60,
    "timestamp": "2026-08-28T10:30:00Z"
  }
}
```
