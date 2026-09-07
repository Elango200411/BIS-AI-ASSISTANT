import json
import re
import logging
from pathlib import Path
from fastapi import APIRouter
from fastapi.responses import JSONResponse
from pydantic import BaseModel

from rag.retrieval import get_retriever
from llm.service import get_llm_service
from translate.service import translate_text, LANG_CODES

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/chat", tags=["chat"])

DATA_DIR = Path(__file__).resolve().parents[2] / "data"


def _load(filename: str) -> dict:
    with open(DATA_DIR / filename, encoding="utf-8") as f:
        return json.load(f)


ALL_DATA = {
    "standards": _load("bis_standards.json").get("standards", []),
    "services": _load("bis_services.json").get("services", []),
    "cert_rules": _load("certification_rules.json").get("certification_rules", []),
    "hallmarking": _load("hallmarking.json").get("hallmarking", []),
    "consumer": _load("consumer_services.json").get("consumer_services", []),
    "faqs": _load("faq.json").get("faqs", []),
}


def _search(query: str, records: list[dict], search_fields: list[str]) -> list[dict]:
    q = query.lower()
    scored = []
    for r in records:
        text = " ".join(
            str(r.get(f, "")) for f in search_fields
        ).lower()
        if any(w in text for w in q.split() if len(w) >= 3):
            score = sum(text.count(w.lower()) for w in q.split() if len(w) >= 3)
            scored.append((score, r))
    scored.sort(key=lambda x: x[0], reverse=True)
    return [r for _, r in scored]


PATTERNS = [
    {
        "keywords": ["certification", "certify", "certified", "isi mark", "isi", "mark", "license", "license required"],
        "handler": "handle_certification",
    },
    {
        "keywords": ["crs", "compulsory registration", "register", "registration", "electronics", "led", "mobile", "it product"],
        "handler": "handle_crs",
    },
    {
        "keywords": ["hallmark", "hallmarking", "gold", "silver", "jewel", "purity", "karat", "carat", "fineness"],
        "handler": "handle_hallmarking",
    },
    {
        "keywords": ["complaint", "grievance", "fake", "counterfeit", "report", "enforcement"],
        "handler": "handle_complaint",
    },
    {
        "keywords": ["search", "find", "standard", "is code", "is number", "browse"],
        "handler": "handle_search",
    },
    {
        "keywords": ["document", "required document", "what do i need", "papers", "application form"],
        "handler": "handle_documents",
    },
    {
        "keywords": ["consumer", "customer", "individual", "person"],
        "handler": "handle_consumer",
    },
    {
        "keywords": ["foreign", "import", "export", "overseas", "outside india", "fmcs"],
        "handler": "handle_foreign",
    },
    {
        "keywords": ["what is bis", "about bis", "who is bis", "bis stand for", "bis do"],
        "handler": "handle_about_bis",
    },
    {
        "keywords": ["process", "step", "how to", "apply", "procedure"],
        "handler": "handle_process",
    },
]


def _match_pattern(query: str) -> str | None:
    q = query.lower()
    best_handler = None
    best_score = 0
    for p in PATTERNS:
        score = sum(1 for kw in p["keywords"] if kw in q)
        if score > best_score:
            best_score = score
            best_handler = p["handler"]
    return best_handler if best_score > 0 else None


def _fmt_standards(stds: list[dict], limit: int = 3) -> str:
    lines = []
    for s in stds[:limit]:
        lines.append(f"  - **{s.get('standard_number', 'N/A')}**: {s.get('title', '')}")
    return "\n".join(lines) if lines else "  No specific standards found in our database for this query."


def _fmt_services(svcs: list[dict], limit: int = 2) -> str:
    lines = []
    for s in svcs[:limit]:
        lines.append(f"  - **{s.get('name', 'N/A')}**: {s.get('description', '')[:120]}...")
    return "\n".join(lines) if lines else ""


