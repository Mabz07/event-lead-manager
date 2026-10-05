# AI Event Lead Manager

A full-stack, AI-native B2B lead management tool built to capture, organize, and follow up with business prospects met at conferences and networking events.

- **Live Application:** [https://event-lead-manager-eta.vercel.app](https://event-lead-manager-eta.vercel.app)
- **API Documentation:** [https://event-lead-manager.onrender.com/docs](https://event-lead-manager.onrender.com/docs)

---

## Technical Stack

| Layer | Technology | Rationale |
| :--- | :--- | :--- |
| **Frontend** | React (Vite) | Fast component lifecycle rendering, small bundle footprint, clean modular state without unnecessary SSR overhead. |
| **Backend** | Python FastAPI | Asynchronous performance, typed schemas with Pydantic validation, native OpenAPI documentation. |
| **Database** | PostgreSQL (Supabase) | ACID compliance, indexed search across lead names/companies/events, reliable persistence. |
| **ORM** | SQLAlchemy 2.0 | Parameterized SQL queries, connection pooling, automated schema synchronization. |
| **AI Integration** | Google Gemini API | Low-latency summarization and business email generation with backend-only key isolation. |

---

## Key Architecture & Technical Decisions

### 1. AI Reliability & Fallback Architecture
To prevent API failures during Google server demand spikes (such as `503 UNAVAILABLE`), the backend integrates an automated multi-model fallback queue:
- Primary: `gemini-2.0-flash`
- Fallback: `gemini-1.5-flash`
If a model experiences temporary throttling, requests are seamlessly rerouted within milliseconds without user disruption.

### 2. Strict Grounding Prompts (Anti-Hallucination)
Prompts for note summarization and follow-up drafts enforce negative constraints:
- AI is explicitly forbidden from inventing unstated budgets, features, or timelines.
- Email drafts strictly extract the meeting context, referenced pain points, and a logical next step.

### 3. Security & Key Isolation
- `GEMINI_API_KEY` and database credentials exist exclusively in the backend runtime environment. No secrets are exposed to client-side bundles.
- CORS policies explicitly restrict origins to the production frontend domain.

### 4. Restrained B2B UI Design System
- Built with a warm, professional corporate palette (cream, warm beige, soft terracotta, deep brown text).
- Avoids unnecessary containers, nested cards, and emojis.
- Utilizes accessible Lucide React icons, inline status badges, responsive tabular layouts, and clear empty/loading states.

---

## Database Design

Table: `event_leads`
- `id` (INTEGER, Primary Key, Autoincrement)
- `name` (VARCHAR 255, Indexed)
- `company` (VARCHAR 255, Indexed)
- `email` (VARCHAR 255, Validated)
- `event` (VARCHAR 255, Indexed)
- `notes` (TEXT)
- `follow_up_status` (VARCHAR 50, Default: 'Not Contacted')
- `created_at` (TIMESTAMP UTC)
- `updated_at` (TIMESTAMP UTC)

---

## Local Development Setup

### 1. Backend
```bash
cd backend
python -m venv venv
.\venv\Scripts\Activate.ps1    # On Windows
pip install -r requirements.txt
uvicorn app.main:app --reload
