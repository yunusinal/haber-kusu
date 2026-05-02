from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from ..database import get_db
from ..schemas import InteractionIn, InteractionOut
from ..services.interactions import InteractionService
from ..services.users import UserService

router = APIRouter(prefix="/interactions", tags=["interactions"])


@router.post("", response_model=InteractionOut, status_code=201)
async def log_interaction(
    body: InteractionIn,
    db: AsyncSession = Depends(get_db),
) -> InteractionOut:
    # FK ihlali önlemek için kullanıcıyı talep üzerine oluştur
    user_svc = UserService(db)
    await user_svc.get_or_create(body.user_id)

    svc = InteractionService(db)
    return await svc.log(body)