def handle_about_bis(query: str, user_type: str) -> dict:
    faq = next((f for f in ALL_DATA["faqs"] if "what is bis" in f.get("question", "").lower()), None)
    answer = faq["answer"] if faq else (
        "The Bureau of Indian Standards (BIS) is the national standards body of India, "
        "established under the Bureau of Indian Standards Act, 1986. BIS develops Indian Standards, "
        "operates product certification schemes, and administers hallmarking of precious metals."
    )
    return {
        "response": f"**What is BIS?**\n\n{answer}\n\nFor more details, visit [bis.gov.in](https://www.bis.gov.in).",
        "sources": [{"type": "faq", "title": faq["question"] if faq else "General BIS information"}],
        "suggested_questions": [
            "What BIS certification is required for my product?",
            "Explain hallmarking.",
            "How can a consumer file a complaint?",
        ],
    }


def handle_certification(query: str, user_type: str) -> dict:
    stds = _search(query, ALL_DATA["standards"], ["title", "description", "keywords"])
    svcs = _search(query, ALL_DATA["services"], ["name", "description", "keywords"])
    rules = _search(query, ALL_DATA["cert_rules"], ["title", "description", "applicable_products", "keywords"])

    parts = ["**BIS Product Certification**\n"]
    parts.append("BIS offers several product certification schemes:\n")
    parts.append("1. **Scheme I (ISI Mark)** — For domestic and foreign manufacturers. Products tested and certified by BIS bear the ISI mark.")
    parts.append("2. **Compulsory Registration Scheme (CRS)** — Mandatory for electronics and IT products. Products bear the IS logo with R-number.")
    parts.append("3. **Foreign Manufacturers Certification Scheme (FMCS)** — For overseas manufacturers.\n")

    if svcs:
        parts.append("**Related BIS Services:**")
        parts.append(_fmt_services(svcs))

    if rules:
        parts.append("\n**Applicable Certification Rules:**")
        for r in rules[:2]:
            parts.append(f"  - **{r.get('title', '')}**: {r.get('description', '')[:150]}...")

    parts.append("\nTo apply, visit your nearest BIS Branch Office or apply online at bis.gov.in.")

    sources = [{"type": "service", "title": s.get("name", "")} for s in svcs[:2]]
    sources += [{"type": "cert_rule", "title": r.get("title", "")} for r in rules[:2]]

    return {
        "response": "\n\n".join(parts),
        "sources": sources,
        "suggested_questions": [
            "What documents are required for certification?",
            "How do I search Indian Standards?",
            "Which BIS requirements should I check for my product?",
        ],
    }


def handle_crs(query: str, user_type: str) -> dict:
    crs_svc = next((s for s in ALL_DATA["services"] if "CRS" in s.get("name", "")), None)
    stds = _search(query, ALL_DATA["standards"], ["title", "description", "keywords"])

    parts = ["**Compulsory Registration Scheme (CRS)**\n"]
    parts.append("CRS is a government-mandated registration program for specified electronics and IT products.\n")
    parts.append("**Key Points:**")
    parts.append("- Manufacturers and importers must register products with BIS before selling in India")
    parts.append("- Products must bear the BIS standard mark (IS logo with R-number)")
    parts.append("- Notified by the Ministry of Electronics and Information Technology (MeitY)")
    parts.append("- Covers LED bulbs, mobile phones, laptops, power adapters, and more\n")

    if crs_svc:
        parts.append(f"**BIS Service:** {crs_svc.get('name', '')}\n")
        parts.append("**Required Documents:**")
        for doc in crs_svc.get("required_documents", [])[:5]:
            parts.append(f"  - {doc}")

        parts.append("\n**Process Steps:**")
        for i, step in enumerate(crs_svc.get("process_steps", []), 1):
            parts.append(f"  {i}. {step}")

    if stds:
        parts.append("\n**Applicable Standards:**")
        parts.append(_fmt_standards(stds))

    sources = [{"type": "service", "title": crs_svc["name"]}] if crs_svc else []
    sources += [{"type": "standard", "title": s.get("standard_number", "")} for s in stds[:2]]

    return {
        "response": "\n\n".join(parts),
        "sources": sources,
        "suggested_questions": [
            "What documents are required for certification?",
            "What BIS certification is required for my product?",
            "How can a consumer file a complaint?",
        ],
    }


