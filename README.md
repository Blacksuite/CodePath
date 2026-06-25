# CodePath — Self-Hosted Learning Portal

A gamified, single-user web portal that curates the best free full-stack courses into one calm,
tracked path. Read focus notes, follow the linked resource (YouTube / freeCodeCamp / Scrimba /
react.dev …), take grounded quizzes, and earn XP, streaks, and badges as you go.

Progress is saved by a tiny built-in backend (one JSON file on disk), so it survives clearing your
browser and follows you across devices on the same deployment. No login, no external database.

## Run it on your server (Docker — the easy way)

```bash
docker compose up -d --build
```

Then open **http://localhost:8080** (or `http://your-server-ip:8080`). That's it.

Progress is stored in a named Docker volume (`codepath-data`) mounted at `/data`, so it survives
`docker compose up -d --build` rebuilds and restarts. To stop: `docker compose down` (add `-v` to
also wipe saved progress).

> Put it behind your existing reverse proxy (Caddy/Nginx/Traefik) to add a domain + HTTPS.
> The app uses hash-based routing, so it works behind any path with zero extra config.

### Or pull the prebuilt image

Every push to `main` builds and publishes a Docker image to GitHub Container Registry via the
`docker` GitHub Action (`.github/workflows/docker.yml`):

```bash
docker run -d -p 8080:8080 -v codepath-data:/data ghcr.io/<owner>/<repo>:latest
```

## Run it locally (without Docker)

```bash
npm install
npm run dev      # Vite dev server with hot reload (progress falls back to localStorage)
# or, to run the real backend:
npm run build && node server.js   # serves the built app + progress API on :8080
```

## How it's built
- **Vite + React** SPA, **Tailwind** for styling, **react-markdown** to render the course content.
- **Backend:** `server.js` — a dependency-free Node server that serves the built `dist/` and a
  two-route progress API (`GET`/`PUT /api/progress`) backed by a single JSON file (`DATA_FILE`).
- **Progress** (XP, level, streak, badges, completed lessons, quiz scores) is saved to the backend;
  `localStorage` is kept only as a fast local cache for instant first paint. Persistence is isolated
  in `src/lib/persistence.js`. You can also back it up via **Settings → Export / Import progress**.
- Content is a presentation layer: sessions curate a real resource + focus notes + a grounded quiz.
  Edit content under `src/content/` and rebuild to publish.

## Structure
```
server.js         # backend: serves dist/ + GET/PUT /api/progress (no deps)
src/
  content/        # the course content (curated sessions, cheat-sheets, projects, how-to-learn)
  data/
    curriculum.js # phase order + metadata (single source of truth)
    quizzes/      # one grounded end-of-phase quiz JSON per phase
  lib/
    persistence.js # storage adapter (server + localStorage cache) — the only place that touches storage
    progress.jsx   # gamification store (XP, level, streak, badges, resume)
  components/     # Layout, Markdown renderer, UI primitives, block renderer
  pages/          # Dashboard, PhaseOverview, StructuredLesson, Quiz, Projects, Cheatsheets, …
scripts/          # verify.mjs (lint/extract) + checklinks.sh (link liveness) — run before publishing
```
