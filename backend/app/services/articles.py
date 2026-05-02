from sqlalchemy import func, or_, select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from ..exceptions import NotFoundError
from ..models import Article, Category


class ArticleService:
    def __init__(self, db: AsyncSession) -> None:
        self.db = db

    async def list_articles(
        self,
        page: int = 1,
        page_size: int = 20,
        category_slug: str | None = None,
    ) -> tuple[list[Article], int]:
        base = select(Article).options(
            selectinload(Article.source),
            selectinload(Article.category),
        )
        count_base = select(func.count()).select_from(Article)

        if category_slug:
            base = base.join(Article.category).where(Category.slug == category_slug)
            count_base = count_base.join(Article.category).where(
                Category.slug == category_slug
            )

        base = base.order_by(Article.published_at.desc().nullslast())

        total: int = (await self.db.execute(count_base)).scalar_one()
        offset = (page - 1) * page_size
        items = (
            await self.db.execute(base.offset(offset).limit(page_size))
        ).scalars().all()

        return list(items), total

    async def get_article(self, article_id: int) -> Article:
        result = await self.db.execute(
            select(Article)
            .options(
                selectinload(Article.source),
                selectinload(Article.category),
            )
            .where(Article.id == article_id)
        )
        article = result.scalar_one_or_none()
        if article is None:
            raise NotFoundError(f"Article {article_id} not found")
        return article

    async def search_articles(
        self,
        q: str,
        page: int = 1,
        page_size: int = 20,
    ) -> tuple[list[Article], int]:
        search_filter = or_(
            Article.title.ilike(f"%{q}%"),
            Article.content.ilike(f"%{q}%"),
        )
        base = (
            select(Article)
            .options(
                selectinload(Article.source),
                selectinload(Article.category),
            )
            .where(search_filter)
            .order_by(Article.published_at.desc().nullslast())
        )
        count_base = select(func.count()).select_from(Article).where(search_filter)

        total: int = (await self.db.execute(count_base)).scalar_one()
        offset = (page - 1) * page_size
        items = (
            await self.db.execute(base.offset(offset).limit(page_size))
        ).scalars().all()

        return list(items), total
