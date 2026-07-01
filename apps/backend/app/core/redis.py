# ═══════════════════════════════════════════════════════════════
#  VengaiCode — Redis Core
#  core/redis.py — Async Redis client for caching, OTP storage,
#  rate limiting, and licence verification caching
# ═══════════════════════════════════════════════════════════════

import json
import logging
from typing import Any, Optional

import redis.asyncio as aioredis

from app.config import settings

logger = logging.getLogger("vengaicode.redis")


# ───────────────────────────────────────────────
#  Redis Client — Singleton
# ───────────────────────────────────────────────
def _build_redis_client() -> aioredis.Redis:
    """
    Build the Redis client.
    Prefers Upstash (production) if configured, falls back to
    local docker-compose Redis (development).
    """
    if settings.UPSTASH_REDIS_URL and settings.UPSTASH_REDIS_TOKEN:
        # Upstash REST-compatible Redis URL — production
        return aioredis.from_url(
            settings.UPSTASH_REDIS_URL,
            password=settings.UPSTASH_REDIS_TOKEN,
            decode_responses=True,
            max_connections=settings.REDIS_MAX_CONNECTIONS,
        )

    # Local development Redis (docker-compose)
    return aioredis.from_url(
        settings.REDIS_URL,
        decode_responses=True,
        max_connections=settings.REDIS_MAX_CONNECTIONS,
    )


redis_client: aioredis.Redis = _build_redis_client()


# ───────────────────────────────────────────────
#  JSON Helpers — get/set Python objects directly
# ───────────────────────────────────────────────
async def cache_get_json(key: str) -> Optional[Any]:
    """Get a JSON value from cache, returns None if missing or invalid."""
    try:
        raw = await redis_client.get(key)
        if raw is None:
            return None
        return json.loads(raw)
    except Exception as e:
        logger.warning(f"Redis cache_get_json failed for key={key}: {e}")
        return None


async def cache_set_json(key: str, value: Any, ttl_seconds: int) -> bool:
    """Set a JSON value in cache with TTL. Returns True on success."""
    try:
        await redis_client.set(key, json.dumps(value, default=str), ex=ttl_seconds)
        return True
    except Exception as e:
        logger.warning(f"Redis cache_set_json failed for key={key}: {e}")
        return False


async def cache_delete(key: str) -> bool:
    """Delete a key from cache."""
    try:
        await redis_client.delete(key)
        return True
    except Exception as e:
        logger.warning(f"Redis cache_delete failed for key={key}: {e}")
        return False


# ───────────────────────────────────────────────
#  OTP Storage Helpers
#  Used by otp.py — stores OTP attempt counters and lockouts
# ───────────────────────────────────────────────
def otp_attempts_key(target: str, purpose: str) -> str:
    return f"otp:attempts:{purpose}:{target}"


def otp_resend_lock_key(target: str, purpose: str) -> str:
    return f"otp:resend_lock:{purpose}:{target}"


async def is_otp_resend_locked(target: str, purpose: str) -> bool:
    """Check if user must wait before requesting another OTP."""
    key = otp_resend_lock_key(target, purpose)
    try:
        return bool(await redis_client.exists(key))
    except Exception:
        return False  # Redis down — allow resend


async def set_otp_resend_lock(target: str, purpose: str, seconds: int = 60) -> None:
    """Lock OTP resend for N seconds (default 60s between resends)."""
    key = otp_resend_lock_key(target, purpose)
    try:
        await redis_client.set(key, "1", ex=seconds)
    except Exception:
        pass  # Redis down — skip lock, no harm


async def increment_otp_attempts(target: str, purpose: str, ttl_seconds: int) -> int:
    """Increment and return OTP verification attempt count."""
    key = otp_attempts_key(target, purpose)
    try:
        attempts = await redis_client.incr(key)
        if attempts == 1:
            await redis_client.expire(key, ttl_seconds)
        return attempts
    except Exception:
        return 1  # Redis down — treat as first attempt


async def reset_otp_attempts(target: str, purpose: str) -> None:
    """Reset OTP attempt counter after successful verification."""
    key = otp_attempts_key(target, purpose)
    try:
        await redis_client.delete(key)
    except Exception:
        pass  # Redis down — nothing to reset


# ───────────────────────────────────────────────
#  Rate Limiting Helpers
#  Used by middleware/rate_limit.py
# ───────────────────────────────────────────────
async def rate_limit_check(
    identifier: str, max_calls: int, period_seconds: int
) -> tuple[bool, int]:
    """
    Sliding-window rate limit check using Redis INCR + EXPIRE.

    Returns (allowed: bool, remaining: int).
    """
    key = f"ratelimit:{identifier}"
    try:
        current = await redis_client.incr(key)
        if current == 1:
            await redis_client.expire(key, period_seconds)

        if current > max_calls:
            return False, 0

        return True, max_calls - current
    except Exception as e:
        logger.debug(f"Rate limit check failed for {identifier}: {e}")
        # Fail open — don't block requests if Redis is down
        return True, max_calls


# ───────────────────────────────────────────────
#  Session Token Blocklist (for logout)
# ───────────────────────────────────────────────
async def blocklist_token(token: str, ttl_seconds: int) -> None:
    try:
        await redis_client.set(f"blocklist:{token}", "1", ex=ttl_seconds)
    except Exception:
        pass  # Redis down — skip blocklisting, token expires naturally


async def is_token_blocklisted(token_jti: str) -> bool:
    try:
        return bool(await redis_client.exists(f"blocklist:{token_jti}"))
    except Exception:
        return False  # Redis down — treat token as valid, fail open


# ───────────────────────────────────────────────
#  Licence Verification Cache
#  Used by core/licence_engine.py
# ───────────────────────────────────────────────
async def cache_licence_status(licence_key: str, status: dict) -> None:
    """Cache licence verification result to reduce DB load on every app launch."""
    await cache_set_json(
        f"licence:{licence_key}", status, ttl_seconds=settings.CACHE_TTL_LICENCE
    )


async def get_cached_licence_status(licence_key: str) -> Optional[dict]:
    """Get cached licence verification result."""
    return await cache_get_json(f"licence:{licence_key}")
