import json
from pathlib import Path
from fastapi import APIRouter, Query, HTTPException
from fastapi.responses import JSONResponse

router = APIRouter(prefix="/api/services", tags=["services"])

DATA_DIR = Path(__file__).resolve().parents[2] / "data"
SERVICES_FILE = DATA_DIR / "bis_services.json"


def _load_services() -> list[dict]:
    with open(SERVICES_FILE, encoding="utf-8") as f:
        data = json.load(f)
    return data.get("services", [])


def _match(service: dict, query: str, category: str) -> bool:
    q = query.lower().strip()
    cat = category.lower().strip()

    if q:
        searchable = " ".join([
            service.get("name", ""),
            service.get("description", ""),
            service.get("target_user", ""),
            " ".join(service.get("keywords", [])),
        ]).lower()
        if q not in searchable:
            return False

    if cat:
        keywords = [k.lower() for k in service.get("keywords", [])]
        name_lower = service.get("name", "").lower()
        if cat not in name_lower and cat not in " ".join(keywords):
            return False

    return True


@router.get("")
def list_services(
    q: str = Query(default="", description="Search query"),
    category: str = Query(default="", description="Filter by keyword category"),
):
    try:
        services = _load_services()
    except FileNotFoundError:
        return JSONResponse(status_code=500, content={"error": "Services data file not found."})
    except json.JSONDecodeError:
        return JSONResponse(status_code=500, content={"error": "Services data file is corrupted."})

    filtered = [s for s in services if _match(s, q, category)]

    return {
        "query": q,
        "category": category,
        "count": len(filtered),
        "results": filtered,
    }


@router.get("/{service_id}")
def get_service(service_id: str):
    try:
        services = _load_services()
    except FileNotFoundError:
        return JSONResponse(status_code=500, content={"error": "Services data file not found."})
    except json.JSONDecodeError:
        return JSONResponse(status_code=500, content={"error": "Services data file is corrupted."})

    for s in services:
        if s.get("service_id") == service_id:
            return s

    raise HTTPException(status_code=404, detail=f"Service '{service_id}' not found.")
