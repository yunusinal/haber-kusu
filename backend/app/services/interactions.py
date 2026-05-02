from sqlalchemy import text
from sqlalchemy.dialects.postgresql import insert as pg_insert
from sqlalchemy.ext.asyncio import AsyncSession

from ..models import Interaction
from ..schemas import InteractionIn


class InteractionService:
    def __init__(self, db: AsyncSession) -> None:
        self.db = db

    async def log(self, data: InteractionIn) -> Interaction:
        if data.interaction_type == "dwell_time":
            # dwell_time satırları additive — her ölçüm ayrı satır
            interaction = Interaction(
                user_id=data.user_id,
                article_id=data.article_id,
                interaction_type=data.interaction_type,
                dwell_time_ms=data.dwell_time_ms,
            )
            self.db.add(interaction)
            await self.db.commit()
            await self.db.refresh(interaction)
            return interaction

        # Diğer tipler: partial unique index'e göre upsert
        stmt = (
            pg_insert(Interaction)
            .values(
                user_id=data.user_id,
                article_id=data.article_id,
                interaction_type=data.interaction_type,
                dwell_time_ms=data.dwell_time_ms,
            )
            .on_conflict_do_update(
                index_elements=["user_id", "article_id", "interaction_type"],
                index_where=text("interaction_type != 'dwell_time'"),
                set_={"dwell_time_ms": data.dwell_time_ms},
            )
            .returning(Interaction)
        )
        result = await self.db.execute(stmt)
        await self.db.commit()
        return result.scalar_one()
