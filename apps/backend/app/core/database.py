# ═══════════════════════════════════════════════════════════════
#  VengaiCode — Database Core
#  core/database.py — SQLAlchemy async engine, session, base
# ═══════════════════════════════════════════════════════════════

from typing import AsyncGenerator

from sqlalchemy.ext.asyncio import (
    AsyncSession, async_sessionmaker, create_async_engine
)
from sqlalchemy.orm import declarative_base

from app.config import settings

# ───────────────────────────────────────────────
#  Declarative Base — all models inherit from this
# ───────────────────────────────────────────────
Base = declarative_base()

# ───────────────────────────────────────────────
#  Async Engine
# ───────────────────────────────────────────────
engine = create_async_engine(
    settings.database_url_async,
    echo=settings.DATABASE_ECHO,
    pool_size=settings.DATABASE_POOL_SIZE,
    max_overflow=settings.DATABASE_MAX_OVERFLOW,
    pool_timeout=settings.DATABASE_POOL_TIMEOUT,
    pool_pre_ping=True,  # Verify connections before using — avoids stale connections
)

# ───────────────────────────────────────────────
#  Session Factory
# ───────────────────────────────────────────────
AsyncSessionLocal = async_sessionmaker(
    bind=engine,
    class_=AsyncSession,
    expire_on_commit=False,
    autoflush=False,
)


# ───────────────────────────────────────────────
#  Dependency — get_db
#  Use in route handlers: db: AsyncSession = Depends(get_db)
# ───────────────────────────────────────────────
async def get_db() -> AsyncGenerator[AsyncSession, None]:
    async with AsyncSessionLocal() as session:
        try:
            yield session
        except Exception:
            await session.rollback()
            raise
        finally:
            await session.close()
