# ItinerAI ✈️

An AI-powered travel planning app that generates structured, day-by-day itineraries through a conversational interface. Tell it where you're going, how long you're staying, your budget, and your interests — and it builds a complete, realistic trip plan with specific places, time windows, costs, transit hints, and booking notes. You can then refine any part of the plan through a chat panel, regenerate individual days, and export or share the result.

Built with a cinematic React frontend and a Node/Express backend that calls the OpenAI Responses API with strict JSON schema output.

![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-18+-339933?logo=node.js&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-6-646CFF?logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-06B6D4?logo=tailwindcss&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-optional-47A248?logo=mongodb&logoColor=white)

---

## Features

- **AI itinerary generation** — produces a full multi-day plan with specific place names, time windows, costs, neighborhoods, booking notes, and transit hints, using OpenAI's Responses API with a strict JSON schema.
- **Conversational editing** — chat panel lets you refine any part of the plan in plain language; the AI modifies only what's necessary and keeps the rest consistent.
- **Per-day regeneration** — reshuffle a single day without touching the rest of the itinerary.
- **Undo / redo / version restore** — full itinerary history tracked client-side and persisted to the backend; every change creates a named snapshot.
- **Quality repair pass** — a post-generation step automatically detects and replaces generic placeholder place names (e.g. "central market") with curated local alternatives.
- **Graceful fallback** — if the OpenAI key is missing or a call fails, a polished demo itinerary for the requested city is served so the UI stays usable.
- **PDF export** — uses the browser print flow; no extra dependencies.
- **Shareable links** — each session gets a UUID `shareId` for direct access and sharing.
- **MongoDB optional** — the backend runs entirely in-memory if no `MONGODB_URI` is set, which is useful for quick local testing or zero-config deploys.
- **Session persistence** — the frontend persists your current trip to `localStorage` so it survives page refreshes.

---

## Tech Stack

| Layer    | Tech                                                      |
|----------|-----------------------------------------------------------|
| Frontend | React 18, Vite, Tailwind CSS, Framer Motion, GSAP, Lucide React |
| Backend  | Node.js 18+, Express 4, Mongoose 8                        |
| AI       | OpenAI Responses API (`gpt-4.1-mini` default)             |
| Database | MongoDB (optional — in-memory fallback built in)          |

---

## Project Structure

```
ItinerAI/
├── package.json                  # Root scripts for convenience (dev:frontend, dev:backend)
├── frontend/
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── src/
│       ├── App.jsx               # Root state, routing between wizard / board / chat views
│       ├── main.jsx
│       ├── index.css
│       ├── components/
│       │   ├── TripWizard.jsx        # Multi-step trip input form
│       │   ├── ItineraryBoard.jsx    # Day-by-day itinerary view with undo/redo
│       │   ├── ChatPanel.jsx         # Conversational editing UI
│       │   ├── GenerationOverlay.jsx # Loading/generation animation
│       │   └── FloatingScene.jsx     # Animated decorative background
│       ├── data/
│       │   └── trending.js           # Trending destinations, interest options, travel styles
│       └── utils/
│           └── api.js                # Fetch wrappers for all backend endpoints
└── backend/
    └── src/
        ├── server.js                 # Express server entry point
        ├── app.js                    # Middleware and route registration
        ├── config/
        │   └── db.js                 # MongoDB connection with graceful in-memory fallback
        ├── models/
        │   └── TripSession.js        # Mongoose schema (trip input, itinerary, history, messages)
        ├── routes/
        │   └── itineraryRoutes.js    # All REST endpoints + in-memory session store
        ├── services/
        │   ├── openaiService.js      # Responses API calls, JSON schema, prompt builders
        │   ├── itineraryQuality.js   # Post-generation quality repair pass
        │   └── fallbackData.js       # Curated demo itineraries for supported cities
        └── utils/
            └── normalizers.js        # History entry builder, JSON sanitizer
```

---

## Prerequisites

