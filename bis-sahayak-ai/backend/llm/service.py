"""
LLM Service — optional LLM integration with automatic fallback.

Supports any OpenAI-compatible API (OpenAI, Azure, Anthropic via proxy,
local models via Ollama/LM Studio, etc.).

Configuration via environment variables:
  LLM_API_KEY  — API key (if missing, LLM is disabled)
  LLM_MODEL    — Model name (default: gpt-4o-mini)
  LLM_BASE_URL — API base URL (default: https://api.openai.com/v1)

If LLM_API_KEY is missing or the API call fails at any point,
the system falls back gracefully to rule-based responses.
"""

import os
import json
import logging
import httpx
from typing import Optional

from .prompts import SYSTEM_PROMPT, build_rag_prompt, build_no_context_prompt

logger = logging.getLogger(__name__)

LLM_API_KEY = os.getenv("LLM_API_KEY", "")
LLM_MODEL = os.getenv("LLM_MODEL", "gpt-4o-mini")
LLM_BASE_URL = os.getenv("LLM_BASE_URL", "https://api.openai.com/v1").rstrip("/")

_TIMEOUT = httpx.Timeout(30.0, connect=10.0)


class LLMService:
    """Thin wrapper around an OpenAI-compatible chat completions API."""

    def __init__(self):
        self.enabled = bool(LLM_API_KEY)
        self.model = LLM_MODEL
        self.base_url = LLM_BASE_URL

        if self.enabled:
            logger.info(f"LLM enabled — model={self.model}, base={self.base_url}")
        else:
            logger.info("LLM disabled — LLM_API_KEY not set. Using rule-based fallback.")

    def generate(
        self,
        user_query: str,
        rag_context: str = "",
        user_type: str = "consumer",
    ) -> Optional[str]:
        """
        Call the LLM and return the response text.
        Returns None on any failure (caller should fall back to rule-based).
        """
        if not self.enabled:
            return None

        if rag_context:
            user_message = build_rag_prompt(user_query, rag_context, user_type)
        else:
            user_message = build_no_context_prompt(user_query, user_type)

        payload = {
            "model": self.model,
            "messages": [
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "user", "content": user_message},
            ],
            "temperature": 0.3,
            "max_tokens": 1200,
        }

        headers = {
            "Authorization": f"Bearer {LLM_API_KEY}",
            "Content-Type": "application/json",
        }

        try:
            with httpx.Client(timeout=_TIMEOUT) as client:
                resp = client.post(
                    f"{self.base_url}/chat/completions",
                    json=payload,
                    headers=headers,
                )
                resp.raise_for_status()
                data = resp.json()

            content = (
                data.get("choices", [{}])[0]
                .get("message", {})
                .get("content", "")
            )
            if not content:
                logger.warning("LLM returned empty content")
                return None

            return content.strip()

        except httpx.TimeoutException:
            logger.warning("LLM API timed out — falling back to rule-based")
            return None
        except httpx.HTTPStatusError as e:
            logger.warning(f"LLM API HTTP error {e.response.status_code} — falling back")
            return None
        except Exception as e:
            logger.warning(f"LLM API error: {e} — falling back to rule-based")
            return None


_llm_service: Optional[LLMService] = None


def get_llm_service() -> LLMService:
    """Singleton LLM service instance."""
    global _llm_service
    if _llm_service is None:
        _llm_service = LLMService()
    return _llm_service
