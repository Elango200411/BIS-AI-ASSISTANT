# BIS Sahayak AI

**Your Intelligent Assistant for Indian Standards & BIS Services**

> Smart India Hackathon 2025 — Problem ID: 26107

---

## Problem Statement

Indian businesses and consumers struggle to navigate the complex landscape of Bureau of Indian Standards (BIS) certifications, Indian Standards (IS codes), and compliance requirements. Information is scattered across multiple government portals, technical documents are difficult to interpret, and the lack of a unified intelligent assistant leads to delays, non-compliance, and confusion.

## Solution

BIS Sahayak AI is an AI-powered intelligent assistant that provides instant, accurate information about Indian Standards, BIS certification requirements, hallmarking, and consumer services. Built with a Retrieval-Augmented Generation (RAG) architecture, it searches a comprehensive knowledge base and delivers structured, source-attributed responses in multiple languages.

## Features

### Core Capabilities
- **AI Chat Assistant** — Natural language queries about Indian Standards, BIS certification, hallmarking, and consumer services
- **RAG-Powered Retrieval** — TF-IDF based retrieval over 55+ knowledge base records with source traceability
- **Product Compliance Checker** — Analyze products against applicable IS codes and certification requirements
- **Standards Search** — Search and browse Indian Standards by keyword, category, or IS code
- **BIS Services Directory** — Complete directory of BIS services with detailed process information

### Multilingual Support
- English, Hindi (हिन्दी), and Tamil (தமிழ்) language support
- Automatic translation via MyMemory API with offline dictionary fallback
- Language-aware speech recognition

### Voice Input
- Browser-based speech recognition (Web Speech API)
- Language-specific speech-to-text (en-US, hi-IN, ta-IN)
- Graceful degradation for unsupported browsers

### Explainable AI
- **Source Traceability** — Every response shows which knowledge base files were consulted
- **Pipeline Transparency** — Collapsible "How this answer was generated" section showing:
  - User Intent classification
  - Retrieved Knowledge (record count, source types)
  - Matched Sources with type badges
  - Response Method (rule-based / LLM-generated)

### Optional LLM Integration
- OpenAI-compatible API support (OpenAI, Azure, Ollama, LM Studio)
- Environment variable configuration (`LLM_API_KEY`, `LLM_MODEL`, `LLM_BASE_URL`)
- Automatic fallback to rule-based responses if LLM is unavailable
- Structured prompt templates for consistent output

### Dashboard
- Dynamic statistics from backend knowledge base
- User type selector (Consumer / Industry)
- Session-based activity tracking with persistence
- System status monitoring

## Architecture

```
┌─────────────────────────────────────────────────────┐
│                    Frontend (React)                   │
│  Dashboard │ AI Assistant │ Compliance │ Search │ ... │
└──────────────────────┬──────────────────────────────┘
                       │ Vite Proxy (/api → :8000)
┌──────────────────────┴──────────────────────────────┐
│                  Backend (FastAPI)                    │
│  ┌─────────┐ ┌─────────┐ ┌──────────┐ ┌──────────┐ │
│  │ Standards│ │Services │ │Compliance│ │   Chat   │ │
│  └────┬────┘ └────┬────┘ └────┬─────┘ └────┬─────┘ │
│       │           │           │             │        │
│  ┌────┴───────────┴───────────┴─────────────┴─────┐ │
│  │              RAG Engine (TF-IDF)                │ │
│  │  Ingestion → Indexing → Retrieval → Ranking    │ │
│  └────────────────────┬───────────────────────────┘ │
│                       │                              │
│  ┌────────────────────┴───────────────────────────┐ │
│  │           Translation Service                   │ │
│  │  MyMemory API → Dictionary Fallback → Passthru │ │
│  └────────────────────────────────────────────────┘ │
│                                                      │
│  ┌────────────────────────────────────────────────┐ │
│  │           LLM Service (Optional)               │ │
│  │  OpenAI-compatible API → Rule-based Fallback   │ │
│  └────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────┘
                       │
┌──────────────────────┴──────────────────────────────┐
│              Knowledge Base (JSON)                    │
│  bis_standards.json │ bis_services.json │ faq.json   │
│  certification_rules.json │ hallmarking.json          │
│  consumer_services.json                             │
└──────────────────────────────────────────────────────┘
```

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, Vite, React Router, Lucide Icons |
| Backend | Python 3.13, FastAPI, Uvicorn |
| RAG Engine | scikit-learn (TF-IDF), NumPy |
| Translation | MyMemory API (free tier) |
| LLM | OpenAI-compatible API (optional) |
| Voice | Web Speech API (browser-native) |
| Data | JSON knowledge base (55 records) |

