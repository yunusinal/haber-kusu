from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession

from ..database import get_db
from ..schemas import ArticleOut, PaginatedArticles
from ..services.articles import ArticleService

router = APIRouter(prefix="/articles", tags=["articles"])


@router.get("/search", response_model=PaginatedArticles)
async def search_articles(
    q: str = Query(..., min_length=2, description="Arama terimi"),
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    db: AsyncSession = Depends(get_db),
) -> PaginatedArticles:
    svc = ArticleService(db)
    items, total = await svc.search_articles(q=q, page=page, page_size=page_size)
    return PaginatedArticles(total=total, page=page, page_size=page_size, items=items)


@router.get("", response_model=PaginatedArticles)
async def list_articles(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    category: str | None = Query(None, description="Kategori slug'ı ile filtrele"),
    db: AsyncSession = Depends(get_db),
) -> PaginatedArticles:
    svc = ArticleService(db)
    items, total = await svc.list_articles(
        page=page, page_size=page_size, category_slug=category
    )
    return PaginatedArticles(total=total, page=page, page_size=page_size, items=items)


@router.get("/{article_id}", response_model=ArticleOut)
async def get_article(
    article_id: int,
    db: AsyncSession = Depends(get_db),
) -> ArticleOut:
    svc = ArticleService(db)
    return await svc.get_article(article_id)