- **Node.js 18+**
- An [OpenAI](https://platform.openai.com) account with API access (key starting with `sk-`)
- **MongoDB** (optional — the app runs in-memory without it)

> The backend uses `openai` npm package v4.76+ for the Responses API (`client.responses.create`). The version in `package.json` satisfies this automatically.

---

## Local Setup

### 1. Clone and install

```bash
git clone https://github.com/your-username/ItinerAI.git
cd ItinerAI

npm install --prefix backend
npm install --prefix frontend
```

### 2. Configure environment variables

**Backend** — copy the example and fill in your key:

```bash
cp backend/.env.example backend/.env
```

```env
PORT=5050
OPENAI_API_KEY=sk-...             # Required for live generation; omit to use fallback data
OPENAI_MODEL=gpt-4.1-mini         # Any JSON-schema-capable OpenAI model
MONGODB_URI=mongodb://127.0.0.1:27017/itinerai   # Optional — omit to run in-memory
FRONTEND_URL=http://localhost:5173
```

**Frontend** — copy the example:

```bash
cp frontend/.env.example frontend/.env
```

```env
VITE_API_URL=http://localhost:5050
```

### 3. Run locally

Open two terminals:

```bash
# Terminal 1 — backend (hot-reloads with Node --watch)
cd backend && npm run dev

# Terminal 2 — frontend
cd frontend && npm run dev
```

Or use the root convenience scripts:

```bash
npm run dev:backend   # starts backend on :5050
npm run dev:frontend  # starts frontend on :5173
```

Open [http://localhost:5173](http://localhost:5173). Backend health check: [http://localhost:5050/health](http://localhost:5050/health).

---

## API Reference

All routes are registered at the server root (no `/api` prefix).

| Method | Path | Description |
|--------|------|-------------|
| `GET`  | `/health` | Health check — returns `{ ok: true }` |
| `POST` | `/generate-itinerary` | Generate a new itinerary from trip inputs |
| `POST` | `/modify-itinerary` | Apply a chat instruction to an existing itinerary |
| `POST` | `/save-itinerary` | Persist the current session state |
| `GET`  | `/itinerary/:shareId` | Retrieve a saved session by share ID |

### `POST /generate-itinerary`

**Request body:**
```json
{
  "destination": "Tokyo",
  "tripLength": 5,
  "budget": 3200,
  "interests": ["Food", "Architecture", "Wellness"],
  "travelStyle": "Balanced",
  "startDate": "2025-10-01",
  "endDate": "2025-10-06"
}
```

**Response:**
```json
{
  "shareId": "uuid-v4",
  "itinerary": {
    "title": "5 Days in Tokyo",
    "tripLength": 5,
    "overview": "...",
    "budgetSummary": "...",
    "travelStyle": "Balanced",
    "highlights": ["..."],
    "aiSuggestions": ["..."],
    "days": [
      {
        "id": "day-1",
        "dayNumber": 1,
        "title": "Arrival & Asakusa",
        "theme": "culture",
        "summary": "...",
        "weatherHint": "...",
        "activities": [
          {
            "id": "act-1",
            "timeOfDay": "morning",
            "startTime": "09:00",
            "endTime": "11:00",
            "title": "Senso-ji Temple",
            "description": "...",
            "placeName": "Senso-ji",
            "neighborhood": "Asakusa",
            "cost": "Free",
            "bookingNote": "No booking required",
            "transitNote": "Asakusa Line to Asakusa Station",
            "mapHint": "...",
            "icon": "sparkles",
            "tags": ["culture", "history"]
          }
        ]
      }
    ]
  },
  "history": [...],
  "messages": [...]
}
```

### `POST /modify-itinerary`

**Request body:**
```json
{
  "shareId": "uuid-v4",
  "message": "Replace day 3 with something focused on street food",
  "regenerateDay": 3
}
```

Returns the same shape as `/generate-itinerary`. `regenerateDay` is optional — omit it to let the AI decide what to change based on the message.

---

## Supported Destinations (Curated Fallback Data)

The fallback and quality-repair system includes curated profiles for the following cities. Any other destination still works via live AI generation.

| Destination | Curated neighborhoods & themes |
|-------------|-------------------------------|
| Tokyo       | Asakusa, Shibuya, Ginza, Daikanyama, Aoyama, Ueno, Nakameguro, Azabudai |
| Seoul       | Myeongdong, Seongsu, Insadong, Gangnam, Itaewon, Bukchon, Yeonnam |
| Lisbon      | Alfama, Chiado, Bairro Alto, Belém, Príncipe Real, LX Factory |
| Reykjavik   | *(fallback itinerary available)* |
| Kyoto       | *(fallback itinerary available)* |

---

## Deployment

### Backend — Render / Railway

1. Push to GitHub.
2. Create a new **Web Service** pointed at the `backend/` directory.
3. **Build command:** `npm install`
4. **Start command:** `node src/server.js`
5. Add environment variables: `OPENAI_API_KEY`, `OPENAI_MODEL`, `FRONTEND_URL`, and optionally `MONGODB_URI`.

> On Render's free tier, the server spins down between requests and in-memory sessions will be lost. Add a [MongoDB Atlas](https://www.mongodb.com/atlas) free-tier cluster and set `MONGODB_URI` for persistent sessions.

### Frontend — Vercel

1. Import the repo on [vercel.com](https://vercel.com).
2. Set **Root Directory** to `frontend`.
3. **Framework preset:** Vite (auto-detected).
4. Add environment variable: `VITE_API_URL` = your deployed backend URL (e.g. `https://itinerai-backend.onrender.com`).

---

## How the AI Pipeline Works

1. **Trip Wizard** collects destination, dates, budget, interests, and travel style.
2. The frontend calls `POST /generate-itinerary` with this input.
3. The backend builds a structured prompt (including a curated destination profile when available) and calls the OpenAI Responses API with a strict JSON schema, ensuring the output is always a valid, typed itinerary.
4. A **quality repair pass** (`itineraryQuality.js`) scans the returned days for generic place-name patterns and replaces any flagged days with curated fallback data for that city.
5. The itinerary is saved to MongoDB (or in-memory), and the response — along with a `shareId` — is returned to the frontend.
6. Subsequent chat messages call `POST /modify-itinerary`, which passes the `previous_response_id` for multi-turn context, along with the current itinerary and user instruction. The AI modifies only the necessary parts.

---

## Contributing

1. Fork the repository.
2. Create a feature branch: `git checkout -b feature/my-change`
3. Commit using conventional commits: `git commit -m "feat: describe your change"`
4. Push and open a Pull Request against `master`.
