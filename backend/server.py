from dotenv import load_dotenv
from pathlib import Path

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / ".env")

import os
import uuid
import logging
import bcrypt
import jwt
import requests
from datetime import datetime, timezone, timedelta
from typing import Optional, List

from fastapi import (
    FastAPI,
    APIRouter,
    HTTPException,
    Depends,
    Request,
    UploadFile,
    File,
    Form,
    Response,
)
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel, Field, EmailStr

# --- Config ---
MONGO_URL = os.environ["MONGO_URL"]
DB_NAME = os.environ["DB_NAME"]
JWT_SECRET = os.environ["JWT_SECRET"]
JWT_ALGO = "HS256"
ADMIN_EMAIL = os.environ.get("ADMIN_EMAIL", "admin@resonate.dubai")
ADMIN_PASSWORD = os.environ.get("ADMIN_PASSWORD", "Admin@123")
EMERGENT_LLM_KEY = os.environ.get("EMERGENT_LLM_KEY", "")
APP_NAME = os.environ.get("APP_NAME", "resonate-dubai")

STORAGE_URL = "https://integrations.emergentagent.com/objstore/api/v1/storage"

client = AsyncIOMotorClient(MONGO_URL)
db = client[DB_NAME]

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
)
logger = logging.getLogger("resonate")

app = FastAPI(title="Resonate.Dubai API")
api = APIRouter(prefix="/api")
security = HTTPBearer(auto_error=False)

# --- Storage helpers ---
storage_key: Optional[str] = None


def init_storage() -> Optional[str]:
    global storage_key
    if storage_key:
        return storage_key
    if not EMERGENT_LLM_KEY:
        logger.warning("EMERGENT_LLM_KEY not set — storage disabled")
        return None
    try:
        resp = requests.post(
            f"{STORAGE_URL}/init",
            json={"emergent_key": EMERGENT_LLM_KEY},
            timeout=30,
        )
        resp.raise_for_status()
        storage_key = resp.json()["storage_key"]
        logger.info("Object storage initialized")
        return storage_key
    except Exception as e:
        logger.error(f"Storage init failed: {e}")
        return None


def put_object(path: str, data: bytes, content_type: str) -> dict:
    key = init_storage()
    if not key:
        raise HTTPException(status_code=503, detail="Storage unavailable")
    resp = requests.put(
        f"{STORAGE_URL}/objects/{path}",
        headers={"X-Storage-Key": key, "Content-Type": content_type},
        data=data,
        timeout=120,
    )
    if resp.status_code == 403:
        # refresh key once
        global storage_key
        storage_key = None
        key = init_storage()
        resp = requests.put(
            f"{STORAGE_URL}/objects/{path}",
            headers={"X-Storage-Key": key, "Content-Type": content_type},
            data=data,
            timeout=120,
        )
    resp.raise_for_status()
    return resp.json()


def get_object(path: str):
    key = init_storage()
    if not key:
        raise HTTPException(status_code=503, detail="Storage unavailable")
    resp = requests.get(
        f"{STORAGE_URL}/objects/{path}",
        headers={"X-Storage-Key": key},
        timeout=60,
    )
    if resp.status_code == 403:
        global storage_key
        storage_key = None
        key = init_storage()
        resp = requests.get(
            f"{STORAGE_URL}/objects/{path}",
            headers={"X-Storage-Key": key},
            timeout=60,
        )
    resp.raise_for_status()
    return resp.content, resp.headers.get("Content-Type", "application/octet-stream")


# --- Auth helpers ---
def hash_password(pw: str) -> str:
    return bcrypt.hashpw(pw.encode(), bcrypt.gensalt()).decode()


def verify_password(pw: str, hashed: str) -> bool:
    try:
        return bcrypt.checkpw(pw.encode(), hashed.encode())
    except Exception:
        return False


def create_token(user_id: str, email: str) -> str:
    payload = {
        "sub": user_id,
        "email": email,
        "exp": datetime.now(timezone.utc) + timedelta(days=7),
        "type": "access",
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGO)


async def require_admin(
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(security),
) -> dict:
    if credentials is None:
        raise HTTPException(status_code=401, detail="Not authenticated")
    token = credentials.credentials
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGO])
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")
    user = await db.users.find_one({"id": payload["sub"]})
    if not user or user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Admin only")
    user.pop("_id", None)
    user.pop("password_hash", None)
    return user


# --- Models ---
class LoginIn(BaseModel):
    email: EmailStr
    password: str


class SurveyIn(BaseModel):
    location: str  # inside_uae | outside_uae
    intent: str  # business | job | visit | other
    visa_status: Optional[str] = None
    education: Optional[str] = None
    field_or_type: Optional[str] = None
    budget: Optional[str] = None
    timeline: Optional[str] = None
    experience_years: Optional[str] = None
    name: str
    email: EmailStr
    phone: str
    nationality: Optional[str] = None
    notes: Optional[str] = None


class UpdateOut(BaseModel):
    id: str
    title: str
    description: str
    category: str  # visa | company | video | announcement
    media_path: Optional[str] = None
    media_type: Optional[str] = None
    created_at: str


# --- Startup ---
@app.on_event("startup")
async def on_startup():
    # Indexes
    await db.users.create_index("email", unique=True)
    await db.surveys.create_index("created_at")
    await db.updates.create_index("created_at")

    # Seed admin
    existing = await db.users.find_one({"email": ADMIN_EMAIL})
    if not existing:
        await db.users.insert_one(
            {
                "id": str(uuid.uuid4()),
                "email": ADMIN_EMAIL,
                "password_hash": hash_password(ADMIN_PASSWORD),
                "name": "Administrator",
                "role": "admin",
                "created_at": datetime.now(timezone.utc).isoformat(),
            }
        )
        logger.info(f"Seeded admin user: {ADMIN_EMAIL}")
    elif not verify_password(ADMIN_PASSWORD, existing["password_hash"]):
        await db.users.update_one(
            {"email": ADMIN_EMAIL},
            {"$set": {"password_hash": hash_password(ADMIN_PASSWORD)}},
        )
        logger.info("Admin password updated from env")

    # Init storage (non-fatal)
    init_storage()


