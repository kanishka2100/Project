"""Async SQLAlchemy 2.0 database engine, session factory, and helpers.

Provides:
* ``async_engine`` – the single process-wide async engine.
* ``AsyncSessionLocal`` – an ``async_sessionmaker`` bound to that engine.
* ``Base`` – declarative base for all ORM models.
* ``get_db()`` – FastAPI dependency that yields an ``AsyncSession``.
* ``init_db()`` – coroutine that creates all tables (dev convenience).
"""

from __future__ import annotations

from collections.abc import AsyncGenerator

from sqlalchemy.ext.asyncio import (
    AsyncSession,
    async_sessionmaker,
    create_async_engine,
)
from sqlalchemy.orm import declarative_base

from app.core.config import get_settings

settings = get_settings()

async_engine = create_async_engine(
    settings.DATABASE_URL,
    echo=settings.DEBUG,
    future=True,
)

AsyncSessionLocal = async_sessionmaker(
    bind=async_engine,
    class_=AsyncSession,
    expire_on_commit=False,
)

Base = declarative_base()


async def get_db() -> AsyncGenerator[AsyncSession, None]:
    """FastAPI dependency that provides an async database session.

    The session is automatically closed when the request finishes.
    """
    async with AsyncSessionLocal() as session:
        try:
            yield session
        finally:
            await session.close()


async def init_db() -> None:
    """Create all tables defined by ``Base.metadata``.

    Intended for development / first-run bootstrapping.  In production,
    prefer Alembic migrations.
    """
    async with async_engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
