from __future__ import annotations

from datetime import datetime, timedelta, timezone

from sqlalchemy import func, select, text
from sqlalchemy.dialects.postgresql import insert as pg_insert
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from ..models import Article, Interaction, Recommendation

# ── Ağırlık sabitleri ─────────────────────────────────────────────
INTERACTION_WEIGHTS: dict[str, float] = {
    "view": 1.0,
    "save": 3.0,
    "like": 4.0,
    "dislike": -5.0,
    "dwell_time": 0.0,  # ms üzerinden ayrı hesaplanır
}
DWELL_WEIGHT_PER_30S = 1.0   # 30 saniye başına 1 puan
RECENCY_BOOST = 1.5           # 24 saatten yeni makaleler için çarpan
COLD_START_WINDOW_DAYS = 7
CANDIDATE_POOL = 200
TOP_N = 20


class RecommendationService:
    def __init__(self, db: AsyncSession) -> None:
        self.db = db

    async def get_recommendations(
        self, user_id: str, page: int = 1, page_size: int = TOP_N
    ) -> list[dict]:
        rows = await self._load_interactions_with_categories(user_id)

        if not rows:
            return await self._cold_start(page=page, page_size=page_size)

        # Kategori ağırlıkları ve görülmüş makale ID'leri
        raw: dict[int, float] = {}
        viewed_ids: set[int] = set()

        for interaction, cat_id in rows:
            if interaction.interaction_type == "view":
                viewed_ids.add(interaction.article_id)
            if cat_id is None:
                continue
            if interaction.interaction_type == "dwell_time" and interaction.dwell_time_ms:
                w = (interaction.dwell_time_ms / 30_000) * DWELL_WEIGHT_PER_30S
            else:
                w = INTERACTION_WEIGHTS.get(interaction.interaction_type, 0.0)
            raw[cat_id] = raw.get(cat_id, 0.0) + w

        total_weight = sum(v for v in raw.values() if v > 0)
        category_weights = (
            {cid: w / total_weight for cid, w in raw.items() if w > 0}
            if total_weight > 0
            else {}
        )

        candidates = await self._fetch_candidates(exclude_ids=viewed_ids)
        scored = self._score_candidates(candidates, category_weights)
        scored.sort(key=lambda x: x["score"], reverse=True)

        await self._persist_scores(user_id, scored[:TOP_N])

        offset = (page - 1) * page_size
        return scored[offset : offset + page_size]

    async def _load_interactions_with_categories(
        self, user_id: str
    ) -> list[tuple[Interaction, int | None]]:
        stmt = (
            select(Interaction, Article.category_id)
            .join(Article, Interaction.article_id == Article.id)
            .where(Interaction.user_id == user_id)
        )
        rows = (await self.db.execute(stmt)).all()
        return [(row[0], row[1]) for row in rows]

    def _score_candidates(
        self,
        candidates: list[Article],
        category_weights: dict[int, float],
    ) -> list[dict]:
        now = datetime.now(timezone.utc)
        scored = []

        for article in candidates:
            cat_weight = category_weights.get(article.category_id or 0, 0.0)

            pub = article.published_at
            if pub is not None:
                if pub.tzinfo is None:
                    pub = pub.replace(tzinfo=timezone.utc)
                age_hours = (now - pub).total_seconds() / 3600
                recency_factor = RECENCY_BOOST if age_hours < 24 else 1.0
            else:
                recency_factor = 1.0

            score = cat_weight * recency_factor

            scored.append({
                "id": article.id,
                "title": article.title,
                "content": article.content,
                "summary": article.summary,
                "link": article.link,
                "image_url": article.image_url,
                "published_at": article.published_at,
                "created_at": article.created_at,
                "source": article.source,
                "category": article.category,
                "score": score,
            })

        return scored

    async def _fetch_candidates(self, exclude_ids: set[int]) -> list[Article]:
        stmt = (
            select(Article)
            .options(
                selectinload(Article.source),
                selectinload(Article.category),
            )
            .order_by(Article.published_at.desc().nullslast())
            .limit(CANDIDATE_POOL)
        )
        result = await self.db.execute(stmt)
        all_articles = list(result.scalars().all())

        if exclude_ids:
            return [a for a in all_articles if a.id not in exclude_ids]
        return all_articles

    async def _cold_start(self, page: int, page_size: int) -> list[dict]:
        cutoff = datetime.now(timezone.utc) - timedelta(days=COLD_START_WINDOW_DAYS)

        popularity_sub = (
            select(
                Interaction.article_id,
                func.count(Interaction.id).label("interaction_count"),
            )
            .where(Interaction.created_at >= cutoff)
            .where(Interaction.interaction_type.in_(["view", "save", "like"]))
            .group_by(Interaction.article_id)
            .subquery()
        )

        stmt = (
            select(Article, func.coalesce(popularity_sub.c.interaction_count, 0).label("pop"))
            .options(
                selectinload(Article.source),
                selectinload(Article.category),
            )
            .outerjoin(popularity_sub, Article.id == popularity_sub.c.article_id)
            .order_by(
                text("pop DESC"),
                Article.published_at.desc().nullslast(),
            )
            .limit(CANDIDATE_POOL)
        )

        rows = (await self.db.execute(stmt)).all()
        now = datetime.now(timezone.utc)

        scored = []
        for article, pop in rows:
            pub = article.published_at
            if pub is not None and pub.tzinfo is None:
                pub = pub.replace(tzinfo=timezone.utc)
            age_hours = (now - pub).total_seconds() / 3600 if pub else 999
            recency_factor = RECENCY_BOOST if age_hours < 24 else 1.0
            score = float(pop) * recency_factor

            scored.append({
                "id": article.id,
                "title": article.title,
                "content": article.content,
                "summary": article.summary,
                "link": article.link,
                "image_url": article.image_url,
                "published_at": article.published_at,
                "created_at": article.created_at,
                "source": article.source,
                "category": article.category,
                "score": score,
            })

        offset = (page - 1) * page_size
        return scored[offset : offset + page_size]

    async def _persist_scores(self, user_id: str, scored: list[dict]) -> None:
        if not scored:
            return

        values = [
            {
                "user_id": user_id,
                "article_id": item["id"],
                "score": item["score"],
            }
            for item in scored
        ]

        stmt = (
            pg_insert(Recommendation)
            .values(values)
            .on_conflict_do_update(
                constraint="uq_recommendations_user_article",
                set_={"score": pg_insert(Recommendation).excluded.score},
            )
        )
        await self.db.execute(stmt)
        await self.db.commit()
