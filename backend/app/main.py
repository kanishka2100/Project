"""FlavorShift AI — Core FastAPI Application Factory.

Compound Heterogeneous AI System for Culinary Intelligence,
Ingredient Substitution, and Human Taste Validation.
"""

from contextlib import asynccontextmanager
import logging

from fastapi import FastAPI

from app.core.config import get_settings
from app.core.database import init_db
from app.core.security import setup_middleware
from app.routers import (
    flavor_router,
    health_router,
    htv_router,
    ratio_router,
    sensory_router,
    sop_router,
    substitution_router,
)

logger = logging.getLogger("flavorshift")
settings = get_settings()


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan manager: runs startup and shutdown tasks."""
    logger.info("Initializing FlavorShift AI database tables...")
    await init_db()
    logger.info("FlavorShift AI backend started successfully [%s].", settings.VERSION)
    yield
    logger.info("FlavorShift AI backend shutting down...")


app = FastAPI(
    title=settings.APP_NAME,
    description=(
        "Compound Heterogeneous AI Platform for Intelligent Culinary "
        "Ingredient Substitution & Human Taste Validation."
    ),
    version=settings.VERSION,
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc",
)

# Setup CORS, security headers, trusted hosts
setup_middleware(app)

# Include Routers under the unified /api/v1 prefix
app.include_router(health_router.router, prefix=settings.API_PREFIX)
app.include_router(flavor_router.router, prefix=settings.API_PREFIX)
app.include_router(sensory_router.router, prefix=settings.API_PREFIX)
app.include_router(ratio_router.router, prefix=settings.API_PREFIX)
app.include_router(sop_router.router, prefix=settings.API_PREFIX)
app.include_router(htv_router.router, prefix=settings.API_PREFIX)
app.include_router(substitution_router.router, prefix=settings.API_PREFIX)


@app.get("/", tags=["Root"])
async def root():
    """Root metadata endpoint."""
    return {
        "message": f"{settings.APP_NAME} API Engine",
        "version": settings.VERSION,
        "docs": "/docs",
        "health": f"{settings.API_PREFIX}/health",
    }
