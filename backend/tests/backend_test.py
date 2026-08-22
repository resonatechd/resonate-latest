"""Backend regression tests for Resonate.Dubai — iteration 3.

Covers:
 - health
 - reviews (curated 8)
 - questions CRUD (public + admin)
 - survey submit (new shape: name, phone, email?, answers[]) incl. empty email
 - survey list (admin, answers intact)
 - vacancies routes REMOVED (should 404 / not exist)
"""
import os
import pytest
import requests

BASE_URL = os.environ.get("REACT_APP_BACKEND_URL", "http://localhost:8000").rstrip("/")
API = f"{BASE_URL}/api"
ADMIN_EMAIL = "admin@resonate.dubai"
ADMIN_PASSWORD = "Admin@123"


# ---------- fixtures ----------
@pytest.fixture(scope="session")
def token():
    r = requests.post(f"{API}/auth/login",
                      json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD}, timeout=15)
    assert r.status_code == 200, r.text
    return r.json()["token"]


@pytest.fixture(scope="session")
def auth(token):
    return {"Authorization": f"Bearer {token}"}


# ---------- health ----------
def test_health():
    r = requests.get(f"{API}/health", timeout=10)
    assert r.status_code == 200
    assert r.json()["ok"] is True


# ---------- reviews ----------
def test_reviews_returns_8():
    r = requests.get(f"{API}/reviews", timeout=10)
    assert r.status_code == 200
    data = r.json()
    assert isinstance(data, list) and len(data) == 8


# ---------- questions ----------
def test_questions_public_seeded_8_ordered():
    r = requests.get(f"{API}/questions", timeout=10)
    assert r.status_code == 200
    docs = r.json()
    assert isinstance(docs, list)
    assert len(docs) >= 8
    labels = [d["label"] for d in docs]
    expected = [
        "Age",
        "Which state are you from?",
        "Do you have a valid passport?",
        "What are you planning?",
        "Last education",
        "Do you have working experience?",
        "Which industry / field?",
        "Anything else we should know?",
    ]
    for lbl in expected:
        assert lbl in labels, f"missing seeded question: {lbl}"
    # ordered by "order" ascending
    orders = [d["order"] for d in docs]
    assert orders == sorted(orders), f"questions not ordered: {orders}"


def test_questions_all_requires_admin():
    r = requests.get(f"{API}/questions/all", timeout=10)
    assert r.status_code == 401


def test_questions_all_with_admin(auth):
    r = requests.get(f"{API}/questions/all", headers=auth, timeout=10)
    assert r.status_code == 200
    assert isinstance(r.json(), list)


def test_question_create_update_delete(auth):
    # CREATE
    payload = {
        "label": "TEST_ Question select",
        "help_text": "for test",
        "type": "select",
        "options": ["A", "B"],
        "required": True,
        "order": 999,
        "is_active": True,
    }
    r = requests.post(f"{API}/questions", json=payload, headers=auth, timeout=10)
    assert r.status_code == 200, r.text
    q = r.json()
    qid = q["id"]
    assert q["label"] == payload["label"]
    assert q["options"] == ["A", "B"]

    # Appears in public list (active)
    pub = requests.get(f"{API}/questions", timeout=10).json()
    assert any(d["id"] == qid for d in pub), "created question not in public list"

    # UPDATE — mark inactive → drops from public list
    upd = {**payload, "label": "TEST_ Question updated", "is_active": False}
    r = requests.put(f"{API}/questions/{qid}", json=upd, headers=auth, timeout=10)
    assert r.status_code == 200, r.text
    assert r.json()["label"] == "TEST_ Question updated"
    pub2 = requests.get(f"{API}/questions", timeout=10).json()
    assert not any(d["id"] == qid for d in pub2), "inactive question still public"

    # DELETE (soft)
    r = requests.delete(f"{API}/questions/{qid}", headers=auth, timeout=10)
    assert r.status_code == 200
    pub3 = requests.get(f"{API}/questions", timeout=10).json()
    assert not any(d["id"] == qid for d in pub3)


# ---------- survey ----------
def test_survey_submit_new_shape_with_empty_email():
    # Pull dynamic questions and build minimal answers
    qs = requests.get(f"{API}/questions", timeout=10).json()
    answers = [{
        "question_id": q["id"],
        "label": q["label"],
        "type": q["type"],
        "value": (q.get("options") or ["Yes"])[0] if q["type"] == "select" else "n/a",
    } for q in qs]
    payload = {
        "name": "TEST_ NewShape",
        "phone": "+911234567899",
        "email": "",           # explicit empty string — should be accepted
        "answers": answers,
    }
    r = requests.post(f"{API}/survey/submit", json=payload, timeout=15)
    assert r.status_code == 200, r.text
    assert r.json()["ok"] is True


def test_survey_list_admin_contains_answers(auth):
    r = requests.get(f"{API}/survey/list", headers=auth, timeout=15)
    assert r.status_code == 200
    docs = r.json()
    assert isinstance(docs, list)
    # Find our TEST_ NewShape submission
    ours = [d for d in docs if d.get("name") == "TEST_ NewShape"]
    assert ours, "TEST_ NewShape submission not found in admin list"
    doc = ours[0]
    assert "answers" in doc and isinstance(doc["answers"], list) and len(doc["answers"]) > 0
    a0 = doc["answers"][0]
    for k in ("question_id", "label", "type", "value"):
        assert k in a0, f"answer missing key {k}"


# ---------- vacancies removed ----------
@pytest.mark.parametrize("path,method", [
    ("/vacancies", "GET"),
    ("/vacancies/all", "GET"),
    ("/vacancies", "POST"),
    ("/vacancies/xxx", "DELETE"),
])
def test_vacancies_endpoints_removed(path, method, auth):
    url = f"{API}{path}"
    if method == "GET":
        r = requests.get(url, headers=auth, timeout=10)
    elif method == "POST":
        r = requests.post(url, json={"title": "x"}, headers=auth, timeout=10)
    else:
        r = requests.delete(url, headers=auth, timeout=10)
    # Route removed → FastAPI returns 404
    assert r.status_code == 404, f"{method} {path} expected 404, got {r.status_code}"
