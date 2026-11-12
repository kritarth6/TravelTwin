# TravelTwin AI

> **Your journey, intelligently planned.**

![TravelTwin AI](https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1200&q=80)

[![FastAPI](https://img.shields.io/badge/Backend-FastAPI-009688?style=flat-square&logo=fastapi)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/Frontend-React%2018%20%7C%20TypeScript-61DAFB?style=flat-square&logo=react)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Bundler-Vite-646CFF?style=flat-square&logo=vite)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Styles-Tailwind%20CSS-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![LangGraph](https://img.shields.io/badge/Multi--Agent-LangGraph-FF4F00?style=flat-square)](https://langchain-ai.github.io/langgraph/)
[![Groq](https://img.shields.io/badge/LLM%20Inference-Groq-F55036?style=flat-square)](https://groq.com/)
[![Tavily](https://img.shields.io/badge/Web%20Research-Tavily%20API-4285F4?style=flat-square)](https://tavily.com/)
[![Render](https://img.shields.io/badge/Deployment-Render-46E3B7?style=flat-square&logo=render)](https://render.com/)

---

## 1. Product Overview

**TravelTwin AI** is a production-oriented AI travel planning platform designed to democratize intelligent trip curation for **students, families, backpackers, middle-class travellers, and couples**.

Unlike traditional travel platforms that default to expensive flights and luxury resorts, TravelTwin operates on a transparent, multi-modal ethos:
- **Intelligently Compares 5 Transit Modes:** Superfast trains, AC/non-AC sleeper buses, private cabs, shared taxis, self-drive rentals, and flights.
- **Benchmarks 4 Hospitality Tiers:** Backpacker hostels/pods (e.g., Zostel), standard 3-star hotels (e.g., Treebo, Bloom), premium 4-star boutique stays, and 5-star luxury resorts.
- **Autonomous Budget Optimization Engine:** Allocates expenses into 6 discrete pillars and automatically explores cheaper transit and lodging if your initial plan exceeds budget.
- **Conversational Refinement:** Refine transport, downgrade stays, or trim costs in natural language without regenerating the entire trip from scratch.
- **Interactive OpenStreetMap Visualization:** View real attraction markers, verified hours, entry fees, and hotel pins on a responsive Leaflet map.
- **Zero Hallucinated Bookings:** Transparently tags every fare as *Live Verified*, *Search-Result*, or *Heuristic Estimate*, providing direct links to verified providers (IRCTC, RedBus, Booking.com, Google Flights, Zoomcar).

---

## 2. Multi-Agent Architecture (LangGraph)

TravelTwin uses **LangGraph StateGraph** with typed states to coordinate 7 specialized AI agents:

```
                      ┌────────────────────────┐
                      │   User Requirements    │
                      └───────────┬────────────┘
                                  │
                                  ▼
                    ┌───────────────────────────┐
                    │ Travel Orchestrator Agent │
                    └─────────────┬─────────────┘
                                  │
                                  ▼
                   ┌─────────────────────────────┐
                   │ Research & Verification     │
                   │ (Tavily + Open-Meteo API)   │
                   └──────────────┬──────────────┘
                                  │
                                  ▼
                   ┌─────────────────────────────┐
                   │   Transportation Agent      │
                   │   (Multi-modal Comparison)  │
                   └──────────────┬──────────────┘
                                  │
                                  ▼
                   ┌─────────────────────────────┐
                   │    Accommodation Agent      │
                   │    (4 Distinct Tiers)       │
                   └──────────────┬──────────────┘
                                  │
                                  ▼
                   ┌─────────────────────────────┐
                   │ Local Transportation Agent  │
                   │ (City Metro, Auto, Bike)    │
                   └──────────────┬──────────────┘
                                  │
                                  ▼
                   ┌─────────────────────────────┐
                   │       Itinerary Agent       │
                   │ (Geographic Pacing & Food)  │
                   └──────────────┬──────────────┘
                                  │
                                  ▼
                   ┌─────────────────────────────┐
                   │  Budget Optimization Agent  │
                   │  (Auto-balancing & Buffer)  │
                   └──────────────┬──────────────┘
                                  │
                                  ▼
                    ┌───────────────────────────┐
                    │ Orchestrator Finalization │
                    │ (Synthesize Plan & Logs)  │
                    └─────────────┬─────────────┘
                                  │
                                  ▼
                      ┌───────────────────────┐
                      │ Interactive Dashboard │
                      └───────────────────────┘
```

### The 7 Agents
1. **Travel Orchestrator Agent (`orchestrator.py`):** Normalizes dates, validates requirements, triggers the workflow, and synthesizes the final AI overview and audit trace.
2. **Research & Verification Agent (`research_agent.py`):** Searches web travel portals using Tavily Search API and pulls live destination forecasts via Open-Meteo.
3. **Transportation Agent (`transportation_agent.py`):** Evaluates flights, trains, sleeper buses, outstation cabs, and self-drive options, highlighting the most practical and affordable choice.
4. **Accommodation Agent (`accommodation_agent.py`):** Recommends stays across Budget, Standard, Premium, and Luxury categories with verified booking links and coordinates.
5. **Local Transportation Agent (`local_transport_agent.py`):** Forecasts destination commute expenses across local metro, auto-rickshaws, bike rentals, and ride-hailing.
6. **Itinerary Agent (`itinerary_agent.py`):** Builds geographically grouped day-by-day schedules with verified attraction hours, regional culinary recommendations, and reasonable pacing.
7. **Budget Optimization Agent (`budget_agent.py`):** Core fiscal engine that partitions funds across 6 pillars and automatically downgrades expensive components if the plan exceeds the user's budget ceiling.

---

## 3. Technology Stack

- **Frontend:**
  - React 18, TypeScript, Vite
  - Tailwind CSS (clean, bright, modern travel-tech startup design)
  - Lucide React icons
  - Framer Motion for smooth transitions
  - Recharts for budget donut and allocation visualizations
  - Leaflet & React-Leaflet with OpenStreetMap tiles
- **Backend:**
  - Python 3.11+ / 3.14 / 3.15
  - FastAPI & Pydantic v2
  - LangChain & LangGraph StateGraph
  - Groq API (`llama-3.3-70b-versatile` / `llama-3.1-8b-instant`)
  - Tavily Search API for live web research
  - Open-Meteo free API for weather telemetry
  - SQLite database for persistent itineraries and conversation refinement
- **Deployment:**
  - Render Static Site (Frontend)
  - Render Web Service (Backend binds to dynamic `$PORT`)
  - Unified `render.yaml` infrastructure-as-code blueprint

---

## 4. Project Structure

```
TravelTwin/
├── backend/
│   ├── app/
│   │   ├── main.py                     # FastAPI application setup & CORS
│   │   ├── config.py                   # Pydantic Settings & environment config
│   │   ├── api/
│   │   │   └── routes/
│   │   │       ├── trips.py            # Plan, refine, list, get, delete endpoints
│   │   │       └── health.py           # Health & service status check
│   │   ├── agents/
│   │   │   ├── orchestrator.py         # Orchestrator agent
│   │   │   ├── research_agent.py       # Web research & weather agent
│   │   │   ├── transportation_agent.py # Multi-modal transport agent
│   │   │   ├── accommodation_agent.py  # 4-tier hospitality agent
│   │   │   ├── local_transport_agent.py# City transit agent
│   │   │   ├── itinerary_agent.py      # Day-by-day itinerary agent
│   │   │   └── budget_agent.py         # Budget balancing agent
│   │   ├── graph/
│   │   │   ├── state.py                # Typed StateGraph state definition
│   │   │   └── workflow.py             # LangGraph workflow compilation & refinement
│   │   ├── services/
│   │   │   ├── groq_service.py         # Groq LLM integration with JSON parsing
│   │   │   ├── tavily_service.py       # Live Tavily search integration
│   │   │   ├── weather_service.py      # Open-Meteo live forecast service
│   │   │   └── transport_service.py    # Verified portal booking URL generator
│   │   ├── database/
│   │   │   ├── connection.py           # SQLite connection & table initialization
│   │   │   └── models.py               # Repository for saved trips & messages
│   │   ├── schemas/
│   │   │   └── trip.py                 # Pydantic schemas (Request, Plan, Budget)
│   │   └── utils/
│   │       └── mock_data.py            # Coordinates, regional cuisines & routes
│   ├── tests/
│   │   ├── test_agents.py              # Multi-modal & tier unit tests
│   │   ├── test_budget.py              # Budget auto-optimization unit tests
│   │   └── test_api.py                 # End-to-end API route tests
│   ├── pytest.ini                      # Pytest configuration
│   ├── requirements.txt                # Python dependencies
│   └── .env.example                    # Backend environment template
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.tsx              # Responsive navigation & counters
│   │   │   ├── Footer.tsx              # Brand footer & partner links
│   │   │   ├── TripForm.tsx            # Interactive trip configuration form
│   │   │   ├── TransportComparison.tsx # Transit cards with pros, cons & links
│   │   │   ├── HotelCards.tsx          # 4-tier stay cards with amenities
│   │   │   ├── ItineraryTimeline.tsx   # Day switcher with morning/noon/evening
│   │   │   ├── BudgetChart.tsx         # Recharts donut & allocation list
│   │   │   ├── TravelMap.tsx           # Interactive Leaflet OpenStreetMap
│   │   │   ├── AgentActivityIndicator.tsx # Expandable agent execution trace
│   │   │   ├── RefinementChat.tsx      # Natural language refinement interface
│   │   │   └── Toast.tsx               # Feedback notifications
│   │   ├── pages/
│   │   │   ├── LandingPage.tsx         # Hero, featured routes, why TravelTwin
│   │   │   ├── PlanTripPage.tsx        # Planning form page wrapper
│   │   │   ├── TripResultsPage.tsx     # Comprehensive trip dashboard
│   │   │   ├── SavedTripsPage.tsx      # SQLite saved itineraries viewer
│   │   │   └── AboutPage.tsx           # Architecture & philosophy
│   │   ├── services/
│   │   │   └── api.ts                  # REST API client
│   │   ├── types/
│   │   │   └── trip.ts                 # TypeScript interfaces
│   │   ├── App.tsx                     # Main layout & state router
│   │   ├── main.tsx                    # Entry point
│   │   └── index.css                   # Tailwind base & custom styles
│   ├── package.json                    # Frontend dependencies
│   ├── vite.config.ts                  # Vite configuration & API proxy
│   ├── tailwind.config.js              # Theme & color configuration
│   └── tsconfig.json                   # TypeScript configuration
├── render.yaml                         # Render Blueprint for automated deployment
├── .gitignore                          # Clean git exclusion rules
└── README.md                           # Documentation
```

---

## 5. Local Setup & Installation

### Prerequisites
- Python 3.11+
- Node.js 18+ and npm 9+
- Git

### A. Clone the Repository
```bash
git clone https://github.com/<your-username>/TravelTwin.git
cd TravelTwin
```

### B. Backend Setup
1. Open a terminal in `backend/`:
   ```bash
   cd backend
   ```
2. Create and activate a virtual environment:
   ```bash
   # Windows
   py -3 -m venv venv
   .\venv\Scripts\activate

   # macOS / Linux
   python3 -m venv venv
   source venv/bin/activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Configure environment variables:
   ```bash
   cp .env.example .env
   ```
   Add your API keys to `.env`:
   ```env
   GROQ_API_KEY=your_groq_api_key_here
   TAVILY_API_KEY=your_tavily_api_key_here
   PORT=8000
   DEBUG=True
   ```
   *(Note: If you run without API keys, TravelTwin automatically operates in graceful sandbox mode with realistic estimates and verified provider links.)*

5. Run unit tests to verify:
   ```bash
   pytest
   ```
6. Start the FastAPI backend:
   ```bash
   uvicorn app.main:app --reload --port 8000
   ```
   Backend will be live at `http://localhost:8000` (Swagger docs at `http://localhost:8000/docs`).

### C. Frontend Setup
1. Open a new terminal in `frontend/`:
   ```bash
   cd frontend
   ```
2. Install npm packages:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
   Frontend will be live at `http://localhost:5173`.

---

## 6. Running Tests

The backend includes a comprehensive pytest suite covering multi-modal transport algorithms, 4-tier stay categorizations, budget auto-optimization logic, and REST API flows.

```bash
cd backend
pytest
```

**Test Coverage:**
- `test_agents.py`: Validates multi-modal transit options (train, bus, flight, cab), 4 distinct hospitality tiers, and day-wise attraction grouping.
- `test_budget.py`: Asserts that when a trip exceeds the budget limit, the Budget Agent automatically downgrades high-cost items (e.g., flight to train, hotel to hostel) and recalculates the balance.
- `test_api.py`: Tests the full `/api/trips/plan`, `/api/trips/refine`, `/api/trips`, and `/api/health` request lifecycle.

---

## 7. Render Deployment Guide

### Option 1: Automated Blueprint Deployment (Recommended)
1. Push your repository to GitHub.
2. Sign in to [Render Dashboard](https://dashboard.render.com/).
3. Click **New +** -> **Blueprint**.
4. Connect your GitHub repository.
5. Render reads `render.yaml` automatically and configures:
   - `traveltwin-api` (Python Web Service)
   - `traveltwin-web` (Static Site)
6. Add your `GROQ_API_KEY` and `TAVILY_API_KEY` in the Render Environment Variables tab for `traveltwin-api`.
7. Click **Apply**. Render will build and deploy both services!

### Option 2: Manual Step-by-Step Deployment

#### 1. Backend Web Service:
- **Environment:** Python 3
- **Root Directory:** `backend`
- **Build Command:** `pip install -r requirements.txt`
- **Start Command:** `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
- **Environment Variables:**
  - `GROQ_API_KEY`: `<your-key>`
  - `TAVILY_API_KEY`: `<your-key>`
  - `DEBUG`: `false`
  - `CORS_ORIGINS`: `*`

#### 2. Frontend Static Site:
- **Root Directory:** `frontend`
- **Build Command:** `npm install && npm run build`
- **Publish Directory:** `dist`
- **Environment Variables:**
  - `VITE_API_URL`: URL of your deployed backend service (e.g., `https://traveltwin-api.onrender.com`)

---

## 8. GitHub Push Instructions

```bash
git init
git add .
git commit -m "feat: complete production TravelTwin AI multi-agent platform"
git branch -M main
git remote add origin https://github.com/<your-username>/TravelTwin.git
git push -u origin main
```

---

## 9. Key API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Health check & external integration status |
| `POST` | `/api/trips/plan` | Executes LangGraph multi-agent workflow to build plan |
| `POST` | `/api/trips/refine` | Conversational plan update without full regeneration |
| `GET` | `/api/trips` | Retrieves all saved itineraries from SQLite |
| `GET` | `/api/trips/{id}` | Fetches detailed plan JSON by trip ID |
| `DELETE` | `/api/trips/{id}` | Deletes a saved plan from database |

---

## 10. Design Philosophy & Transparency

- **Clean White Interface:** Designed with a refined, professional palette—crisp white cards, subtle slate borders, and vibrant emerald/amber highlights.
- **No Direct Ticketing Claim:** TravelTwin is an intelligent research and planning assistant. We provide deep search links to verified aggregators (IRCTC, ConfirmTkt, RedBus, Booking.com, Google Flights) rather than simulating fake ticket checkouts.
- **Safety First:** Built-in 5–10% contingency emergency buffer ensures you are never stranded on vacation due to unbudgeted expenses.

---

## License

MIT License. Built with passion for travellers everywhere.
