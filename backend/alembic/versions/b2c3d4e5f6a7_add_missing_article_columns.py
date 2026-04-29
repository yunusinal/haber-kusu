"""add missing article columns

Revision ID: b2c3d4e5f6a7
Revises: 1df78712d57d
Create Date: 2026-05-19 17:00:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'b2c3d4e5f6a7'
down_revision: Union[str, None] = '1df78712d57d'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column('articles', sa.Column('content_hash', sa.String(length=64), nullable=True))
    op.add_column('articles', sa.Column('original_title', sa.String(length=1024), nullable=True))
    op.add_column('articles', sa.Column('is_ai_edited_title', sa.Boolean(), nullable=False, server_default='false'))
    op.add_column('articles', sa.Column('word_count', sa.Integer(), nullable=True))
    op.add_column('articles', sa.Column('source_domain', sa.String(length=255), nullable=True))
    op.add_column('articles', sa.Column('image_width', sa.SmallInteger(), nullable=True))
    op.add_column('articles', sa.Column('image_height', sa.SmallInteger(), nullable=True))
    op.add_column('articles', sa.Column('news_label_type', sa.String(length=50), nullable=True))
    op.add_column('articles', sa.Column('clickbait_status', sa.String(length=50), nullable=True))

    op.create_index('ix_articles_content_hash', 'articles', ['content_hash'], unique=False)


def downgrade() -> None:
    op.drop_index('ix_articles_content_hash', table_name='articles')

    op.drop_column('articles', 'clickbait_status')
    op.drop_column('articles', 'news_label_type')
    op.drop_column('articles', 'image_height')
    op.drop_column('articles', 'image_width')
    op.drop_column('articles', 'source_domain')
    op.drop_column('articles', 'word_count')
    op.drop_column('articles', 'is_ai_edited_title')
    op.drop_column('articles', 'original_title')
    op.drop_column('articles', 'content_hash')
