# Multi-stage Backend Dockerfile for AI Data Analyst Agent
# Stage 1: builder — installs all dependencies into a dedicated prefix
# Stage 2: runtime — slim image with only the installed dependencies + app

# ============================================================================
# Stage 1: Builder
# ============================================================================
FROM python:3.11-slim AS builder

WORKDIR /build

# Prevent Python from writing .pyc files & enable unbuffered stdout
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=1 \
    PIP_DISABLE_PIP_VERSION_CHECK=1

# Install build dependencies (required for compiling C extensions like numpy, pandas)
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    gcc \
    libgomp1 \
    && rm -rf /var/lib/apt/lists/*

# Copy only requirements first for better layer caching
COPY requirements.txt .

# Install Python deps into a separate prefix we'll copy in stage 2
RUN pip install --prefix=/install --no-cache-dir -r requirements.txt


# ============================================================================
# Stage 2: Runtime (slim final image)
# ============================================================================
FROM python:3.11-slim AS runtime

WORKDIR /app

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PYTHONPATH=/app \
    PATH="/install/bin:${PATH}"

# Install only runtime libraries (no compilers / build tools)
RUN apt-get update && apt-get install -y --no-install-recommends \
    libgomp1 \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Copy installed Python packages from builder
COPY --from=builder /install /usr/local

# Copy application source code
COPY . .

# Ensure data directories exist with proper permissions
RUN mkdir -p \
    /app/datasets \
    /app/reports \
    /app/generated_charts \
    /app/uploads \
    /app/charts \
    /app/cleaned_data \
    && chmod -R 755 /app

# Expose FastAPI port
EXPOSE 8000

# Health check
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD curl -f http://localhost:8000/health || exit 1

# Run as non-root user for better security
RUN useradd -m -u 1000 appuser && chown -R appuser:appuser /app
USER appuser

# Launch FastAPI server with uvicorn — 4 workers for production concurrency.
# Gunicorn is overkill for this app; uvicorn --workers is simpler.
# Override CMD at runtime if you need more workers (e.g. K8s horizontal pod autoscaler).
CMD ["python", "-m", "uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000", "--workers", "4"]
