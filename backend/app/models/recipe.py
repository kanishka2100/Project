"""SQLAlchemy 2.0 ORM models for recipes, ingredients, and preparation steps.

These models use the modern ``Mapped[]`` / ``mapped_column()`` declarative
style introduced in SQLAlchemy 2.0.
"""

from __future__ import annotations

from datetime import datetime
from typing import Optional

from sqlalchemy import DateTime, Float, ForeignKey, Integer, String, Text, Boolean, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base


class Recipe(Base):
    """Core recipe entity – stores metadata, costing, and nutritional info."""

    __tablename__ = "recipes"

    id: Mapped[str] = mapped_column(String(64), primary_key=True)
    title: Mapped[str] = mapped_column(String(256), nullable=False)
    category: Mapped[str] = mapped_column(String(128), nullable=False)
    tagline: Mapped[Optional[str]] = mapped_column(String(512), nullable=True)
    image_url: Mapped[Optional[str]] = mapped_column(String(512), nullable=True)
    prep_time: Mapped[Optional[str]] = mapped_column(String(64), nullable=True)
    cook_time: Mapped[Optional[str]] = mapped_column(String(64), nullable=True)
    difficulty: Mapped[Optional[str]] = mapped_column(String(32), nullable=True)
    base_portion_persons: Mapped[int] = mapped_column(Integer, default=1)
    base_cost_per_person: Mapped[float] = mapped_column(Float, default=0.0)
    suggested_retail_price: Mapped[float] = mapped_column(Float, default=0.0)
    base_calories: Mapped[int] = mapped_column(Integer, default=0)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now()
    )

    # ── Relationships ────────────────────────────────────────────────────
    ingredients: Mapped[list["Ingredient"]] = relationship(
        back_populates="recipe", cascade="all, delete-orphan", lazy="selectin"
    )
    steps: Mapped[list["RecipeStep"]] = relationship(
        back_populates="recipe", cascade="all, delete-orphan", lazy="selectin"
    )

    def __repr__(self) -> str:
        return f"<Recipe id={self.id!r} title={self.title!r}>"


class Ingredient(Base):
    """Single ingredient entry belonging to a :class:`Recipe`."""

    __tablename__ = "ingredients"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    recipe_id: Mapped[str] = mapped_column(
        String(64), ForeignKey("recipes.id", ondelete="CASCADE"), nullable=False
    )
    name: Mapped[str] = mapped_column(String(256), nullable=False)
    quantity_per_person: Mapped[float] = mapped_column(Float, default=0.0)
    unit: Mapped[Optional[str]] = mapped_column(String(32), nullable=True)
    cost: Mapped[float] = mapped_column(Float, default=0.0)
    category: Mapped[Optional[str]] = mapped_column(String(128), nullable=True)
    is_replaceable: Mapped[bool] = mapped_column(Boolean, default=False)
    replaceable_type: Mapped[Optional[str]] = mapped_column(String(128), nullable=True)

    # ── Relationships ────────────────────────────────────────────────────
    recipe: Mapped["Recipe"] = relationship(back_populates="ingredients")

    def __repr__(self) -> str:
        return f"<Ingredient id={self.id} name={self.name!r}>"


class RecipeStep(Base):
    """Ordered preparation step within a :class:`Recipe`."""

    __tablename__ = "recipe_steps"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    recipe_id: Mapped[str] = mapped_column(
        String(64), ForeignKey("recipes.id", ondelete="CASCADE"), nullable=False
    )
    step_number: Mapped[int] = mapped_column(Integer, nullable=False)
    instruction: Mapped[str] = mapped_column(Text, nullable=False)

    # ── Relationships ────────────────────────────────────────────────────
    recipe: Mapped["Recipe"] = relationship(back_populates="steps")

    def __repr__(self) -> str:
        return f"<RecipeStep recipe_id={self.recipe_id!r} step={self.step_number}>"
