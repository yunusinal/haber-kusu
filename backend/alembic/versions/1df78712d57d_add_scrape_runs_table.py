"""add_scrape_runs_table

Revision ID: 1df78712d57d
Revises: a1b2c3d4e5f6
Create Date: 2026-05-19 15:13:57.826958

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '1df78712d57d'
down_revision: Union[str, None] = 'a1b2c3d4e5f6'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table('scrape_runs',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('started_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
    sa.Column('finished_at', sa.DateTime(timezone=True), nullable=True),
    sa.Column('status', sa.String(length=20), nullable=False),
    sa.Column('total_fetched', sa.Integer(), nullable=False),
    sa.Column('total_inserted', sa.Integer(), nullable=False),
    sa.Column('total_skipped', sa.Integer(), nullable=False),
    sa.Column('total_errors', sa.Integer(), nullable=False),
    sa.Column('error_message', sa.Text(), nullable=True),
    sa.Column('categories_processed', sa.Text(), nullable=True),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_scrape_runs_id'), 'scrape_runs', ['id'], unique=False)


def downgrade() -> None:
    op.drop_index(op.f('ix_scrape_runs_id'), table_name='scrape_runs')
    op.drop_table('scrape_runs')