def handle_hallmarking(query: str, user_type: str) -> dict:
    hm_data = ALL_DATA["hallmarking"]
    hm_faq = next((f for f in ALL_DATA["faqs"] if "hallmark" in f.get("question", "").lower()), None)

    parts = ["**BIS Hallmarking of Gold and Silver**\n"]

    if hm_faq:
        parts.append(hm_faq["answer"] + "\n")

    gold_hm = next((h for h in hm_data if "Gold" in h.get("title", "")), None)
    if gold_hm:
        parts.append("**Gold Purity Grades:**")
        for g in gold_hm.get("purity_grades", []):
            parts.append(f"  - **{g['grade']}** (Fineness {g['fineness']}) — {g['percentage']}")
        parts.append(f"\n**Verification:** {gold_hm.get('verification_method', 'Use the BIS Care mobile app.')}")

    silver_hm = next((h for h in hm_data if "Silver" in h.get("title", "")), None)
    if silver_hm:
        parts.append("\n**Silver Purity Grades:**")
        for g in silver_hm.get("purity_grades", []):
            parts.append(f"  - **{g['grade']}** (Fineness {g['fineness']}) — {g['percentage']}")

    marks_hm = next((h for h in hm_data if "Marks" in h.get("title", "")), None)
    if marks_hm:
        parts.append("\n**Three Marks on Hallmarked Article:**")
        for m in marks_hm.get("marks_on_article", []):
            parts.append(f"  - **{m['mark']}**: {m['description'][:100]}")

    parts.append("\nYou can verify any hallmark using the **BIS Care** mobile app.")

    sources = [{"type": "hallmarking", "title": h.get("title", "")} for h in hm_data[:2]]
    if hm_faq:
        sources.append({"type": "faq", "title": hm_faq["question"]})

    return {
        "response": "\n\n".join(parts),
        "sources": sources,
        "suggested_questions": [
            "What is BIS?",
            "What BIS certification is required for my product?",
            "How can a consumer file a complaint?",
        ],
    }


def handle_complaint(query: str, user_type: str) -> dict:
    complaint_svc = next((s for s in ALL_DATA["services"] if "Complaint" in s.get("name", "")), None)
    cs_svc = next((s for s in ALL_DATA["consumer"] if "Complaint" in s.get("title", "")), None)

    parts = ["**Filing a Complaint with BIS**\n"]
    parts.append("If you encounter products with fake BIS marks, non-certified products, or quality issues, you can report through multiple channels:\n")

    if cs_svc:
        parts.append("**How to Access:**")
        for step in cs_svc.get("how_to_access", []):
            parts.append(f"  - {step}")
        parts.append("\n**Information Needed:**")
        for info in cs_svc.get("required_information", []):
            parts.append(f"  - {info}")

    if complaint_svc:
        parts.append("\n**BIS Complaint Process:**")
        for i, step in enumerate(complaint_svc.get("process_steps", []), 1):
            parts.append(f"  {i}. {step}")

    parts.append("\n**Quick Options:**")
    parts.append("  - Use the **BIS Care** mobile app to report instantly")
    parts.append("  - Visit the nearest BIS Regional Office")
    parts.append("  - File online at bis.gov.in")

    sources = []
    if cs_svc:
        sources.append({"type": "consumer_service", "title": cs_svc.get("title", "")})
    if complaint_svc:
        sources.append({"type": "service", "title": complaint_svc.get("name", "")})

    return {
        "response": "\n\n".join(parts),
        "sources": sources,
        "suggested_questions": [
            "What is BIS?",
            "Explain hallmarking.",
            "What BIS certification is required for my product?",
        ],
    }


