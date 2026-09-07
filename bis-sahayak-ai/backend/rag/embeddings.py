"""
Embeddings module with automatic fallback strategy:
1. sentence-transformers (if available)
2. TF-IDF via scikit-learn (primary fallback)
3. Simple keyword overlap (emergency fallback)
"""

import re
import logging

logger = logging.getLogger(__name__)

try:
    from sentence_transformers import SentenceTransformer
    _HAS_SBERT = True
except ImportError:
    _HAS_SBERT = False

try:
    from sklearn.feature_extraction.text import TfidfVectorizer
    from sklearn.metrics.pairwise import cosine_similarity
    import numpy as np
    _HAS_TFIDF = True
except ImportError:
    _HAS_TFIDF = False


def _tokenize(text: str) -> list[str]:
    return re.findall(r'\b[a-z0-9]{2,}\b', text.lower())


class EmbeddingEngine:
    """Unified embedding interface with automatic backend selection."""

    def __init__(self):
        self.backend = None
        self._vectorizer = None
        self._matrix = None
        self._model = None

        if _HAS_SBERT:
            try:
                self._model = SentenceTransformer("all-MiniLM-L6-v2")
                self.backend = "sentence-transformers"
                logger.info("Using sentence-transformers for embeddings")
            except Exception:
                pass

        if self.backend is None and _HAS_TFIDF:
            self.backend = "tfidf"
            logger.info("Using TF-IDF for embeddings")

        if self.backend is None:
            self.backend = "keyword"
            logger.info("Using keyword overlap for embeddings")

    def fit(self, documents: list[str]):
        """Build the index from a list of document strings."""
        if self.backend == "sentence-transformers":
            self._matrix = self._model.encode(documents, show_progress_bar=False)
        elif self.backend == "tfidf":
            self._vectorizer = TfidfVectorizer(
                max_features=10000,
                stop_words="english",
                ngram_range=(1, 2),
                sublinear_tf=True,
            )
            self._matrix = self._vectorizer.fit_transform(documents)
        else:
            self._documents = documents
            self._doc_tokens = [_tokenize(d) for d in documents]

    def query(self, text: str, top_k: int = 10) -> list[tuple[int, float]]:
        """Return list of (index, score) tuples sorted by relevance descending."""
        if self.backend == "sentence-transformers":
            q_vec = self._model.encode([text])
            sims = cosine_similarity(q_vec, self._matrix)[0]
            top_idx = np.argsort(sims)[::-1][:top_k]
            return [(int(i), float(sims[i])) for i in top_idx if sims[i] > 0]

        elif self.backend == "tfidf":
            q_vec = self._vectorizer.transform([text])
            sims = cosine_similarity(q_vec, self._matrix)[0]
            top_idx = np.argsort(sims)[::-1][:top_k]
            return [(int(i), float(sims[i])) for i in top_idx if sims[i] > 0]

        else:
            q_tokens = set(_tokenize(text))
            if not q_tokens:
                return []
            scored = []
            for i, doc_toks in enumerate(self._doc_tokens):
                overlap = q_tokens.intersection(doc_toks)
                if overlap:
                    score = len(overlap) / len(q_tokens)
                    scored.append((i, score))
            scored.sort(key=lambda x: x[1], reverse=True)
            return scored[:top_k]
