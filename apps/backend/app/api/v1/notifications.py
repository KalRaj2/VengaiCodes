# ═══════════════════════════════════════════════════════════════
#  VengaiCode — Notifications API Routes
#  api/v1/notifications.py — Minimal notification list/read endpoints
# ═══════════════════════════════════════════════════════════════

from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.v1.auth import get_current_active_user
from app.core.database import get_db
from app.models.user import User

router = APIRouter()


@router.get(
    "",
    summary="List notifications for current user",
)
async def list_notifications(
    user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db),
):
    """
    Returns notifications for the current user.
    Minimal placeholder — no Notification model exists yet
    (Sprint 8+ feature). Returns empty list so the frontend's
    notification bell renders cleanly instead of hitting a 404.
    """
    return {
        "success": True,
        "notifications": [],
        "unread_count": 0,
    }


@router.post(
    "/{notification_id}/read",
    summary="Mark a notification as read",
)
async def mark_notification_read(
    notification_id: str,
    user: User = Depends(get_current_active_user),
):
    """Marks a notification as read. Placeholder no-op."""
    return {"success": True, "notification_id": notification_id, "is_read": True}
