"""add category_id to sources

Revision ID: a1b2c3d4e5f6
Revises: dd148474b3ac
Create Date: 2026-05-18 21:00:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'a1b2c3d4e5f6'
down_revision: Union[str, None] = 'dd148474b3ac'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # sources tablosuna category_id sütunu ekle
    op.add_column(
        'sources',
        sa.Column('category_id', sa.Integer(), nullable=True)
    )
    op.create_foreign_key(
        'fk_sources_category_id',   # constraint adı
        'sources',                   # kaynak tablo
        'categories',                # hedef tablo
        ['category_id'],             # kaynak sütun
        ['id'],                      # hedef sütun
        ondelete='SET NULL',
    )
    op.create_index(
        op.f('ix_sources_category_id'), 'sources', ['category_id'], unique=False
    )


def downgrade() -> None:
    op.drop_index(op.f('ix_sources_category_id'), table_name='sources')
    op.drop_constraint('fk_sources_category_id', 'sources', type_='foreignkey')
    op.drop_column('sources', 'category_id')
