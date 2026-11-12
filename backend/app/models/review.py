"""SQLAlchemy 2.0 ORM model for Human Taste Validation (HTV) reviews."""

from __future__ import annotations

import uuid
from datetime import datetime
from typing import Any, Optional

from sqlalchemy import Boolean, DateTime, Float, ForeignKey, Integer, JSON, String, Text, func
from sqlalchemy.orm import Mapped, mapped_column

from app.core.database import Base


def _generate_uuid() -> str:
    """Return a new UUID4 hex string for use as a primary key."""
    return uuid.uuid4().hex


class HtvReview(Base):
    """A single taste-validation review submitted by kitchen staff.

    Stores the raw review alongside computed AI metrics such as
    aspect-level sentiments and a Bayesian trust score.
    """

    __tablename__ = "htv_reviews"

    id: Mapped[str] = mapped_column(
        String(64), primary_key=True, default=_generate_uuid
    )
    recipe_id: Mapped[str] = mapped_column(
        String(64), ForeignKey("recipes.id", ondelete="CASCADE"), nullable=False
    )
    author_name: Mapped[str] = mapped_column(String(256), nullable=False)
    kitchen_name: Mapped[Optional[str]] = mapped_column(String(256), nullable=True)
    review_text: Mapped[str] = mapped_column(Text, nullable=False)
    raw_rating: Mapped[int] = mapped_column(Integer, nullable=False)
    aspect_sentiments: Mapped[Optional[dict[str, Any]]] = mapped_column(
        JSON, nullable=True
    )
    bayesian_trust_score: Mapped[float] = mapped_column(Float, default=0.0)
    validation_badge: Mapped[Optional[str]] = mapped_column(String(64), nullable=True)
    is_authentic: Mapped[bool] = mapped_column(Boolean, default=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )

    def __repr__(self) -> str:
        return (
            f"<HtvReview id={self.id!r} recipe_id={self.recipe_id!r} "
            f"rating={self.raw_rating}>"
        )
