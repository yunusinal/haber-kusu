from datetime import datetime, timezone

from sqlalchemy import select
from sqlalchemy.dialects.postgresql import insert as pg_insert
from sqlalchemy.ext.asyncio import AsyncSession

from ..models import AnonymousUser


class UserService:
    def __init__(self, db: AsyncSession) -> None:
        self.db = db

    async def get_or_create(self, user_id: str) -> AnonymousUser:
        stmt = (
            pg_insert(AnonymousUser)
            .values(id=user_id)
            .on_conflict_do_update(
                index_elements=["id"],
                set_={"last_seen": datetime.now(timezone.utc)},
            )
            .returning(AnonymousUser)
        )
        result = await self.db.execute(stmt)
        await self.db.commit()
        return result.scalar_one()
