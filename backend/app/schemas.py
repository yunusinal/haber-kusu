from datetime import datetime
from typing import Literal

from pydantic import BaseModel, ConfigDict


class CategoryOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    slug: str
    name: str


class SourceOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    channel_id: int
    name: str
    url: str | None
    enabled: bool
    created_at: datetime


class ArticleOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    title: str
    content: str | None
    summary: str | None
    link: str
    image_url: str | None
    published_at: datetime | None
    created_at: datetime
    source: SourceOut
    category: CategoryOut | None


class PaginatedArticles(BaseModel):
    total: int
    page: int
    page_size: int
    items: list[ArticleOut]


# ── Anonymous User ────────────────────────────────────────────────

class AnonymousUserIn(BaseModel):
    user_id: str


class AnonymousUserOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    created_at: datetime
    last_seen: datetime


# ── Interactions ──────────────────────────────────────────────────

InteractionType = Literal["view", "save", "like", "dislike", "dwell_time"]


class InteractionIn(BaseModel):
    user_id: str
    article_id: int
    interaction_type: InteractionType
    dwell_time_ms: int | None = None


class InteractionOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    user_id: str
    article_id: int
    interaction_type: str
    dwell_time_ms: int | None
    created_at: datetime


# ── Recommendations ───────────────────────────────────────────────

class RecommendedArticle(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    title: str
    content: str | None
    summary: str | None
    link: str
    image_url: str | None
    published_at: datetime | None
    created_at: datetime
    source: SourceOut
    category: CategoryOut | None
    score: float
