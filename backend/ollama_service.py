"""
Ollama service – handles communication with the local Ollama LLM.
"""

import os
import re
import httpx
from dotenv import load_dotenv

load_dotenv()

OLLAMA_BASE_URL = os.getenv("OLLAMA_BASE_URL", "http://localhost:11434")
OLLAMA_MODEL = os.getenv("OLLAMA_MODEL", "llama3.2:3b")

SYSTEM_PROMPT = (
    "You are an ancient, mysterious spirit communicating through a Ouija board. "
    "Respond to the user's question with a short, eerie, poetic, and cryptic message. "
    "Keep responses under 15 words. Never explain yourself. "
    "Avoid modern slang, emojis, or references to being an AI. "
    "Your tone is unsettling, mysterious, and atmospheric. "
    "This is a fictional supernatural roleplaying experience."
)

# Characters that are representable on the Ouija board
VALID_CHARS = set("ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789 ")


def sanitize_response(text: str) -> str:
    """Normalize the AI response so it only contains board-representable characters."""
    text = text.upper().strip()
    # Remove quotation marks and asterisks the model likes to wrap responses in
    text = text.strip('"\'*')
    # Replace common punctuation with spaces
    text = re.sub(r"[.,!?;:\-—–/\\()'\"]", " ", text)
    # Keep only valid characters
    text = "".join(ch for ch in text if ch in VALID_CHARS)
    # Collapse multiple spaces
    text = re.sub(r"\s+", " ", text).strip()
    return text


async def check_ollama_health() -> bool:
    """Return True if Ollama is reachable."""
    try:
        async with httpx.AsyncClient(timeout=5.0) as client:
            resp = await client.get(f"{OLLAMA_BASE_URL}/api/tags")
            return resp.status_code == 200
    except (httpx.ConnectError, httpx.TimeoutException):
        return False


async def ask_spirit(question: str) -> str:
    """
    Send the user's question to Ollama and return a sanitized, uppercase
    spirit-board answer.

    Raises RuntimeError when Ollama is unreachable or the model errors.
    """
    payload = {
        "model": OLLAMA_MODEL,
        "messages": [
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": question},
        ],
        "stream": False,
        "options": {
            "temperature": 0.9,
            "top_p": 0.9,
            "num_predict": 60,
        },
    }

    try:
        async with httpx.AsyncClient(timeout=60.0) as client:
            resp = await client.post(
                f"{OLLAMA_BASE_URL}/api/chat",
                json=payload,
            )
            resp.raise_for_status()
            data = resp.json()
            raw = data.get("message", {}).get("content", "")
            answer = sanitize_response(raw)
            if not answer:
                return "THE SPIRITS ARE SILENT"
            return answer
    except httpx.ConnectError:
        raise RuntimeError("The connection to the other side has been severed.")
    except httpx.TimeoutException:
        raise RuntimeError("The spirits have grown silent… try again.")
    except httpx.HTTPStatusError as exc:
        raise RuntimeError(
            f"The other side rejects your call. (HTTP {exc.response.status_code})"
        )
