from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession

from ..database import get_db
from ..schemas import RecommendedArticle
from ..services.recommendations import RecommendationService
from ..services.users import UserService

router = APIRouter(prefix="/recommendations", tags=["recommendations"])


@router.get("", response_model=list[RecommendedArticle])
async def get_recommendations(
    user_id: str = Query(..., description="Anonim kullanıcı UUID"),
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=50),
    db: AsyncSession = Depends(get_db),
) -> list[RecommendedArticle]:
    user_svc = UserService(db)
    await user_svc.get_or_create(user_id)

    svc = RecommendationService(db)
    results = await svc.get_recommendations(user_id=user_id, page=page, page_size=page_size)
    return [RecommendedArticle.model_validate(r) for r in results]
