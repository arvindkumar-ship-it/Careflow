"""Server-verified accounts for this single-instance synthetic-data demo."""
import json
import os
from datetime import datetime, timedelta, timezone
from typing import Literal

import bcrypt
import jwt
from fastapi import Depends, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel, Field

bearer = HTTPBearer()


class Account(BaseModel):
    username: str
    password_hash: str
    role: Literal["doctor", "nurse", "patient"]
    patient_id: str | None = None


class LoginRequest(BaseModel):
    username: str = Field(min_length=1, max_length=100)
    password: str = Field(min_length=1, max_length=72)


def signing_key():
    value = os.getenv("CAREFLOW_JWT_SECRET", "")
    if len(value) < 32:
        raise HTTPException(503, "Authentication has not been configured")
    return value


def accounts():
    try:
        result = {row.username: row for row in (Account.model_validate(item) for item in json.loads(os.getenv("CAREFLOW_USERS_JSON", "[]")))}
    except (ValueError, TypeError):
        raise HTTPException(503, "Authentication configuration is invalid")
    if any(row.role == "patient" and not row.patient_id for row in result.values()):
        raise HTTPException(503, "Patient accounts require a patient_id binding")
    return result


def login(payload: LoginRequest):
    key = signing_key()
    account = accounts().get(payload.username)
    try:
        valid = account is not None and bcrypt.checkpw(payload.password.encode(), account.password_hash.encode())
    except ValueError:
        valid = False
    if not valid:
        raise HTTPException(401, "Invalid credentials")
    token = jwt.encode({"sub": account.username, "exp": datetime.now(timezone.utc) + timedelta(hours=1)}, key, algorithm="HS256")
    return {"access_token": token, "role": account.role, "patient_id": account.patient_id}


def current_account(credentials: HTTPAuthorizationCredentials = Depends(bearer)):
    try:
        claims = jwt.decode(credentials.credentials, signing_key(), algorithms=["HS256"], options={"require": ["exp", "sub"]})
    except jwt.InvalidTokenError:
        raise HTTPException(401, "Invalid or expired session")
    account = accounts().get(claims["sub"])
    if account is None:
        raise HTTPException(401, "Account no longer active")
    return account


def require_role(account, *roles):
    if account.role not in roles:
        raise HTTPException(403, "Access denied for this role")


def require_patient_access(account, patient_id):
    if account.role == "patient" and account.patient_id != patient_id:
        raise HTTPException(403, "Access denied to this patient")
