"""Application configuration using pydantic-settings.

Centralises all environment-driven settings for the FlavorShift AI backend.
A cached ``get_settings()`` helper provides a process-wide singleton.
"""

from __future__ import annotations

from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """FlavorShift AI configuration sourced from environment / ``.env`` file.

    Every field can be overridden by setting an environment variable with the
    ``FLAVORSHIFT_`` prefix (e.g. ``FLAVORSHIFT_DEBUG=true``).
    """

    model_config = SettingsConfigDict(
        env_file=".env",
        env_prefix="FLAVORSHIFT_",
        env_file_encoding="utf-8",
        case_sensitive=False,
    )

    # ── Application ──────────────────────────────────────────────────────
    APP_NAME: str = "FlavorShift AI"
    VERSION: str = "0.1.0"
    DEBUG: bool = False
    API_PREFIX: str = "/api/v1"

    # ── Database ─────────────────────────────────────────────────────────
    DATABASE_URL: str = "sqlite+aiosqlite:///./flavorshift.db"

    # ── Groq / Llama 3.1 ────────────────────────────────────────────────
    GROQ_API_KEY: str = ""
    GROQ_MODEL_NAME: str = "llama-3.1-8b-instant"

    # ── CORS ─────────────────────────────────────────────────────────────
    CORS_ORIGINS: list[str] = [
        "http://localhost:8080",
        "http://localhost:3000",
        "https://kanishka2100.github.io",
    ]

    # ── Redis ────────────────────────────────────────────────────────────
    REDIS_URL: str = "redis://localhost:6379/0"

    # ── Foodoscope / FlavorDB API ────────────────────────────────────────
    FOODOSCOPE_API_KEY: str = "XSHWtIa1UXATvKvsrWpZtgtPDWo6IaOsVKgBGSRPsdxewtur"
    FOODOSCOPE_BASE_URL: str = "https://api.foodoscope.com"

    # ── AI Model Artefact Paths ──────────────────────────────────────────
    FLAVORGRAPH_VECTORS_PATH: str = "data/flavorgraph_vectors/embeddings.npy"
    SENSORY_ONNX_MODEL_PATH: str = "data/sensory_model/sensory_model.onnx"


@lru_cache(maxsize=1)
def get_settings() -> Settings:
    """Return a cached singleton of the application settings."""
    return Settings()
