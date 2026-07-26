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
from pydantic import BaseModel, Field, EmailStr, field_validator

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
    # Slide 1 - Personal
    name: str
    age: Optional[str] = None
    phone: str
    # Slide 2 - Location
    state: Optional[str] = None
    # Slide 3 - Passport
    has_passport: Optional[str] = None  # yes | no
    passport_front_path: Optional[str] = None
    passport_back_path: Optional[str] = None
    # Slide 4 - Intent
    intent: str  # visit | business | job | other
    # Slide 5 - Job / education
    education: Optional[str] = None
    education_detail: Optional[str] = None
    has_experience: Optional[str] = None  # yes | no
    industry: Optional[str] = None
    vacancy: Optional[str] = None
    # Extras / legacy contact
    email: Optional[EmailStr] = None
    nationality: Optional[str] = None
    budget: Optional[str] = None
    timeline: Optional[str] = None
    notes: Optional[str] = None
    # Legacy
    location: Optional[str] = None
    visa_status: Optional[str] = None
    field_or_type: Optional[str] = None
    experience_years: Optional[str] = None

    @field_validator("email", mode="before")
    @classmethod
    def _empty_email_to_none(cls, v):
        if v in ("", None):
            return None
        return v


class VacancyIn(BaseModel):
    title: str
    description: Optional[str] = ""
    is_active: bool = True


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
    await db.vacancies.create_index("created_at")

    # Seed default vacancies if none exist
    if await db.vacancies.count_documents({}) == 0:
        defaults = [
            "Taxi Driver — Sharjah",
            "Kitchen Helper / Cook — Restaurants (Ajman)",
            "Waiter / Waitress — Hospitality",
            "Housekeeping — Hotels",
            "Delivery Rider — E-commerce",
            "Truck Driver — Logistics",
            "Accountant — Corporate Services",
            "Admin Assistant — Corporate Office",
            "Sales Executive — Retail / Real Estate",
            "Digital Marketing Executive",
        ]
        now = datetime.now(timezone.utc).isoformat()
        await db.vacancies.insert_many([
            {
                "id": str(uuid.uuid4()),
                "title": t,
                "description": "",
                "is_active": True,
                "is_deleted": False,
                "created_at": now,
            }
            for t in defaults
        ])

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
    # Curated Google-style reviews (admin can edit via /api/reviews-admin later)
    return [
        {
            "id": "r1",
            "name": "Virat",
            "rating": 5,
            "date": "7 months ago",
            "text": "My experience here was seamless. The staff were professional and attentive. They answered all my questions thoroughly. I highly recommend this office for anyone looking for efficient and reliable service.",
            "avatar_color": "#C5A059",
        },
        {
            "id": "r2",
            "name": "Kamal Kumar",
            "rating": 5,
            "date": "7 months ago",
            "text": "A highly professional documentation service. They made my UAE placement process smooth and completely stress-free. I received regular updates throughout. Highly recommended!",
            "avatar_color": "#2C303A",
        },
        {
            "id": "r3",
            "name": "Soumayya Sobti",
            "rating": 5,
            "date": "7 months ago",
            "text": "I had a very positive experience with this manpower recruitment company. The process was transparent, well-organised, and stress-free. Their expertise and attention to detail are commendable.",
            "avatar_color": "#8B7355",
        },
        {
            "id": "r4",
            "name": "Aman Kumar",
            "rating": 5,
            "date": "7 months ago",
            "text": "Very transparent and genuine consultancy. No hidden charges and no false promises. The staff is supportive and well-trained.",
            "avatar_color": "#C5A059",
        },
        {
            "id": "r5",
            "name": "Shetij Malhotra",
            "rating": 5,
            "date": "5 months ago",
            "text": "They helped us set up our UAE trade license in just 5 days — the entire process was smooth and Mr. Khanna's team stayed connected the whole way through. Truly grateful.",
            "avatar_color": "#2C303A",
        },
        {
            "id": "r6",
            "name": "Balwinder Singh",
            "rating": 5,
            "date": "1 year ago",
            "text": "It's been a year since I came to Sharjah as a taxi driver through Resonate. The salary is exactly what they promised, and I'm sending money home every month for my two kids. Very happy with the team.",
            "avatar_color": "#8B7355",
        },
        {
            "id": "r7",
            "name": "Neha & Rajesh Sharma",
            "rating": 5,
            "date": "4 months ago",
            "text": "We came for a family placement and the entire experience was hassle-free. The documentation was handled by them end-to-end and everything was booked in advance. Would recommend to anyone.",
            "avatar_color": "#C5A059",
        },
        {
            "id": "r8",
            "name": "Priya Sharma",
            "rating": 5,
            "date": "3 months ago",
            "text": "Got PRO services and corporate tax registration done without any hassle. Highly recommend for SMEs — they explain every step clearly.",
            "avatar_color": "#2C303A",
        },
    ]


@api.get("/vacancies")
async def list_vacancies_public():
    docs = (
        await db.vacancies.find(
            {"is_deleted": {"$ne": True}, "is_active": True}, {"_id": 0}
        )
        .sort("created_at", -1)
        .to_list(200)
    )
    return docs


@api.post("/survey/upload")
async def survey_upload(file: UploadFile = File(...)):
    content = await file.read()
    if not content:
        raise HTTPException(status_code=400, detail="Empty file")
    ext = (file.filename.split(".")[-1] if file.filename and "." in file.filename else "bin").lower()
    ct = file.content_type or "application/octet-stream"
    path = f"{APP_NAME}/survey/{uuid.uuid4()}.{ext}"
    result = put_object(path, content, ct)
    # Track for admin visibility (no auth)
    await db.survey_uploads.insert_one({
        "id": str(uuid.uuid4()),
        "path": result["path"],
        "content_type": ct,
        "size": result.get("size", 0),
        "created_at": datetime.now(timezone.utc).isoformat(),
    })
    return {"path": result["path"], "content_type": ct}


@api.get("/files/{path:path}")
async def download_file(path: str):
    # Check updates first (public media)
    record = await db.updates.find_one(
        {"media_path": path, "is_deleted": {"$ne": True}}
    )
    ct_fallback = None
    if record:
        ct_fallback = record.get("media_type")
    else:
        # Check survey uploads (passport files)
        upload = await db.survey_uploads.find_one({"path": path})
        if not upload:
            # Or referenced by a survey
            survey_ref = await db.surveys.find_one({
                "$or": [{"passport_front_path": path}, {"passport_back_path": path}]
            })
            if not survey_ref:
                raise HTTPException(status_code=404, detail="File not found")
            ct_fallback = None
        else:
            ct_fallback = upload.get("content_type")
    data, ct = get_object(path)
    return Response(content=data, media_type=ct_fallback or ct)


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


@api.get("/vacancies/all")
async def list_vacancies_admin(admin=Depends(require_admin)):
    docs = (
        await db.vacancies.find({"is_deleted": {"$ne": True}}, {"_id": 0})
        .sort("created_at", -1)
        .to_list(500)
    )
    return docs


@api.post("/vacancies")
async def create_vacancy(body: VacancyIn, admin=Depends(require_admin)):
    doc = body.model_dump()
    doc["id"] = str(uuid.uuid4())
    doc["is_deleted"] = False
    doc["created_at"] = datetime.now(timezone.utc).isoformat()
    await db.vacancies.insert_one(doc)
    doc.pop("_id", None)
    return doc


@api.delete("/vacancies/{vacancy_id}")
async def delete_vacancy(vacancy_id: str, admin=Depends(require_admin)):
    res = await db.vacancies.update_one(
        {"id": vacancy_id}, {"$set": {"is_deleted": True}}
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