def handle_search(query: str, user_type: str) -> dict:
    stds = _search(query, ALL_DATA["standards"], ["title", "description", "keywords", "standard_number"])

    parts = ["**Searching Indian Standards**\n"]
    parts.append("You can search Indian Standards in multiple ways:\n")
    parts.append("1. **Use this chat** — Ask me about any standard or topic")
    parts.append("2. **Standards Search page** — Browse the full database with filters")
    parts.append("3. **BIS website** — Visit bis.gov.in/standards for the official catalogue\n")

    if stds:
        parts.append("**Standards found matching your query:**")
        parts.append(_fmt_standards(stds))
    else:
        parts.append("No specific standards found for your query. Try broader terms like 'cement', 'LED', 'steel', or 'solar'.")

    sources = [{"type": "standard", "title": s.get("standard_number", "")} for s in stds[:3]]

    return {
        "response": "\n\n".join(parts),
        "sources": sources,
        "suggested_questions": [
            "What BIS certification is required for my product?",
            "What documents are required for certification?",
            "Explain hallmarking.",
        ],
    }


def handle_documents(query: str, user_type: str) -> dict:
    parts = ["**Documents Required for BIS Certification**\n"]
    parts.append("The exact documents depend on the certification scheme, but generally include:\n")

    parts.append("**For Scheme I (ISI Mark):**")
    parts.append("  - Application form (prescribed BIS format)")
    parts.append("  - Manufacturing process flow diagram")
    parts.append("  - Quality management system documentation")
    parts.append("  - Test reports from BIS-recognised laboratory")
    parts.append("  - Factory layout and machinery list")
    parts.append("  - Raw material procurement details")
    parts.append("  - Authorization letter (for agents)\n")

    parts.append("**For CRS Registration:**")
    parts.append("  - Online CRS application via BIS portal")
    parts.append("  - Test reports from BIS-recognised laboratory")
    parts.append("  - Manufacturer declaration of conformity")
    parts.append("  - Product specifications and photographs")
    parts.append("  - Authorised Indian Representative (AIR) details (for foreign manufacturers)\n")

    parts.append("**Tip:** Start with product testing at a BIS-recognised laboratory. The test report is the most critical document for any certification path.")

    faq = next((f for f in ALL_DATA["faqs"] if "how do i apply" in f.get("question", "").lower()), None)
    sources = []
    if faq:
        sources.append({"type": "faq", "title": faq["question"]})

    return {
        "response": "\n\n".join(parts),
        "sources": sources,
        "suggested_questions": [
            "What BIS certification is required for my product?",
            "How do I search Indian Standards?",
            "Which BIS requirements should I check for my product?",
        ],
    }


def handle_consumer(query: str, user_type: str) -> dict:
    parts = ["**BIS Services for Consumers**\n"]
    parts.append("As a consumer, BIS provides several services to help you:\n")

    for cs in ALL_DATA["consumer"]:
        parts.append(f"**{cs.get('title', '')}**")
        parts.append(f"  {cs.get('description', '')[:150]}\n")

    parts.append("**Quick Tip:** Use the **BIS Care** app to verify hallmarks and check product certifications on the go.")

    sources = [{"type": "consumer_service", "title": cs.get("title", "")} for cs in ALL_DATA["consumer"][:3]]

    return {
        "response": "\n\n".join(parts),
        "sources": sources,
        "suggested_questions": [
            "How can a consumer file a complaint?",
            "Explain hallmarking.",
            "What is BIS?",
        ],
    }


