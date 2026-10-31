"""
THE VEIL — FastAPI backend
Bridges the React frontend with a locally-running Ollama LLM.
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, field_validator

from ollama_service import ask_spirit, check_ollama_health

app = FastAPI(title="The Veil – Spirit Board API")

# ---------------------------------------------------------------------------
# CORS – allow the Vite dev server
# ---------------------------------------------------------------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)


# ---------------------------------------------------------------------------
# Schemas
# ---------------------------------------------------------------------------
class QuestionRequest(BaseModel):
    question: str

    @field_validator("question")
    @classmethod
    def question_must_not_be_empty(cls, v: str) -> str:
        if not v or not v.strip():
            raise ValueError("You must speak to summon the spirits.")
        return v.strip()


class AnswerResponse(BaseModel):
    answer: str


# ---------------------------------------------------------------------------
# Routes
# ---------------------------------------------------------------------------
@app.get("/api/health")
async def health_check():
    ollama_ok = await check_ollama_health()
    return {
        "status": "ok",
        "ollama": "connected" if ollama_ok else "disconnected",
    }


@app.post("/api/ask", response_model=AnswerResponse)
async def ask(req: QuestionRequest):
    try:
        answer = await ask_spirit(req.question)
        return AnswerResponse(answer=answer)
    except RuntimeError as exc:
        raise HTTPException(status_code=503, detail=str(exc))
