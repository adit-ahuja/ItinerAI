# itinerai ✈️

An AI-powered travel planning app that generates structured, day-by-day itineraries through a conversational interface. Built with a cinematic React frontend and a Node/Express backend that talks to the OpenAI Responses API with strict JSON schema output.

---

## Features

- **AI itinerary generation** — produces a full multi-day plan with specific place names, time windows, costs, neighborhoods, booking notes, and transit hints
- **Conversational editing** — chat panel lets you refine any part of the plan; the AI modifies only what's needed and keeps the rest consistent
- **Per-day regeneration** — reshuffle a single day without touching the rest
- **Undo / redo / version restore** — full itinerary history tracked client-side and persisted to the backend
- **PDF export** — uses the browser print flow; no extra dependencies
- **Shareable links** — each itinerary gets a UUID `shareId` for direct access
- **Graceful fallback** — if the OpenAI key is missing or a call fails, a polished demo itinerary is served so the UI stays usable
- **MongoDB optional** — the backend runs in-memory if no `MONGODB_URI` is set, useful for quick local testing

---

## Tech Stack

| Layer | Tech |
|---|---|
| Frontend | React 18, Vite, Tailwind CSS, Framer Motion, GSAP, Lucide React |
| Backend | Node.js, Express, Mongoose |
| AI | OpenAI Responses API — `gpt-4.1-mini` (or any JSON-schema-capable model) |
| Database | MongoDB (optional) |

---

## Project Structure

```
itinerai/
├── frontend/
│   └── src/
│       ├── components/
│       │   ├── TripWizard.jsx        # Multi-step trip input form
│       │   ├── ItineraryBoard.jsx    # Day-by-day itinerary view
│       │   ├── ChatPanel.jsx         # Conversational editing UI
│       │   ├── GenerationOverlay.jsx # Loading/generation animation
│       │   └── FloatingScene.jsx     # Decorative background scene
│       ├── data/
│       │   └── trending.js           # Trending destination suggestions
│       └── utils/
│           └── api.js                # Typed fetch wrappers for the backend
└── backend/
    └── src/
        ├── config/
        │   └── db.js                 # MongoDB connection (graceful fallback)
        ├── models/
        │   └── TripSession.js        # Mongoose schema for trips + history
        ├── routes/
        │   └── itineraryRoutes.js    # REST endpoints
        ├── services/
        │   ├── openaiService.js      # Responses API calls + JSON schema
        │   ├── itineraryQuality.js   # Post-generation quality repair pass
        │   └── fallbackData.js       # Curated demo itineraries per city
        └── utils/
            └── normalizers.js        # History entry builder, JSON sanitizer
```

---

## Prerequisites

- Node.js 18+
- An [OpenAI](https://platform.openai.com) account with API access
- MongoDB (optional — the app runs in-memory without it)

---

## Local Setup

### 1. Clone & install

```bash
git clone https://github.com/your-username/itinerai.git
cd itinerai

cd backend && npm install
cd ../frontend && npm install
```

Or from the root using the convenience scripts:

```bash
npm install --prefix backend
npm install --prefix frontend
```

### 2. Configure environment variables

**Backend:**

```bash
cp backend/.env.example backend/.env
```

```env
PORT=5050
MONGODB_URI=mongodb://127.0.0.1:27017/itinerai   # optional — omit to run in-memory
OPENAI_API_KEY=sk-...
OPENAI_MODEL=gpt-4.1-mini
FRONTEND_URL=http://localhost:5173
```

**Frontend:**

```bash
cp frontend/.env.example frontend/.env
```

```env
VITE_API_URL=http://localhost:5050
```

### 3. Run locally

```bash
# Terminal 1 — backend (hot-reloads via --watch)
cd backend && npm run dev

# Terminal 2 — frontend
cd frontend && npm run dev
```

Or from the root:

```bash
npm run dev:backend
npm run dev:frontend
```

Open [http://localhost:5173](http://localhost:5173). Backend health check: [http://localhost:5050/health](http://localhost:5050/health).

---

## API Reference

All routes are prefixed at the server root (no `/api` prefix).

| Method | Path | Description |
|---|---|---|
| `GET` | `/health` | Health check |
| `POST` | `/generate-itinerary` | Generate a new itinerary from trip inputs |
| `POST` | `/modify-itinerary` | Apply a chat instruction to an existing itinerary |
| `POST` | `/save-itinerary` | Persist the current session state |
| `GET` | `/itinerary/:shareId` | Retrieve a saved session by share ID |

### `POST /generate-itinerary`

**Request body:**
```json
{
  "destination": "Tokyo",
  "tripLength": 5,
  "budget": "moderate",
  "interests": ["food", "culture", "nightlife"],
  "travelStyle": "balanced"
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
    "travelStyle": "balanced",
    "highlights": ["..."],
    "aiSuggestions": ["..."],
    "days": [
      {
        "dayNumber": 1,
        "title": "Arrival & Shinjuku",
        "theme": "culture",
        "summary": "...",
        "weatherHint": "...",
        "activities": [
          {
            "timeOfDay": "morning",
            "startTime": "09:00",
            "endTime": "11:00",
            "title": "Meiji Shrine",
            "placeName": "Meiji Jingu",
            "neighborhood": "Harajuku",
            "cost": "Free",
            "bookingNote": "No booking required",
            "transitNote": "JR Yamanote Line to Harajuku Station"
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

```json
{
  "shareId": "uuid-v4",
  "message": "Replace day 3 with something focused on street food",
  "regenerateDay": 3
}
```

---

## Deployment

### Backend (Render / Railway)

1. Push to GitHub
2. Create a new Web Service pointed at the `backend/` root directory
3. **Build command:** `npm install`
4. **Start command:** `node src/server.js`
5. Add environment variables: `OPENAI_API_KEY`, `OPENAI_MODEL`, `MONGODB_URI`, `FRONTEND_URL`

### Frontend (Vercel)

1. Import the repo on [vercel.com](https://vercel.com)
2. Set **Root Directory** to `frontend`
3. **Framework preset:** Vite
4. Add environment variable: `VITE_API_URL` = your backend URL

---

## Notes

- The backend uses the **OpenAI Responses API** (`client.responses.create`), available in `openai` npm package v4.76+. Ensure your `openai` dependency is up to date.
- The quality repair pass in `itineraryQuality.js` detects generic place names (e.g. "central market") and replaces those days with curated fallback data automatically.
- MongoDB is entirely optional. Without `MONGODB_URI`, sessions are stored in a `Map` in memory and lost on server restart — fine for development.
- Expired or in-memory sessions won't survive a Render free-tier spin-down. Add MongoDB Atlas (free tier) for persistence.

---

## Contributing

1. Fork the repo
2. Create a feature branch: `git checkout -b feature/my-change`
3. Commit: `git commit -m "feat: describe your change"`
4. Push and open a Pull Request

---

## License

MIT