def handle_foreign(query: str, user_type: str) -> dict:
    fmcs_svc = next((s for s in ALL_DATA["services"] if "FMCS" in s.get("name", "")), None)

    parts = ["**BIS Certification for Foreign Manufacturers / Importers**\n"]
    parts.append("Foreign manufacturers can obtain BIS certification through the **Foreign Manufacturers Certification Scheme (FMCS)**.\n")

    if fmcs_svc:
        parts.append(f"**{fmcs_svc.get('name', '')}**\n")
        parts.append(fmcs_svc.get("description", "") + "\n")
        parts.append("**Required Documents:**")
        for doc in fmcs_svc.get("required_documents", [])[:6]:
            parts.append(f"  - {doc}")
        parts.append("\n**Process Steps:**")
        for i, step in enumerate(fmcs_svc.get("process_steps", []), 1):
            parts.append(f"  {i}. {step}")
        parts.append("\n**Key Requirement:** You must appoint an **Authorised Indian Representative (AIR)** before applying.")

    sources = [{"type": "service", "title": fmcs_svc["name"]}] if fmcs_svc else []

    return {
        "response": "\n\n".join(parts),
        "sources": sources,
        "suggested_questions": [
            "What documents are required for certification?",
            "What BIS certification is required for my product?",
            "How do I search Indian Standards?",
        ],
    }


def handle_process(query: str, user_type: str) -> dict:
    parts = ["**BIS Certification Process Overview**\n"]
    parts.append("The general process for obtaining BIS certification involves:\n")
    parts.append("1. **Identify Applicable Standard** — Determine which Indian Standard (IS code) applies to your product")
    parts.append("2. **Product Testing** — Get your product tested at a BIS-recognised laboratory")
    parts.append("3. **Prepare Documents** — Gather all required documentation (application form, process flow, QMS docs, etc.)")
    parts.append("4. **Submit Application** — Apply to the relevant BIS Branch Office or via the BIS online portal")
    parts.append("5. **Factory Inspection** — BIS officers inspect your manufacturing facility")
    parts.append("6. **License Granted** — If all requirements are met, BIS grants the certification license")
    parts.append("7. **Surveillance** — Periodic audits and renewal as per BIS schedule\n")

    parts.append("**For electronics/IT products:** Use the CRS registration path instead, which involves lab testing and online portal registration.\n")

    parts.append("Need help? Use the **Check My Product** tool on the dashboard for a detailed compliance assessment.")

    sources = []
    return {
        "response": "\n\n".join(parts),
        "sources": sources,
        "suggested_questions": [
            "What documents are required for certification?",
            "Which BIS requirements should I check for my product?",
            "What BIS certification is required for my product?",
        ],
    }


def handle_product_requirements(query: str, user_type: str) -> dict:
    stds = _search(query, ALL_DATA["standards"], ["title", "description", "keywords"])
    rules = _search(query, ALL_DATA["cert_rules"], ["title", "description", "applicable_products", "keywords"])
    svcs = _search(query, ALL_DATA["services"], ["name", "description", "keywords"])

    parts = ["**BIS Requirements for Your Product**\n"]
    parts.append("Here's what I found based on your query:\n")

    if rules:
        parts.append("**Certification Requirements:**")
        for r in rules[:2]:
            parts.append(f"  - **{r.get('title', '')}**: {r.get('description', '')[:150]}...")
            if r.get("compliance_requirements"):
                parts.append("    Requirements:")
                for req in r["compliance_requirements"][:3]:
                    parts.append(f"      - {req}")
        parts.append("")

    if stds:
        parts.append("**Applicable Standards:**")
        parts.append(_fmt_standards(stds))

    if svcs:
        parts.append("\n**Related BIS Services:**")
        parts.append(_fmt_services(svcs, 2))

    if not rules and not stds:
        parts.append("I couldn't find specific requirements for your product in the current database.")
        parts.append("Please try the **Check My Product** tool for a more detailed analysis, or provide more details about your product.")

    sources = [{"type": "standard", "title": s.get("standard_number", "")} for s in stds[:2]]
    sources += [{"type": "cert_rule", "title": r.get("title", "")} for r in rules[:2]]

    return {
        "response": "\n\n".join(parts),
        "sources": sources,
        "suggested_questions": [
            "What documents are required for certification?",
            "How do I search Indian Standards?",
            "How can a consumer file a complaint?",
        ],
    }


