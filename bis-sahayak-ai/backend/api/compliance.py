import json
from pathlib import Path
from fastapi import APIRouter
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from typing import Optional

router = APIRouter(prefix="/api/compliance", tags=["compliance"])

DATA_DIR = Path(__file__).resolve().parents[2] / "data"


def _load_json(filename: str) -> dict:
    path = DATA_DIR / filename
    with open(path, encoding="utf-8") as f:
        return json.load(f)


CATEGORY_KEYWORD_MAP = {
    "electrical": ["electrical", "electronics", "LED", "appliance", "wire", "cable", "motor", "fan", "heater", "iron", "refrigerator"],
    "construction": ["cement", "concrete", "steel", "brick", "reinforcement", "building", "structural", "bar"],
    "food": ["food", "water", "milk", "spice", "oil", "honey", "drinking water"],
    "textile": ["textile", "cotton", "leather", "jute", "garment", "fabric", "apparel"],
    "renewable energy": ["solar", "photovoltaic", "PV", "renewable", "wind"],
    "consumer products": ["toy", "toys", "stationery", "educational"],
    "automotive": ["tyre", "tire", "vehicle", "automotive", "horn", "glass", "lubricant"],
    "medical devices": ["medical", "surgical", "healthcare", "hospital", "glove", "needle"],
}


def _detect_categories(product_text: str) -> list[str]:
    text = product_text.lower()
    matched = []
    for cat, keywords in CATEGORY_KEYWORD_MAP.items():
        for kw in keywords:
            if kw.lower() in text:
                matched.append(cat)
                break
    return matched


def _find_relevant_standards(product_text: str, categories: list[str]) -> list[dict]:
    data = _load_json("bis_standards.json")
    standards = data.get("standards", [])
    results = []
    text = product_text.lower()

    for s in standards:
        score = 0
        searchable = " ".join([
            s.get("title", ""),
            s.get("description", ""),
            s.get("category", ""),
            " ".join(s.get("keywords", [])),
        ]).lower()

        for token in text.split():
            if len(token) >= 3 and token in searchable:
                score += 3

        for cat in categories:
            if cat in searchable:
                score += 2

        if score > 0:
            results.append({"standard": s, "relevance_score": score})

    results.sort(key=lambda x: x["relevance_score"], reverse=True)
    return [r["standard"] for r in results[:5]]


def _find_relevant_services(categories: list[str], product_text: str) -> list[dict]:
    data = _load_json("bis_services.json")
    services = data.get("services", [])
    text = product_text.lower()
    results = []

    for svc in services:
        score = 0
        searchable = " ".join([
            svc.get("name", ""),
            svc.get("description", ""),
            " ".join(svc.get("keywords", [])),
        ]).lower()

        for cat in categories:
            if cat in searchable:
                score += 3

        for token in text.split():
            if len(token) >= 3 and token in searchable:
                score += 2

        if score > 0:
            results.append({"service": svc, "score": score})

    results.sort(key=lambda x: x["score"], reverse=True)
    return [r["service"] for r in results[:3]]


def _find_cert_rules(categories: list[str], product_text: str) -> list[dict]:
    data = _load_json("certification_rules.json")
    rules = data.get("certification_rules", [])
    text = product_text.lower()
    results = []

    for r in rules:
        score = 0
        searchable = " ".join([
            r.get("title", ""),
            r.get("description", ""),
            r.get("product_category", ""),
            " ".join(r.get("applicable_products", [])),
            " ".join(r.get("keywords", [])),
        ]).lower()

        for cat in categories:
            if cat in searchable:
                score += 3

        for token in text.split():
            if len(token) >= 3 and token in searchable:
                score += 2

        if score > 0:
            results.append({"rule": r, "score": score})

    results.sort(key=lambda x: x["score"], reverse=True)
    return [r["rule"] for r in results[:3]]


