"""add recommendation tables

Revision ID: c3d4e5f6a7b8
Revises: b2c3d4e5f6a7
Create Date: 2026-05-26 00:00:00.000000

"""
from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op

revision: str = "c3d4e5f6a7b8"
down_revision: Union[str, None] = "b2c3d4e5f6a7"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        "anonymous_users",
        sa.Column("id", sa.String(36), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.Column("last_seen", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.PrimaryKeyConstraint("id"),
    )

    op.create_table(
        "interactions",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("user_id", sa.String(36), nullable=False),
        sa.Column("article_id", sa.Integer(), nullable=False),
        sa.Column("interaction_type", sa.String(20), nullable=False),
        sa.Column("dwell_time_ms", sa.Integer(), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.ForeignKeyConstraint(["user_id"], ["anonymous_users.id"], ondelete="CASCADE"),
        sa.ForeignKeyConstraint(["article_id"], ["articles.id"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index("ix_interactions_id", "interactions", ["id"], unique=False)
    op.create_index("ix_interactions_user_id", "interactions", ["user_id"], unique=False)
    op.create_index("ix_interactions_article_id", "interactions", ["article_id"], unique=False)
    op.create_index("ix_interactions_created_at", "interactions", ["created_at"], unique=False)
    # Partial unique index: dwell_time hariç aynı user+article+type girilemesin
    op.create_index(
        "uq_interactions_non_dwell",
        "interactions",
        ["user_id", "article_id", "interaction_type"],
        unique=True,
        postgresql_where=sa.text("interaction_type != 'dwell_time'"),
    )

    op.create_table(
        "recommendations",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("user_id", sa.String(36), nullable=False),
        sa.Column("article_id", sa.Integer(), nullable=False),
        sa.Column("score", sa.Float(), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.ForeignKeyConstraint(["user_id"], ["anonymous_users.id"], ondelete="CASCADE"),
        sa.ForeignKeyConstraint(["article_id"], ["articles.id"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("user_id", "article_id", name="uq_recommendations_user_article"),
    )
    op.create_index("ix_recommendations_id", "recommendations", ["id"], unique=False)
    op.create_index("ix_recommendations_user_id", "recommendations", ["user_id"], unique=False)
    op.create_index("ix_recommendations_created_at", "recommendations", ["created_at"], unique=False)


def downgrade() -> None:
    op.drop_index("ix_recommendations_created_at", table_name="recommendations")
    op.drop_index("ix_recommendations_user_id", table_name="recommendations")
    op.drop_index("ix_recommendations_id", table_name="recommendations")
    op.drop_table("recommendations")

    op.drop_index("uq_interactions_non_dwell", table_name="interactions")
    op.drop_index("ix_interactions_created_at", table_name="interactions")
    op.drop_index("ix_interactions_article_id", table_name="interactions")
    op.drop_index("ix_interactions_user_id", table_name="interactions")
    op.drop_index("ix_interactions_id", table_name="interactions")
    op.drop_table("interactions")

    op.drop_table("anonymous_users")