def _handle_query(query: str, user_type: str) -> dict:
    handler_name = _match_pattern(query)

    INTENT_LABELS = {
        "handle_about_bis": "About BIS",
        "handle_certification": "Product Certification",
        "handle_crs": "Compulsory Registration (CRS)",
        "handle_hallmarking": "Hallmarking",
        "handle_complaint": "Consumer Complaint",
        "handle_search": "Standards Search",
        "handle_documents": "Required Documents",
        "handle_consumer": "Consumer Services",
        "handle_foreign": "Foreign Manufacturer Certification",
        "handle_process": "Certification Process",
    }

    if handler_name:
        handler_map = {
            "handle_certification": handle_certification,
            "handle_crs": handle_crs,
            "handle_hallmarking": handle_hallmarking,
            "handle_complaint": handle_complaint,
            "handle_search": handle_search,
            "handle_documents": handle_documents,
            "handle_consumer": handle_consumer,
            "handle_foreign": handle_foreign,
            "handle_about_bis": handle_about_bis,
            "handle_process": handle_process,
        }
        handler = handler_map.get(handler_name)
        if handler:
            result = handler(query, user_type)
            result["_intent"] = INTENT_LABELS.get(handler_name, "General Query")
            return result

    result = handle_product_requirements(query, user_type)
    result["_intent"] = "Product Requirements Analysis"
    return result


class ChatRequest(BaseModel):
    message: str
    user_type: str = "consumer"
    language: str = "en"


def _rag_enhance(query: str, rule_result: dict) -> dict:
    """Enhance rule-based results with RAG retrieval context."""
    try:
        retriever = get_retriever()
        if not retriever.is_ready:
            return rule_result

        rag_results = retriever.retrieve(query, top_k=5)
        rag_sources = retriever.get_source_attribution(query, top_k=5)

        if not rag_results:
            return rule_result

        existing_sources = {(s.get("type", ""), s.get("title", "")) for s in rule_result.get("sources", [])}
        for rs in rag_sources:
            key = (rs["type"], rs["title"])
            if key not in existing_sources:
                rule_result.setdefault("sources", []).append({
                    "type": rs["type"],
                    "title": rs["title"],
                    "rag_score": rs["score"],
                })

        rag_context = retriever.build_context(query, max_tokens=1500)
        rule_result["_rag_context"] = rag_context
        rule_result["_rag_backend"] = retriever.backend
        rule_result["_rag_doc_count"] = retriever.document_count
        rule_result["_rag_retrieved_count"] = len(rag_results)

        source_types = list({r.document.source_type for r in rag_results})
        rule_result["_rag_source_types"] = source_types

        SOURCE_TYPE_FILES = {
            "standard": "bis_standards.json",
            "service": "bis_services.json",
            "cert_rule": "certification_rules.json",
            "hallmarking": "hallmarking.json",
            "consumer_service": "consumer_services.json",
            "faq": "faq.json",
        }
        rule_result["_rag_source_files"] = sorted({
            SOURCE_TYPE_FILES[st] for st in source_types if st in SOURCE_TYPE_FILES
        })

        return rule_result
    except Exception as e:
        logger.warning(f"RAG enhancement failed: {e}")
        return rule_result


@router.get("/rag/status")
def rag_status():
    """Check RAG system status."""
    try:
        retriever = get_retriever()
        return {
            "status": "ready" if retriever.is_ready else "initializing",
            "backend": retriever.backend,
            "document_count": retriever.document_count,
        }
    except Exception as e:
        return {"status": "error", "error": str(e)}


