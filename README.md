# THE VEIL — An AI Ouija Board

A locally-hosted, AI-powered Ouija board that uses **Ollama** to summon spirit-like responses through a Victorian-themed interface. Every response is revealed letter-by-letter as a planchette glides across the board.

![Status](https://img.shields.io/badge/status-local--only-blueviolet)
![AI](https://img.shields.io/badge/AI-Ollama%20%2B%20llama3.2:3b-orange)

---

## Architecture

```
┌─────────────────┐         ┌──────────────────┐         ┌─────────────┐
│   React + Vite  │  POST   │  FastAPI Backend  │  HTTP   │   Ollama    │
│   (port 5173)   │ ──────► │   (port 8000)     │ ──────► │ (port 11434)│
│                 │ ◄────── │                   │ ◄────── │ llama3.2:3b │
└─────────────────┘  JSON   └──────────────────┘  JSON   └─────────────┘
```

**Frontend** — React app with Framer Motion animations, Tailwind CSS styling, and a custom Ouija board built entirely with CSS/SVG. The planchette reads actual DOM element positions for pixel-accurate movement.

**Backend** — Thin FastAPI server that forwards questions to Ollama with a "mysterious spirit" system prompt, sanitizes the response to board-representable characters, and returns it.

**AI** — Ollama running locally with the `llama3.2:3b` model. No cloud APIs, no internet required after setup.

---

## Prerequisites

- **Node.js** ≥ 18
- **Python** ≥ 3.10
- **Ollama** — [Install from ollama.com](https://ollama.com)

---

## Installation

### 1. Install and start Ollama

```bash
# Install Ollama (see https://ollama.com for OS-specific instructions)
# Then pull the model:
ollama pull llama3.2:3b

# Ollama runs automatically as a service on port 11434
```

### 2. Set up the Backend

```bash
cd backend

# Create a virtual environment (recommended)
python -m venv venv
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Start the server
uvicorn main:app --reload --port 8000
```

### 3. Set up the Frontend

```bash
cd frontend

# Install dependencies
npm install

# Start the dev server
npm run dev
```

### 4. Open the app

Navigate to **http://localhost:5173** in your browser.

---

## Configuration

The backend reads from `backend/.env`:

| Variable | Default | Description |
|---|---|---|
| `OLLAMA_BASE_URL` | `http://localhost:11434` | Ollama API endpoint |
| `OLLAMA_MODEL` | `llama3.2:3b` | Model to use for generation |

---

## API Endpoints

| Method | Path | Description |
|---|---|---|
| `POST` | `/api/ask` | Send a question, receive a spirit's answer |
| `GET` | `/api/health` | Check API and Ollama connectivity |

### POST /api/ask

**Request:**
```json
{
  "question": "Is someone watching me?"
}
```

**Response:**
```json
{
  "answer": "SOME SHADOWS HAVE NO OWNER"
}
```

---

## Project Structure

```
the-veil/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── OuijaBoard.jsx      # Board layout + planchette positioning
│   │   │   ├── Planchette.jsx       # SVG planchette with trembling effect
│   │   │   ├── QuestionInput.jsx    # Input form + action buttons
│   │   │   ├── ResponseDisplay.jsx  # Revealed text + contacting state
│   │   │   ├── LandingScreen.jsx    # Séance entry screen
│   │   │   ├── Particles.jsx        # Floating golden particles (canvas)
│   │   │   ├── Candles.jsx          # Flickering candle decorations
│   │   │   ├── AmbientSound.jsx     # Web Audio API drone generator
│   │   │   └── Transcript.jsx       # Session Q&A history
│   │   ├── App.jsx                  # Main orchestrator
│   │   ├── App.css                  # All component styles
│   │   └── index.css                # Tailwind + design tokens
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
├── backend/
│   ├── main.py                      # FastAPI app + routes
│   ├── ollama_service.py            # Ollama client + response sanitization
│   ├── requirements.txt
│   └── .env
│
└── README.md
```

---

## How It Works

1. **Landing** → Atmospheric entry screen with particles and gothic typography.
2. **Ask** → User types a question and clicks SUMMON.
3. **Contact** → Screen dims, planchette trembles, "Reaching beyond the veil..." appears.
4. **AI Generation** → FastAPI sends the question to Ollama with the spirit persona prompt.
5. **Planchette Animation** → The complete response is split into characters. The planchette glides to each letter's actual DOM position on the board using Framer Motion springs. Each letter illuminates and appends to the revealed text.
6. **Goodbye** → Planchette moves to GOODBYE. Action buttons appear.
7. **Repeat or End** → Ask another question or end the séance.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, Vite 8 |
| Styling | Tailwind CSS 4, Vanilla CSS |
| Animation | Framer Motion |
| Backend | Python, FastAPI |
| AI | Ollama (llama3.2:3b) |
| Audio | Web Audio API (no external files) |

---

## License

This project is for personal and educational use.
