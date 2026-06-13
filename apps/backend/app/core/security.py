# ═══════════════════════════════════════════════════════════════
#  VengaiCode — Security Core
#  core/security.py — JWT tokens, password hashing, RSA encryption
#  Used by: auth.py, licence_engine.py, stamp_system.py
# ═══════════════════════════════════════════════════════════════

import os
from datetime import datetime, timedelta, timezone
from typing import Optional, Tuple

from cryptography.hazmat.primitives import hashes, serialization
from cryptography.hazmat.primitives.asymmetric import padding, rsa
from jose import JWTError, jwt
from passlib.context import CryptContext

from app.config import settings
from app.schemas.auth import TokenData

# ───────────────────────────────────────────────
#  Password Hashing — Bcrypt
# ───────────────────────────────────────────────
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto", bcrypt__rounds=12)


def hash_password(password: str) -> str:
    """Hash a plain password using bcrypt."""
    return pwd_context.hash(password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a plain password against its hash."""
    return pwd_context.verify(plain_password, hashed_password)


# ───────────────────────────────────────────────
#  JWT Access & Refresh Tokens
# ───────────────────────────────────────────────
def create_access_token(
    user_id: str,
    username: str,
    email: str,
    tier: str,
    is_admin: bool = False,
    expires_delta: Optional[timedelta] = None,
) -> str:
    """Create a short-lived JWT access token."""
    if expires_delta is None:
        expires_delta = timedelta(minutes=settings.JWT_ACCESS_TOKEN_EXPIRE_MINUTES)

    expire = datetime.now(timezone.utc) + expires_delta
    to_encode = {
        "sub": user_id,
        "username": username,
        "email": email,
        "tier": tier,
        "is_admin": is_admin,
        "type": "access",
        "exp": expire,
        "iat": datetime.now(timezone.utc),
    }
    return jwt.encode(to_encode, settings.JWT_SECRET, algorithm=settings.JWT_ALGORITHM)


def create_refresh_token(
    user_id: str,
    expires_delta: Optional[timedelta] = None,
) -> str:
    """Create a long-lived JWT refresh token."""
    if expires_delta is None:
        expires_delta = timedelta(days=settings.JWT_REFRESH_TOKEN_EXPIRE_DAYS)

    expire = datetime.now(timezone.utc) + expires_delta
    to_encode = {
        "sub": user_id,
        "type": "refresh",
        "exp": expire,
        "iat": datetime.now(timezone.utc),
    }
    return jwt.encode(to_encode, settings.JWT_SECRET, algorithm=settings.JWT_ALGORITHM)


def create_token_pair(
    user_id: str,
    username: str,
    email: str,
    tier: str,
    is_admin: bool = False,
    remember_me: bool = False,
) -> Tuple[str, str, int]:
    """
    Create both access and refresh tokens.
    Returns (access_token, refresh_token, expires_in_seconds).
    """
    access_expires = timedelta(
        days=30 if remember_me else 0,
        minutes=0 if remember_me else settings.JWT_ACCESS_TOKEN_EXPIRE_MINUTES,
    )
    access_token = create_access_token(
        user_id, username, email, tier, is_admin, expires_delta=access_expires
    )
    refresh_token = create_refresh_token(user_id)
    expires_in = int(access_expires.total_seconds())
    return access_token, refresh_token, expires_in


def decode_token(token: str, expected_type: str = "access") -> TokenData:
    """
    Decode and validate a JWT token.
    Raises JWTError if invalid, expired, or wrong type.
    """
    try:
        payload = jwt.decode(
            token, settings.JWT_SECRET, algorithms=[settings.JWT_ALGORITHM]
        )
    except JWTError as e:
        raise JWTError(f"Invalid token: {e}")

    if payload.get("type") != expected_type:
        raise JWTError(f"Expected {expected_type} token, got {payload.get('type')}")

    return TokenData(
        user_id=payload["sub"],
        username=payload.get("username", ""),
        email=payload.get("email", ""),
        tier=payload.get("tier", "free"),
        is_admin=payload.get("is_admin", False),
        exp=datetime.fromtimestamp(payload["exp"], tz=timezone.utc),
    )


def decode_refresh_token(token: str) -> str:
    """Decode a refresh token and return the user_id (sub claim)."""
    try:
        payload = jwt.decode(
            token, settings.JWT_SECRET, algorithms=[settings.JWT_ALGORITHM]
        )
    except JWTError as e:
        raise JWTError(f"Invalid refresh token: {e}")

    if payload.get("type") != "refresh":
        raise JWTError("Token is not a refresh token")

    return payload["sub"]


# ───────────────────────────────────────────────
#  RSA Key Management — Licence System & Tiger Stamp 🐯
# ───────────────────────────────────────────────
_private_key_cache: Optional[rsa.RSAPrivateKey] = None
_public_key_cache: Optional[rsa.RSAPublicKey] = None


def _ensure_rsa_keys_exist() -> None:
    """Generate RSA key pair if it doesn't exist yet (first run)."""
    priv_path = settings.RSA_PRIVATE_KEY_PATH
    pub_path = settings.RSA_PUBLIC_KEY_PATH

    if os.path.exists(priv_path) and os.path.exists(pub_path):
        return

    os.makedirs(os.path.dirname(priv_path) or ".", exist_ok=True)

    private_key = rsa.generate_private_key(public_exponent=65537, key_size=2048)
    public_key = private_key.public_key()

    with open(priv_path, "wb") as f:
        f.write(
            private_key.private_bytes(
                encoding=serialization.Encoding.PEM,
                format=serialization.PrivateFormat.PKCS8,
                encryption_algorithm=serialization.NoEncryption(),
            )
        )

    with open(pub_path, "wb") as f:
        f.write(
            public_key.public_bytes(
                encoding=serialization.Encoding.PEM,
                format=serialization.PublicFormat.SubjectPublicKeyInfo,
            )
        )


def get_private_key() -> rsa.RSAPrivateKey:
    """Load (and cache) the RSA private key — used to SIGN licences/stamps."""
    global _private_key_cache
    if _private_key_cache is None:
        _ensure_rsa_keys_exist()
        with open(settings.RSA_PRIVATE_KEY_PATH, "rb") as f:
            _private_key_cache = serialization.load_pem_private_key(
                f.read(), password=None
            )
    return _private_key_cache


def get_public_key() -> rsa.RSAPublicKey:
    """Load (and cache) the RSA public key — used to VERIFY licences/stamps."""
    global _public_key_cache
    if _public_key_cache is None:
        _ensure_rsa_keys_exist()
        with open(settings.RSA_PUBLIC_KEY_PATH, "rb") as f:
            _public_key_cache = serialization.load_pem_public_key(f.read())
    return _public_key_cache


def rsa_sign(data: bytes) -> bytes:
    """Sign data with the VengaiCode private key (licence keys, Tiger stamps)."""
    private_key = get_private_key()
    return private_key.sign(
        data,
        padding.PSS(
            mgf=padding.MGF1(hashes.SHA256()),
            salt_length=padding.PSS.MAX_LENGTH,
        ),
        hashes.SHA256(),
    )


def rsa_verify(data: bytes, signature: bytes) -> bool:
    """Verify data was signed by VengaiCode's private key."""
    public_key = get_public_key()
    try:
        public_key.verify(
            signature,
            data,
            padding.PSS(
                mgf=padding.MGF1(hashes.SHA256()),
                salt_length=padding.PSS.MAX_LENGTH,
            ),
            hashes.SHA256(),
        )
        return True
    except Exception:
        return False


# ───────────────────────────────────────────────
#  Server Health Check
# ───────────────────────────────────────────────
def verify_server_health() -> dict:
    """Quick self-check of security subsystem — used at startup."""
    health = {"jwt": False, "rsa": False, "bcrypt": False}

    try:
        token = create_access_token("test", "test", "test@test.com", "free")
        decode_token(token)
        health["jwt"] = True
    except Exception:
        pass

    try:
        get_private_key()
        get_public_key()
        health["rsa"] = True
    except Exception:
        pass

    try:
        hashed = hash_password("test123")
        verify_password("test123", hashed)
        health["bcrypt"] = True
    except Exception:
        pass

    return health


# ───────────────────────────────────────────────
#  Masking Helpers — for displaying sensitive info safely
# ───────────────────────────────────────────────
def mask_email(email: str) -> str:
    """Mask email: kalki@example.com -> ka***@example.com"""
    try:
        local, domain = email.split("@")
        if len(local) <= 2:
            masked_local = local[0] + "*"
        else:
            masked_local = local[:2] + "*" * (len(local) - 2)
        return f"{masked_local}@{domain}"
    except ValueError:
        return email


def mask_mobile(mobile: str) -> str:
    """Mask mobile: +919876543210 -> +91 98***43210"""
    digits = mobile.replace("+91", "").strip()
    if len(digits) >= 10:
        return f"+91 {digits[:2]}***{digits[-5:]}"
    return mobile
