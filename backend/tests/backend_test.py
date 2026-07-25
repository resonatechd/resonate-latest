"""Backend regression tests for Resonate.Dubai — iteration 2"""
import io
import os
import pytest
import requests

BASE_URL = os.environ.get("REACT_APP_BACKEND_URL", "https://business-guide-uae.preview.emergentagent.com").rstrip("/")
API = f"{BASE_URL}/api"
ADMIN_EMAIL = "admin@resonate.dubai"
ADMIN_PASSWORD = "Admin@123"


@pytest.fixture(scope="session")
def token():
    r = requests.post(f"{API}/auth/login", json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD}, timeout=15)
    assert r.status_code == 200, r.text
    return r.json()["token"]


@pytest.fixture(scope="session")
def auth(token):
    return {"Authorization": f"Bearer {token}"}


# --- Health / basics ---
def test_health():
    r = requests.get(f"{API}/health", timeout=10)
    assert r.status_code == 200
    assert r.json()["ok"] is True


# --- Reviews ---
def test_reviews_returns_8_curated():
    r = requests.get(f"{API}/reviews", timeout=10)
    assert r.status_code == 200
    data = r.json()
    assert isinstance(data, list) and len(data) == 8
    names = [d["name"] for d in data]
    for expected in ["Virat", "Kamal Kumar", "Soumayya Sobti", "Aman Kumar",
                     "Shetij Malhotra", "Balwinder Singh", "Neha & Rajesh Sharma", "Priya Sharma"]:
        assert expected in names, f"missing {expected}"


# --- Vacancies public ---
def test_vacancies_public_seeded():
    r = requests.get(f"{API}/vacancies", timeout=10)
    assert r.status_code == 200
    data = r.json()
    assert isinstance(data, list)
    titles = [d["title"] for d in data]
    assert "Taxi Driver — Sharjah" in titles
    assert len(data) >= 10


# --- Vacancies admin ---
def test_vacancies_all_requires_auth():
    r = requests.get(f"{API}/vacancies/all", timeout=10)
    assert r.status_code == 401


def test_vacancies_all_with_admin(auth):
    r = requests.get(f"{API}/vacancies/all", headers=auth, timeout=10)
    assert r.status_code == 200
    assert isinstance(r.json(), list)


def test_create_and_delete_vacancy(auth):
    payload = {"title": "TEST_ Vacancy XYZ", "description": "desc", "is_active": True}
    r = requests.post(f"{API}/vacancies", json=payload, headers=auth, timeout=10)
    assert r.status_code == 200, r.text
    vid = r.json()["id"]
    # Should appear in public list
    pub = requests.get(f"{API}/vacancies", timeout=10).json()
    assert any(v["id"] == vid for v in pub)
    # Delete
    r = requests.delete(f"{API}/vacancies/{vid}", headers=auth, timeout=10)
    assert r.status_code == 200
    pub2 = requests.get(f"{API}/vacancies", timeout=10).json()
    assert not any(v["id"] == vid for v in pub2)


# --- Survey submit new schema ---
def test_survey_submit_minimal():
    payload = {"name": "TEST_ User", "phone": "+911234567890", "intent": "visit"}
    r = requests.post(f"{API}/survey/submit", json=payload, timeout=15)
    assert r.status_code == 200, r.text
    assert r.json()["ok"] is True


def test_survey_submit_full():
    payload = {
        "name": "TEST_ FullUser",
        "age": "27",
        "phone": "+911234567891",
        "state": "Punjab",
        "has_passport": "yes",
        "intent": "job",
        "education": "Graduation",
        "education_detail": "BA",
        "has_experience": "yes",
        "industry": "Taxi Driver",
        "vacancy": "Taxi Driver — Sharjah",
        "email": "test@example.com",
    }
    r = requests.post(f"{API}/survey/submit", json=payload, timeout=15)
    assert r.status_code == 200
    sid = r.json()["id"]
    assert sid


def test_survey_list_admin(auth):
    r = requests.get(f"{API}/survey/list", headers=auth, timeout=15)
    assert r.status_code == 200
    docs = r.json()
    assert isinstance(docs, list)
    # verify new fields present in at least one recent record
    if docs:
        keys = set(docs[0].keys())
        for k in ["name", "phone", "intent"]:
            assert k in keys


# --- Survey upload ---
def test_survey_upload_image():
    # Tiny 1x1 PNG
    png = bytes.fromhex(
        "89504E470D0A1A0A0000000D49484452000000010000000108060000001F15C4890000000A49444154789C63000100000500010D0A2DB40000000049454E44AE426082"
    )
    files = {"file": ("t.png", io.BytesIO(png), "image/png")}
    r = requests.post(f"{API}/survey/upload", files=files, timeout=30)
    if r.status_code == 503:
        pytest.skip("Storage service unavailable in this environment")
    assert r.status_code == 200, r.text
    body = r.json()
    assert "path" in body and "content_type" in body
