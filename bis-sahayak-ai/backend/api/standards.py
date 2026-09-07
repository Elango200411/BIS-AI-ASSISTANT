import json
import os
from pathlib import Path
from fastapi import APIRouter, Query, HTTPException
from fastapi.responses import JSONResponse

router = APIRouter(prefix="/api/standards", tags=["standards"])

DATA_DIR = Path(__file__).resolve().parents[2] / "data"
STANDARDS_FILE = DATA_DIR / "bis_standards.json"


def _load_standards() -> list[dict]:
    with open(STANDARDS_FILE, encoding="utf-8") as f:
        data = json.load(f)
    return data.get("standards", [])


def _score_match(standard: dict, query: str) -> int:
    q = query.lower()
    score = 0

    num = standard.get("standard_number", "").lower()
    if q in num:
        score += 10
    if q == num:
        score += 20

    title = standard.get("title", "").lower()
    if q in title:
        score += 8

    cat = standard.get("category", "").lower()
    if q in cat:
        score += 5

    desc = standard.get("description", "").lower()
    if q in desc:
        score += 4

    for kw in standard.get("keywords", []):
        if q in kw.lower():
            score += 6
            break

    applic = standard.get("applicability", "").lower()
    if q in applic:
        score += 3

    return score


@router.get("/search")
def search_standards(q: str = Query(default="", description="Search query")):
    if not q.strip():
        return {
            "query": "",
            "count": 0,
            "results": [],
            "message": "Provide a search query using ?q=<query>.",
        }

    try:
        standards = _load_standards()
    except FileNotFoundError:
        return JSONResponse(
            status_code=500,
            content={"error": "Standards data file not found."},
        )
    except json.JSONDecodeError:
        return JSONResponse(
            status_code=500,
            content={"error": "Standards data file is corrupted."},
        )

    scored = []
    for s in standards:
        score = _score_match(s, q)
        if score > 0:
            scored.append((score, s))

    scored.sort(key=lambda x: x[0], reverse=True)

    results = [item for _, item in scored]

    return {
        "query": q,
        "count": len(results),
        "results": results,
    }


@router.get("/{standard_id}")
def get_standard(standard_id: str):
    try:
        standards = _load_standards()
    except FileNotFoundError:
        return JSONResponse(
            status_code=500,
            content={"error": "Standards data file not found."},
        )
    except json.JSONDecodeError:
        return JSONResponse(
            status_code=500,
            content={"error": "Standards data file is corrupted."},
        )

    for s in standards:
        if s.get("standard_id") == standard_id:
            return s

    raise HTTPException(
        status_code=404,
        detail=f"Standard with ID '{standard_id}' not found.",
    )
