// Persistence adapter — the ONLY place that touches storage. Swap the backend here
// (localStorage now → server/SQLite later) without changing the progress store.
// Versioned + migrating so curriculum updates never silently drop learner progress.

const KEY = 'codepath.progress'
export const SCHEMA_VERSION = 2

// v1 (phase-keyed completion) → v2 (lesson-keyed completion + lastLessonId + weekly streak)
function migrate(data) {
  let d = { ...data }
  if (!d._v || d._v < 2) {
    // Preserve everything; never destroy. Old phase-level completion is kept as legacy proof.
    d.completedLessons = d.completedLessons && !looksLessonKeyed(d.completedLessons) ? {} : (d.completedLessons || {})
    d.legacyPhaseComplete = data.completedLessons && !looksLessonKeyed(data.completedLessons) ? data.completedLessons : (d.legacyPhaseComplete || {})
    d.lastLessonId = d.lastLessonId || null
    if (d.streak && d.streak.last && !d.streak.unit) d.streak = { ...d.streak, unit: 'week' }
    d._v = 2
  }
  return d
}

function looksLessonKeyed(obj) {
  // lesson ids look like "p3-l03-…"; phase ids look like "phase-3"
  return Object.keys(obj || {}).some((k) => /^p\d+-l\d+/.test(k))
}

// The adapter interface. The server (src/../server.js) is the source of truth across
// devices; localStorage is only a fast local cache so the first paint isn't blank.
export const storage = {
  // Synchronous cache read — used for instant initial render before the server responds.
  load() {
    try {
      const raw = localStorage.getItem(KEY)
      if (!raw) return null
      return migrate(JSON.parse(raw))
    } catch {
      return null
    }
  },
  // Authoritative read from the backend. Returns null if nothing saved yet or server is down
  // (e.g. `npm run dev` with no server) — caller then falls back to the localStorage cache.
  async loadRemote() {
    try {
      const res = await fetch('/api/progress')
      if (res.status === 204 || !res.ok) return null
      return migrate(await res.json())
    } catch {
      return null
    }
  },
  save(state) {
    const payload = JSON.stringify({ ...state, _v: SCHEMA_VERSION })
    try {
      localStorage.setItem(KEY, payload) // local cache
    } catch {
      /* quota / private mode — fail soft, never throw into the UI */
    }
    // Persist to the backend (fire-and-forget; failure just leaves the cache as-is).
    fetch('/api/progress', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: payload }).catch(() => {})
  },
  raw() {
    return localStorage.getItem(KEY)
  },
}
