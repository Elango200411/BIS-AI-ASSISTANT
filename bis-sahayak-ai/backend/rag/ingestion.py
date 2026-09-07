"""
Ingestion module: loads the JSON knowledge base and creates indexed document chunks.
Each chunk carries metadata for attribution and retrieval.
"""

import json
from pathlib import Path
from dataclasses import dataclass, field

DATA_DIR = Path(__file__).resolve().parents[2] / "data"


@dataclass
class Document:
    content: str
    source_type: str
    source_id: str
    title: str
    metadata: dict = field(default_factory=dict)


def _load(filename: str) -> dict:
    path = DATA_DIR / filename
    with open(path, encoding="utf-8") as f:
        return json.load(f)


def _chunk_standard(s: dict) -> Document:
    parts = [
        f"Standard: {s.get('standard_number', '')}",
        f"Title: {s.get('title', '')}",
        f"Category: {s.get('category', '')}",
        f"Description: {s.get('description', '')}",
        f"Applicability: {s.get('applicability', '')}",
        f"Related Service: {s.get('related_service', '')}",
        f"Keywords: {', '.join(s.get('keywords', []))}",
    ]
    return Document(
        content=" | ".join(parts),
        source_type="standard",
        source_id=s.get("standard_id", ""),
        title=s.get("standard_number", ""),
        metadata={
            "standard_number": s.get("standard_number"),
            "category": s.get("category"),
            "related_service": s.get("related_service"),
        },
    )


def _chunk_service(s: dict) -> Document:
    parts = [
        f"Service: {s.get('name', '')}",
        f"Description: {s.get('description', '')}",
        f"Target User: {s.get('target_user', '')}",
        f"Documents: {', '.join(s.get('required_documents', []))}",
        f"Steps: {', '.join(s.get('process_steps', []))}",
        f"Keywords: {', '.join(s.get('keywords', []))}",
    ]
    return Document(
        content=" | ".join(parts),
        source_type="service",
        source_id=s.get("service_id", ""),
        title=s.get("name", ""),
        metadata={
            "target_user": s.get("target_user"),
            "num_documents": len(s.get("required_documents", [])),
            "num_steps": len(s.get("process_steps", [])),
        },
    )


def _chunk_cert_rule(r: dict) -> Document:
    parts = [
        f"Certification Rule: {r.get('title', '')}",
        f"Category: {r.get('product_category', '')}",
        f"Description: {r.get('description', '')}",
        f"Applicable Products: {', '.join(r.get('applicable_products', []))}",
        f"Requirements: {', '.join(r.get('compliance_requirements', []))}",
        f"Keywords: {', '.join(r.get('keywords', []))}",
    ]
    return Document(
        content=" | ".join(parts),
        source_type="cert_rule",
        source_id=r.get("rule_id", ""),
        title=r.get("title", ""),
        metadata={
            "product_category": r.get("product_category"),
            "num_products": len(r.get("applicable_products", [])),
        },
    )


def _chunk_hallmarking(h: dict) -> Document:
    parts = [
        f"Hallmarking: {h.get('title', '')}",
        f"Description: {h.get('description', '')}",
    ]
    if h.get("purity_grades"):
        for g in h["purity_grades"]:
            parts.append(f"Grade: {g.get('grade', '')} - Fineness {g.get('fineness', '')} - {g.get('percentage', '')}")
    if h.get("marks_on_article"):
        for m in h["marks_on_article"]:
            parts.append(f"Mark: {m.get('mark', '')} - {m.get('description', '')}")
    if h.get("process_summary"):
        parts.append(f"Process: {h['process_summary']}")
    if h.get("verification_method"):
        parts.append(f"Verification: {h['verification_method']}")
    parts.append(f"Keywords: {', '.join(h.get('keywords', []))}")

    return Document(
        content=" | ".join(parts),
        source_type="hallmarking",
        source_id=h.get("hallmark_id", ""),
        title=h.get("title", ""),
        metadata={},
    )


def _chunk_consumer_service(cs: dict) -> Document:
    parts = [
        f"Consumer Service: {cs.get('title', '')}",
        f"Description: {cs.get('description', '')}",
        f"Eligibility: {cs.get('eligibility', '')}",
        f"How to Access: {', '.join(cs.get('how_to_access', []))}",
        f"Information Needed: {', '.join(cs.get('required_information', []))}",
        f"Keywords: {', '.join(cs.get('keywords', []))}",
    ]
    return Document(
        content=" | ".join(parts),
        source_type="consumer_service",
        source_id=cs.get("service_id", ""),
        title=cs.get("title", ""),
        metadata={"eligibility": cs.get("eligibility")},
    )


def _chunk_faq(f: dict) -> Document:
    parts = [
        f"FAQ: {f.get('question', '')}",
        f"Answer: {f.get('answer', '')}",
        f"Category: {f.get('category', '')}",
        f"Keywords: {', '.join(f.get('keywords', []))}",
    ]
    return Document(
        content=" | ".join(parts),
        source_type="faq",
        source_id=f.get("faq_id", ""),
        title=f.get("question", ""),
        metadata={"category": f.get("category")},
    )


def load_all_documents() -> list[Document]:
    """Load and chunk the entire knowledge base."""
    docs = []

    for s in _load("bis_standards.json").get("standards", []):
        docs.append(_chunk_standard(s))

    for s in _load("bis_services.json").get("services", []):
        docs.append(_chunk_service(s))

    for r in _load("certification_rules.json").get("certification_rules", []):
        docs.append(_chunk_cert_rule(r))

    for h in _load("hallmarking.json").get("hallmarking", []):
        docs.append(_chunk_hallmarking(h))

    for cs in _load("consumer_services.json").get("consumer_services", []):
        docs.append(_chunk_consumer_service(cs))

    for f in _load("faq.json").get("faqs", []):
        docs.append(_chunk_faq(f))

    return docs
