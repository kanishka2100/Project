"""CORS and security middleware setup for the FastAPI application.

Call ``setup_middleware(app)`` once after creating the ``FastAPI`` instance
to register all production-ready middleware in the correct order.
"""

from __future__ import annotations

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware

from app.core.config import get_settings


def setup_middleware(app: FastAPI) -> None:
    """Register security-related middleware on *app*.

    Parameters
    ----------
    app:
        The FastAPI application instance to configure.
    """
    settings = get_settings()

    # ── CORS ─────────────────────────────────────────────────────────────
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.CORS_ORIGINS,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    # ── Trusted-Host ─────────────────────────────────────────────────────
    app.add_middleware(
        TrustedHostMiddleware,
        allowed_hosts=["*"],  # tighten in production
    )

    # ── Rate-Limiting (placeholder) ──────────────────────────────────────
    # TODO: integrate a production rate-limiter such as slowapi or a
    # Redis-backed token-bucket middleware before going live.
