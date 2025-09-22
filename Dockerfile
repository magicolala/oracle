# Multi-stage build for Oracle chess analysis application

# Stage 1: Build the frontend
FROM node:18-alpine AS frontend-builder

WORKDIR /app/frontend

# Copy frontend package files
COPY src/oracle/web/frontend/package*.json ./

# Install dependencies
RUN npm ci

# Copy frontend source
COPY src/oracle/web/frontend/ ./

# Build the frontend
RUN npm run build

# Stage 2: Python application
FROM python:3.12-slim

# Install system dependencies
RUN apt-get update && apt-get install -y \
    curl \
    stockfish \
    && rm -rf /var/lib/apt/lists/*

# Install Poetry
RUN pip install poetry

# Set working directory
WORKDIR /app

# Copy Python dependency files
COPY pyproject.toml poetry.lock ./

# Configure poetry to not create virtual environment
RUN poetry config virtualenvs.create false

# Install Python dependencies
RUN poetry install --only=main --no-dev

# Copy source code
COPY src/ ./src/

# Copy built frontend assets to static directory
COPY --from=frontend-builder /app/frontend/dist/ ./src/oracle/web/static/

# Create non-root user
RUN useradd --create-home --shell /bin/bash app \
    && chown -R app:app /app
USER app

# Set environment variables
ENV STOCKFISH_PATH=/usr/games/stockfish
ENV PYTHONPATH=/app/src
ENV PORT=8000

# Expose port
EXPOSE 8000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:8000/ || exit 1

# Run the application
CMD ["python", "-m", "uvicorn", "oracle.web.app:app", "--host", "0.0.0.0", "--port", "8000"]