## Project Structure

```
bis-sahayak-ai/
├── backend/
│   ├── main.py                 # FastAPI app entry
│   ├── api/
│   │   ├── standards.py        # Standards search & detail
│   │   ├── services.py         # BIS services
│   │   ├── compliance.py       # Product compliance check
│   │   └── chat.py             # AI chat with RAG + LLM
│   ├── rag/
│   │   ├── embeddings.py       # TF-IDF / embedding engine
│   │   ├── ingestion.py        # Knowledge base loader
│   │   └── retrieval.py        # Query processing & ranking
│   ├── llm/
│   │   ├── service.py          # LLM API integration
│   │   └── prompts.py          # Structured prompt templates
│   ├── translate/
│   │   └── service.py          # Translation with fallback
│   ├── data/                   # JSON knowledge base
│   ├── requirements.txt
│   └── .env                    # LLM configuration
├── frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── context/AppContext.jsx
│   │   ├── components/
│   │   │   ├── Layout.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   └── Sidebar.css
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Assistant.jsx
│   │   │   ├── ProductCompliance.jsx
│   │   │   ├── StandardsSearch.jsx
│   │   │   ├── BisServices.jsx
│   │   │   ├── Compliance.jsx
│   │   │   └── About.jsx
│   │   ├── services/api.js
│   │   └── index.css
│   ├── vite.config.js
│   └── package.json
└── README.md
```

## Installation

### Prerequisites
- Python 3.10+
- Node.js 18+
- npm or yarn

### Backend Setup

```bash
cd backend
python -m venv venv
venv\Scripts\activate          # Windows
# source venv/bin/activate    # macOS/Linux
pip install -r requirements.txt
```

### Frontend Setup

```bash
cd frontend
npm install
```

### LLM Configuration (Optional)

Create `backend/.env`:

```env
LLM_API_KEY=your-api-key-here
LLM_MODEL=gpt-4o-mini
LLM_BASE_URL=https://api.openai.com/v1
```

For local models (Ollama):
```env
LLM_API_KEY=ollama
LLM_MODEL=llama3.2
LLM_BASE_URL=http://localhost:11434/v1
```

## Running

### Start Backend

```bash
cd backend
uvicorn main:app --reload --port 8000
```

### Start Frontend

```bash
cd frontend
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Health check |
| GET | `/api/stats` | Knowledge base statistics |
| GET | `/api/standards/search?q=` | Search Indian Standards |
| GET | `/api/standards/{id}` | Get standard detail |
| GET | `/api/services?q=&category=` | List BIS services |
| GET | `/api/services/{id}` | Get service detail |
| POST | `/api/compliance/check` | Product compliance analysis |
| POST | `/api/chat` | AI chat (supports `language` field) |
| GET | `/api/chat/rag/status` | RAG system status |
| GET | `/api/chat/llm/status` | LLM integration status |

## Demo Workflow

1. **Dashboard** — View live statistics, select user type (Consumer/Industry)
2. **Ask BIS AI** — Ask "What is BIS?" or "Explain hallmarking" in English/Hindi/Tamil
3. **Voice Input** — Click mic button, speak your question
4. **Traceability** — Expand "How this answer was generated" to see pipeline
5. **Language Switch** — Toggle EN/HI/TA in the header, see translated responses
6. **Check Product** — Enter product details, get compliance assessment with score
7. **Search Standards** — Search "cement" or "LED", view standard details
8. **BIS Services** — Browse all BIS services, expand for process steps
9. **Activity Log** — Return to dashboard, see session activity tracking

## Future Scope

- **Real LLM Integration** — Connect production-grade LLM for natural language generation
- **Document Upload** — Upload product specifications for automated compliance analysis
- **Multilingual Expansion** — Add Bengali, Marathi, Telugu, and other regional languages
- **BIS API Integration** — Real-time data from official BIS portals
- **User Accounts** — Save compliance history, track certification progress
- **Mobile App** — React Native companion for on-site verification
- **Barcode Scanner** — Scan product barcodes to check BIS certification status
- **Compliance Alerts** — Notifications for expiring certifications or new standards

## Disclaimer

This is a prototype application built for Smart India Hackathon 2025. All data is synthetic and for demonstration purposes only. Always verify requirements through official BIS channels at [bis.gov.in](https://www.bis.gov.in).

## License

Built for Smart India Hackathon 2025.
