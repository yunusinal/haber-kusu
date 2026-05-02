from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from ..database import get_db
from ..schemas import AnonymousUserIn, AnonymousUserOut
from ..services.users import UserService

router = APIRouter(prefix="/users", tags=["users"])


@router.post("/anonymous", response_model=AnonymousUserOut, status_code=200)
async def get_or_create_anonymous_user(
    body: AnonymousUserIn,
    db: AsyncSession = Depends(get_db),
) -> AnonymousUserOut:
    svc = UserService(db)
    return await svc.get_or_create(body.user_id)