def _assess_compliance(form: dict, standards: list, rules: list) -> dict:
    filled_fields = []
    missing_fields = []

    field_checks = {
        "product_name": "Product name",
        "category": "Product category",
        "intended_use": "Intended use",
        "manufacturer": "Manufacturer / Importer",
        "country": "Country of manufacture",
        "description": "Product description",
    }

    for key, label in field_checks.items():
        val = form.get(key, "").strip()
        if val:
            filled_fields.append(label)
        else:
            missing_fields.append(label)

    completeness = round((len(filled_fields) / len(field_checks)) * 100)

    has_certification = len(rules) > 0
    has_standards = len(standards) > 0
    all_fields = len(missing_fields) == 0

    if has_certification and all_fields:
        status = "likely_ready"
        score = min(95, completeness + 15 if has_standards else completeness)
    elif has_certification or has_standards:
        status = "needs_verification"
        score = min(80, completeness + 10 if has_standards else completeness)
    elif completeness >= 50:
        status = "needs_verification"
        score = completeness
    else:
        status = "attention_required"
        score = max(10, completeness - 10)

    return {
        "status": status,
        "score": score,
        "completeness": completeness,
        "filled_fields": filled_fields,
        "missing_fields": missing_fields,
        "has_certification_requirements": has_certification,
        "has_applicable_standards": has_standards,
    }


class ComplianceCheckRequest(BaseModel):
    product_name: str = ""
    category: str = ""
    intended_use: str = ""
    manufacturer: str = ""
    country: str = ""
    description: str = ""


@router.post("/check")
def check_compliance(form: ComplianceCheckRequest):
    form_dict = form.model_dump()
    product_text = " ".join(v for v in form_dict.values() if v)

    if not product_text.strip():
        return JSONResponse(status_code=400, content={
            "error": "Provide at least one product detail to check compliance."
        })

    categories = _detect_categories(product_text)
    standards = _find_relevant_standards(product_text, categories)
    services = _find_relevant_services(categories, product_text)
    cert_rules = _find_cert_rules(categories, product_text)
    assessment = _assess_compliance(form_dict, standards, cert_rules)

    status_labels = {
        "likely_ready": {
            "label": "Information Available — Likely Ready",
            "color": "green",
            "icon": "green",
        },
        "needs_verification": {
            "label": "Further Verification Required",
            "color": "yellow",
            "icon": "yellow",
        },
        "attention_required": {
            "label": "Certification / Compliance Attention Required",
            "color": "red",
            "icon": "red",
        },
    }

    next_steps = []
    if not assessment["has_applicable_standards"]:
        next_steps.append("Verify if your product falls under any compulsory BIS certification scheme.")
    if not assessment["has_certification_requirements"]:
        next_steps.append("Check with BIS whether your product category requires mandatory certification.")
    if assessment["missing_fields"]:
        next_steps.append("Provide additional product details for a more accurate compliance assessment.")
    if assessment["has_certification_requirements"]:
        next_steps.append("Review the applicable certification requirements and gather required documents.")
    if assessment["has_applicable_standards"]:
        next_steps.append("Ensure your product is tested against the identified Indian Standards.")
    next_steps.append("Consult official BIS resources or a BIS-recognised laboratory for final determination.")

    return {
        "product": form_dict,
        "detected_categories": categories,
        "compliance_status": status_labels.get(assessment["status"], status_labels["attention_required"]),
        "readiness_score": assessment["score"],
        "field_completeness": assessment["completeness"],
        "filled_fields": assessment["filled_fields"],
        "missing_fields": assessment["missing_fields"],
        "relevant_standards": [
            {
                "standard_number": s.get("standard_number"),
                "title": s.get("title"),
                "category": s.get("category"),
                "description": s.get("description"),
            }
            for s in standards
        ],
        "applicable_certification_rules": [
            {
                "title": r.get("title"),
                "product_category": r.get("product_category"),
                "description": r.get("description"),
                "compliance_requirements": r.get("compliance_requirements", []),
            }
            for r in cert_rules
        ],
        "related_bis_services": [
            {
                "name": s.get("name"),
                "description": s.get("description"),
            }
            for s in services
        ],
        "next_steps": next_steps,
        "disclaimer": "Informational prototype result — verify final requirements through official BIS channels.",
    }
