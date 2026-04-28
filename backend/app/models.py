from datetime import datetime

from sqlalchemy import (
    Boolean,
    DateTime,
    Float,
    ForeignKey,
    Index,
    Integer,
    SmallInteger,
    String,
    Text,
    UniqueConstraint,
    func,
    text,
)
from sqlalchemy.orm import Mapped, mapped_column, relationship

from .database import Base


class Category(Base):
    __tablename__ = "categories"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    slug: Mapped[str] = mapped_column(String(100), unique=True, nullable=False, index=True) #URL'de kullanılan kısa ad, örn. savunma-sanayi. unique=True sayesinde aynı slug iki kez girilemiyor ve index=True — o sütun üzerinde arama hızlandırmak için indeks oluşturur (kitabın sonu indeksi gibi)
    
    name: Mapped[str] = mapped_column(String(255), nullable=False) #Kategori adı, örn. Savunma Sanayi

    articles: Mapped[list["Article"]] = relationship("Article", back_populates="category") #Bir kategoriye ait makaleleri almak için relationship oluşturur (back_populates="category" sayesinde Article sınıfında category sütunu oluşturulur) 
    # bu satır SQL sütunu değil, Python tarafında kolaylık: category.articles dersen o kategoriye ait tüm haberleri getirir


class Source(Base):
    __tablename__ = "sources"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    channel_id: Mapped[int] = mapped_column(Integer, unique=True, nullable=False, index=True)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    url: Mapped[str | None] = mapped_column(String(2048), nullable=True)
    enabled: Mapped[bool] = mapped_column(Boolean, nullable=False, default=True)
    # Hangi kategoriye ait olduğunu gösterir (SET NULL: kategori silinse de source korunur)
    category_id: Mapped[int | None] = mapped_column(
        Integer, ForeignKey("categories.id", ondelete="SET NULL"), nullable=True, index=True
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )

    articles: Mapped[list["Article"]] = relationship("Article", back_populates="source")
    category: Mapped["Category | None"] = relationship("Category", foreign_keys=[category_id])


class Article(Base):
    __tablename__ = "articles"
    __table_args__ = (UniqueConstraint("link", name="uq_articles_link"),) #tablo seviyesinde kısıtlamalar. UniqueConstraint("link") ile aynı URL'ye sahip iki haber girilemiyor (duplicate koruması). name="uq_articles_link" ile adlandırırız.

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    source_id: Mapped[int] = mapped_column( #source_id sütunu source tablosunun id sütununa bağlanır. ondelete="CASCADE" sayesinde source silindiğinde article da silinir.
        Integer, ForeignKey("sources.id", ondelete="CASCADE"), nullable=False, index=True
    )
    category_id: Mapped[int | None] = mapped_column( #category_id sütunu category tablosunun id sütununa bağlanır. ondelete="SET NULL" sayesinde category silindiğinde article da silinmez, category_id sütunu NULL olur.
        Integer, ForeignKey("categories.id", ondelete="SET NULL"), nullable=True, index=True
    )
    # Kimlik
    content_hash: Mapped[str | None] = mapped_column(String(64), nullable=True, index=True)
    rss_data_id: Mapped[str | None] = mapped_column(String(255), nullable=True, index=True)

    # İçerik
    title: Mapped[str] = mapped_column(String(1024), nullable=False)
    original_title: Mapped[str | None] = mapped_column(String(1024), nullable=True)
    is_ai_edited_title: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)
    content: Mapped[str | None] = mapped_column(Text, nullable=True)
    summary: Mapped[str | None] = mapped_column(Text, nullable=True)
    word_count: Mapped[int | None] = mapped_column(Integer, nullable=True)

    # Link & Görsel
    link: Mapped[str] = mapped_column(String(2048), nullable=False)
    source_domain: Mapped[str | None] = mapped_column(String(255), nullable=True)
    image_url: Mapped[str | None] = mapped_column(String(2048), nullable=True)
    image_width: Mapped[int | None] = mapped_column(SmallInteger, nullable=True)
    image_height: Mapped[int | None] = mapped_column(SmallInteger, nullable=True)

    # Zaman
    published_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )

    # Meta
    news_label_type: Mapped[str | None] = mapped_column(String(50), nullable=True)
    clickbait_status: Mapped[str | None] = mapped_column(String(50), nullable=True)

    source: Mapped["Source"] = relationship("Source", back_populates="articles")
    category: Mapped["Category | None"] = relationship("Category", back_populates="articles")


class ScrapeRun(Base):
    """Her pipeline çalışmasının kaydı.

    Pipeline, son SUCCESS run'ın started_at değerine bakarak
    incremental scraping için start_date belirler.
    """
    __tablename__ = "scrape_runs"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    started_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )
    finished_at: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True), nullable=True
    )
    status: Mapped[str] = mapped_column(
        String(20), nullable=False, default="RUNNING"  # RUNNING | SUCCESS | FAILED
    )
    total_fetched: Mapped[int] = mapped_column(Integer, default=0)
    total_inserted: Mapped[int] = mapped_column(Integer, default=0)
    total_skipped: Mapped[int] = mapped_column(Integer, default=0)
    total_errors: Mapped[int] = mapped_column(Integer, default=0)
    error_message: Mapped[str | None] = mapped_column(Text, nullable=True)
    categories_processed: Mapped[str | None] = mapped_column(Text, nullable=True)


class AnonymousUser(Base):
    __tablename__ = "anonymous_users"

    id: Mapped[str] = mapped_column(String(36), primary_key=True)  # UUID as varchar
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )
    last_seen: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )

    interactions: Mapped[list["Interaction"]] = relationship("Interaction", back_populates="user")
    recommendations: Mapped[list["Recommendation"]] = relationship("Recommendation", back_populates="user")


class Interaction(Base):
    __tablename__ = "interactions"
    __table_args__ = (
        # dwell_time hariç aynı user+article+type çifti tekrar girilemesin
        Index(
            "uq_interactions_non_dwell",
            "user_id", "article_id", "interaction_type",
            unique=True,
            postgresql_where=text("interaction_type != 'dwell_time'"),
        ),
    )

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    user_id: Mapped[str] = mapped_column(
        String(36), ForeignKey("anonymous_users.id", ondelete="CASCADE"), nullable=False, index=True
    )
    article_id: Mapped[int] = mapped_column(
        Integer, ForeignKey("articles.id", ondelete="CASCADE"), nullable=False, index=True
    )
    interaction_type: Mapped[str] = mapped_column(
        String(20), nullable=False
    )  # "view" | "save" | "like" | "dislike" | "dwell_time"
    dwell_time_ms: Mapped[int | None] = mapped_column(Integer, nullable=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), nullable=False, index=True
    )

    user: Mapped["AnonymousUser"] = relationship("AnonymousUser", back_populates="interactions")
    article: Mapped["Article"] = relationship("Article")


class Recommendation(Base):
    __tablename__ = "recommendations"
    __table_args__ = (
        UniqueConstraint("user_id", "article_id", name="uq_recommendations_user_article"),
    )

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    user_id: Mapped[str] = mapped_column(
        String(36), ForeignKey("anonymous_users.id", ondelete="CASCADE"), nullable=False, index=True
    )
    article_id: Mapped[int] = mapped_column(
        Integer, ForeignKey("articles.id", ondelete="CASCADE"), nullable=False, index=True
    )
    score: Mapped[float] = mapped_column(Float, nullable=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), nullable=False, index=True
    )

    user: Mapped["AnonymousUser"] = relationship("AnonymousUser", back_populates="recommendations")
    article: Mapped["Article"] = relationship("Article")