@router.get("/llm/status")
def llm_status():
    """Check LLM integration status."""
    llm = get_llm_service()
    return {
        "enabled": llm.enabled,
        "model": llm.model if llm.enabled else None,
        "base_url": llm.base_url if llm.enabled else None,
        "status": "active" if llm.enabled else "disabled — set LLM_API_KEY to enable",
    }


@router.post("")
def chat(req: ChatRequest):
    msg = req.message.strip()
    if not msg:
        return JSONResponse(status_code=400, content={"error": "Message cannot be empty."})

    lang = req.language if req.language in LANG_CODES else "en"

    query_for_processing = msg
    if lang != "en":
        query_for_processing = translate_text(msg, lang, "en")

    rule_result = _handle_query(query_for_processing, req.user_type)
    rule_result = _rag_enhance(query_for_processing, rule_result)

    llm_info = {"attempted": False, "used": False, "fallback": False}
    llm_service = get_llm_service()

    if llm_service.enabled:
        llm_info["attempted"] = True
        rag_context = rule_result.get("_rag_context", "")

        llm_response = llm_service.generate(
            user_query=query_for_processing,
            rag_context=rag_context,
            user_type=req.user_type,
        )

        if llm_response:
            llm_info["used"] = True
            rule_result["response"] = llm_response
        else:
            llm_info["fallback"] = True
            logger.info("LLM generation failed — using rule-based response")

    rag_info = {}
    if "_rag_backend" in rule_result:
        rag_info = {
            "retrieval_backend": rule_result.pop("_rag_backend"),
            "documents_indexed": rule_result.pop("_rag_doc_count", 0),
        }
        rule_result.pop("_rag_context", None)

    user_intent = rule_result.pop("_intent", "General Query")
    rag_retrieved = rule_result.pop("_rag_retrieved_count", 0)
    rag_source_types = rule_result.pop("_rag_source_types", [])
    rag_source_files = rule_result.pop("_rag_source_files", [])

    matched_items = []
    for src in rule_result.get("sources", [])[:5]:
        matched_items.append({
            "type": src.get("type", ""),
            "title": src.get("title", ""),
        })

    response_method = "rule-based"
    if llm_info.get("used"):
        response_method = "LLM-generated"
    elif llm_info.get("fallback"):
        response_method = "rule-based (LLM unavailable)"

    intent_summary = (
        f"Your query matched {rag_retrieved} knowledge-base record"
        f"{'s' if rag_retrieved != 1 else ''}"
    )
    if rag_source_types:
        type_labels = {
            "standard": "standards",
            "service": "BIS services",
            "cert_rule": "certification rules",
            "hallmarking": "hallmarking",
            "consumer_service": "consumer services",
            "faq": "FAQs",
        }
        labels = [type_labels.get(t, t) for t in rag_source_types]
        if len(labels) == 1:
            intent_summary += f" related to {labels[0]}."
        else:
            intent_summary += f" across {', '.join(labels[:-1])} and {labels[-1]}."
    else:
        intent_summary += "."

    traceability = {
        "user_intent": user_intent,
        "retrieved_knowledge": {
            "count": rag_retrieved,
            "source_types": rag_source_types,
            "source_files": rag_source_files,
        },
        "matched_items": matched_items,
        "response_method": response_method,
        "summary": intent_summary,
    }

    response_text = rule_result["response"]
    if lang != "en":
        response_text = translate_text(response_text, "en", lang)

    return {
        "user_message": msg,
        "user_type": req.user_type,
        "language": lang,
        "response": response_text,
        "sources": rule_result.get("sources", []),
        "suggested_questions": rule_result.get("suggested_questions", []),
        "rag_info": rag_info,
        "llm_info": llm_info,
        "traceability": traceability,
        "disclaimer": "This is an informational prototype response generated from a demo knowledge base. Always verify requirements through official BIS channels at bis.gov.in.",
    }
