"""
Structured prompt templates for the BIS Sahayak AI.

Each prompt instructs the LLM to return a well-formatted Markdown response
with the exact sections the frontend expects.
"""

SYSTEM_PROMPT = """You are BIS Sahayak AI — an expert assistant on Bureau of Indian Standards (BIS), product certification, hallmarking, and consumer services in India.

RULES:
- Answer ONLY based on the provided context. Do NOT invent facts.
- If context does not contain enough information, say so clearly.
- Always include a disclaimer that this is prototype/demo information.
- Keep answers concise and actionable.
- Use Markdown formatting.
- Always mention specific IS codes, BIS services, and documents when found in context."""


def build_rag_prompt(user_query: str, rag_context: str, user_type: str = "consumer") -> str:
    """Build the full user prompt with structured output instructions."""

    return f"""Based on the following BIS knowledge base context, answer the user's question.

CONTEXT FROM KNOWLEDGE BASE:
---
{rag_context}
---

USER QUESTION: {user_query}
USER TYPE: {user_type}

Respond with EXACTLY these Markdown sections (include a section only if relevant information was found):

### Answer
A clear, simple explanation of the answer. Use plain language. 2-4 sentences.

### Relevant Standard
List any specific IS codes or BIS standards found in the context. If none found, omit this section entirely.

### BIS Service
Name the specific BIS service(s) relevant to the question. If none found, omit this section.

### Required Documents
List any documents mentioned in the context for this type of request. If none found, omit this section.

### Next Steps
Give 2-4 actionable steps the user should take. Keep them specific and practical.

### Sources
List only the actual source titles from the context, formatted as bullet points.

---

IMPORTANT:
- Omit any section that has no relevant information in the context.
- Do NOT fabricate standards, services, or documents not present in the context.
- Include the disclaimer at the end.
"""


def build_no_context_prompt(user_query: str, user_type: str) -> str:
    """Prompt when no RAG context is available."""

    return f"""The user asked: {user_query}
User type: {user_type}

No relevant information was found in the BIS knowledge base for this query.

Respond by:
1. Acknowledging you don't have specific information for this query.
2. Suggesting the user try rephrasing or asking about a specific topic.
3. Listing some topics you CAN help with (BIS certification, hallmarking, consumer complaints, Indian Standards).
4. Including the standard disclaimer.
"""
