# FlavorShift AI Backend — Multi-Stage Production Dockerfile
FROM python:3.11-slim AS builder

WORKDIR /build
COPY requirements.txt .
RUN pip install --no-cache-dir --prefix=/install -r requirements.txt

FROM python:3.11-slim AS runtime

LABEL maintainer="FlavorShift AI Team"
LABEL description="FlavorShift AI Backend — Compound Heterogeneous AI System"

WORKDIR /app

# Copy installed packages from builder stage
COPY --from=builder /install /usr/local

# Copy application and dataset scaffolding
COPY app/ ./app/
COPY data/ ./data/

# Runtime environment settings
ENV PYTHONUNBUFFERED=1
ENV FLAVORSHIFT_DEBUG=false
ENV FLAVORSHIFT_DATABASE_URL=sqlite+aiosqlite:///./flavorshift.db

EXPOSE 8000

# Healthcheck
HEALTHCHECK --interval=30s --timeout=5s --retries=3 \
    CMD python -c "import httpx; r = httpx.get('http://localhost:8000/api/v1/health'); r.raise_for_status()"

# Start server
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000", "--workers", "2"]