@app.on_event("shutdown")
async def on_shutdown():
    client.close()


# --- Public routes ---
@api.get("/")
async def root():
    return {"service": "Resonate.Dubai API", "status": "ok"}


@api.get("/health")
async def health():
    return {"ok": True}


@api.post("/auth/login")
async def login(body: LoginIn):
    email = body.email.lower().strip()
    user = await db.users.find_one({"email": email})
    if not user or not verify_password(body.password, user["password_hash"]):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    token = create_token(user["id"], user["email"])
    return {
        "token": token,
        "user": {
            "id": user["id"],
            "email": user["email"],
            "name": user.get("name", ""),
            "role": user.get("role", "user"),
        },
    }


@api.get("/auth/me")
async def me(admin=Depends(require_admin)):
    return admin


@api.post("/survey/submit")
async def submit_survey(body: SurveyIn):
    doc = body.model_dump()
    doc["id"] = str(uuid.uuid4())
    doc["created_at"] = datetime.now(timezone.utc).isoformat()
    doc["status"] = "new"
    await db.surveys.insert_one(doc)
    logger.info(f"New survey submission: {doc['email']} ({doc['intent']})")
    return {"ok": True, "id": doc["id"]}


@api.get("/updates/list")
async def list_updates_public():
    docs = (
        await db.updates.find({"is_deleted": {"$ne": True}}, {"_id": 0})
        .sort("created_at", -1)
        .to_list(50)
    )
    return docs


@api.get("/reviews")
async def get_reviews():
    # Static curated testimonials (Google-style)
    return [
        {
            "id": "r1",
            "name": "Ahmed Al Mansoori",
            "rating": 5,
            "date": "2 weeks ago",
            "text": "Resonate.Dubai handled my mainland trade license end-to-end. Transparent pricing and delivered before the promised date.",
            "avatar_color": "#C5A059",
        },
        {
            "id": "r2",
            "name": "Priya Sharma",
            "rating": 5,
            "date": "1 month ago",
            "text": "Best consultancy for taxi driver visas in Sharjah. Mr. Khanna's team is genuinely helpful and reliable.",
            "avatar_color": "#2C303A",
        },
        {
            "id": "r3",
            "name": "Mohammed Iqbal",
            "rating": 5,
            "date": "3 weeks ago",
            "text": "They processed my investor visa smoothly. Excellent communication throughout the process.",
            "avatar_color": "#8B7355",
        },
        {
            "id": "r4",
            "name": "Fatima Hassan",
            "rating": 5,
            "date": "2 months ago",
            "text": "Got PRO services and corporate tax registration done without any hassle. Highly recommend for SMEs.",
            "avatar_color": "#C5A059",
        },
        {
            "id": "r5",
            "name": "Rajesh Patel",
            "rating": 5,
            "date": "5 weeks ago",
            "text": "Freezone company setup completed within 10 days. Great support even after license issuance.",
            "avatar_color": "#2C303A",
        },
        {
            "id": "r6",
            "name": "Sara Khan",
            "rating": 5,
            "date": "1 week ago",
            "text": "Family visa processing was seamless. Team kept me updated at every step. Thank you Resonate.Dubai!",
            "avatar_color": "#8B7355",
        },
    ]


@api.get("/files/{path:path}")
async def download_file(path: str):
    record = await db.updates.find_one(
        {"media_path": path, "is_deleted": {"$ne": True}}
    )
    if not record:
        raise HTTPException(status_code=404, detail="File not found")
    data, ct = get_object(path)
    return Response(content=data, media_type=record.get("media_type") or ct)


# --- Admin routes ---
@api.get("/survey/list")
async def list_surveys(admin=Depends(require_admin)):
    docs = (
        await db.surveys.find({}, {"_id": 0}).sort("created_at", -1).to_list(500)
    )
    return docs


@api.post("/updates")
async def create_update(
    title: str = Form(...),
    description: str = Form(""),
    category: str = Form("announcement"),
    media: Optional[UploadFile] = File(None),
    admin=Depends(require_admin),
):
    update_id = str(uuid.uuid4())
    media_path = None
    media_type = None

    if media is not None:
        content = await media.read()
        if content:
            ext = (media.filename.split(".")[-1] if media.filename and "." in media.filename else "bin").lower()
            media_type = media.content_type or "application/octet-stream"
            path = f"{APP_NAME}/updates/{update_id}.{ext}"
            result = put_object(path, content, media_type)
            media_path = result["path"]

    doc = {
        "id": update_id,
        "title": title,
        "description": description,
        "category": category,
        "media_path": media_path,
        "media_type": media_type,
        "is_deleted": False,
        "created_at": datetime.now(timezone.utc).isoformat(),
    }
    await db.updates.insert_one(doc)
    doc.pop("_id", None)
    return doc


@api.delete("/updates/{update_id}")
async def delete_update(update_id: str, admin=Depends(require_admin)):
    res = await db.updates.update_one(
        {"id": update_id}, {"$set": {"is_deleted": True}}
    )
    if res.matched_count == 0:
        raise HTTPException(status_code=404, detail="Not found")
    return {"ok": True}


app.include_router(api)

app.add_middleware(
    CORSMiddleware,
    allow_origins=os.environ.get("CORS_ORIGINS", "*").split(","),
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)
