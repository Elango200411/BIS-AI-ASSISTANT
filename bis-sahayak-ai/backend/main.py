from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import time
import json
from pathlib import Path

from api.standards import router as standards_router
from api.services import router as services_router
from api.compliance import router as compliance_router
from api.chat import router as chat_router

app = FastAPI(title="BIS Sahayak AI", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(standards_router)
app.include_router(services_router)
app.include_router(compliance_router)
app.include_router(chat_router)

START_TIME = time.time()
DATA_DIR = Path(__file__).resolve().parents[1] / "data"

问答_count = 0


def _load_count(filename: str) -> int:
    try:
        with open(DATA_DIR / filename, encoding="utf-8") as f:
            data = json.load(f)
        for key in ["standards", "services", "certification_rules", "hallmarking", "consumer_services", "faqs"]:
            if key in data:
                return len(data[key])
        return 0
    except Exception:
        return 0


@app.get("/api/health")
def health_check():
    return {
        "status": "healthy",
        "service": "BIS Sahayak AI",
        "version": "0.1.0",
        "uptime": time.time() - START_TIME,
    }


@app.get("/api/stats")
def get_stats():
    standards_count = _load_count("bis_standards.json")
    services_count = _load_count("bis_services.json")
    cert_count = _load_count("certification_rules.json")
    hallmark_count = _load_count("hallmarking.json")
    consumer_count = _load_count("consumer_services.json")
    faq_count = _load_count("faq.json")

    total_kb = standards_count + services_count + cert_count + hallmark_count + consumer_count + faq_count

    return {
        "standards_indexed": standards_count,
        "bis_services": services_count,
        "certification_rules": cert_count,
        "hallmarking_entries": hallmark_count,
        "consumer_services": consumer_count,
        "faqs": faq_count,
        "total_kb_records": total_kb,
        "uptime_seconds": round(time.time() - START_TIME, 1),
        "version": "0.1.0",
    }
