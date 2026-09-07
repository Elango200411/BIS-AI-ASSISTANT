"""
Retrieval module: processes queries and retrieves relevant context from the knowledge base.
Integrates ingestion and embeddings into a single search pipeline.
"""

import re
import logging
from dataclasses import dataclass

from .ingestion import Document, load_all_documents
from .embeddings import EmbeddingEngine

logger = logging.getLogger(__name__)


@dataclass
class RetrievalResult:
    document: Document
    score: float


class RAGRetriever:
    """Search pipeline: ingest -> index -> retrieve."""

    def __init__(self):
        self.documents: list[Document] = []
        self.engine: EmbeddingEngine | None = None
        self._ready = False

    def initialize(self):
        """Load documents and build the index. Call once at startup."""
        self.documents = load_all_documents()
        logger.info(f"Loaded {len(self.documents)} documents")

        texts = [d.content for d in self.documents]
        self.engine = EmbeddingEngine()
        self.engine.fit(texts)

        self._ready = True
        logger.info(f"RAG index ready (backend: {self.engine.backend})")

    @property
    def is_ready(self) -> bool:
        return self._ready

    @property
    def backend(self) -> str:
        return self.engine.backend if self.engine else "none"

    @property
    def document_count(self) -> int:
        return len(self.documents)

    def _expand_query(self, query: str) -> str:
        """Expand short queries with synonyms to improve recall."""
        expansions = {
            "bis": "BIS Bureau of Indian Standards",
            "crs": "CRS Compulsory Registration Scheme electronics",
            "fmcs": "FMCS Foreign Manufacturers Certification Scheme",
            "isi": "ISI mark certification product",
            "hallmark": "hallmarking gold silver purity fineness",
            "complaint": "complaint grievance report enforcement",
            "led": "LED bulb lighting electrical",
            "cement": "cement OPC Portland building",
            "steel": "steel reinforcement rebar Fe500",
            "solar": "solar photovoltaic PV renewable energy",
            "toys": "toys children safety consumer product",
            "water": "water heater drinking packaged",
        }
        words = query.lower().split()
        expanded = []
        for w in words:
            expanded.append(w)
            if w in expansions:
                expanded.append(expansions[w])
        return " ".join(expanded)

    def _keyword_boost(self, query: str, doc: Document) -> float:
        """Additional keyword overlap score for boosting."""
        q_tokens = set(re.findall(r'\b[a-z0-9]{2,}\b', query.lower()))
        d_tokens = set(re.findall(r'\b[a-z0-9]{2,}\b', doc.content.lower()))
        if not q_tokens:
            return 0.0
        overlap = q_tokens.intersection(d_tokens)
        return len(overlap) / len(q_tokens)

    def retrieve(self, query: str, top_k: int = 8) -> list[RetrievalResult]:
        """Search the knowledge base and return ranked results."""
        if not self._ready:
            logger.warning("RAG retriever not initialized")
            return []

        expanded = self._expand_query(query)
        raw_results = self.engine.query(expanded, top_k=top_k * 2)

        results = []
        seen_ids = set()
        for idx, emb_score in raw_results:
            doc = self.documents[idx]
            if doc.source_id in seen_ids:
                continue
            seen_ids.add(doc.source_id)

            kw_boost = self._keyword_boost(query, doc)
            combined = (emb_score * 0.7) + (kw_boost * 0.3)

            results.append(RetrievalResult(document=doc, score=combined))

        results.sort(key=lambda r: r.score, reverse=True)
        return results[:top_k]

    def retrieve_by_source_type(self, query: str, source_type: str, top_k: int = 5) -> list[RetrievalResult]:
        """Retrieve results filtered to a specific source type."""
        all_results = self.retrieve(query, top_k=top_k * 5)
        filtered = [r for r in all_results if r.document.source_type == source_type]
        return filtered[:top_k]

    def build_context(self, query: str, max_tokens: int = 2000) -> str:
        """Build a context string for LLM generation from retrieved documents."""
        results = self.retrieve(query, top_k=6)
        if not results:
            return "No relevant information found in the knowledge base."

        context_parts = []
        current_len = 0

        for r in results:
            chunk = f"[{r.document.source_type.upper()}] {r.document.title}: {r.document.content}"
            if current_len + len(chunk) > max_tokens:
                break
            context_parts.append(chunk)
            current_len += len(chunk)

        return "\n\n".join(context_parts)

    def get_source_attribution(self, query: str, top_k: int = 5) -> list[dict]:
        """Return source attribution metadata for UI display."""
        results = self.retrieve(query, top_k=top_k)
        return [
            {
                "type": r.document.source_type,
                "id": r.document.source_id,
                "title": r.document.title,
                "score": round(r.score, 3),
                "metadata": r.document.metadata,
            }
            for r in results
        ]


_retriever: RAGRetriever | None = None


def get_retriever() -> RAGRetriever:
    """Singleton retriever instance."""
    global _retriever
    if _retriever is None:
        _retriever = RAGRetriever()
        _retriever.initialize()
    return _retriever
