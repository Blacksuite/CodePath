// The course structure. Lesson markdown lives in src/content/phases/<lessonFile>.md
// and quizzes in src/data/quizzes/<id>.json. This file is the single source of order.

export const PHASES = [
  { id: 'phase-0', num: 0, title: 'Setup & First Win', subtitle: 'Tools, terminal, git, first live page', time: '~1 week', lessonFile: 'phase-0-setup', accent: '#6d6cf0' },
  { id: 'phase-1', num: 1, title: 'HTML + CSS', subtitle: 'Structure, box model, Flexbox, Grid, responsive', time: '~3–5 weeks', lessonFile: 'phase-1-html-css', accent: '#f4b740' },
  { id: 'phase-2', num: 2, title: 'JavaScript for Real', subtitle: 'DOM, events, arrays, localStorage', time: '~5–7 weeks', lessonFile: 'phase-2-javascript', accent: '#34d8a8' },
  { id: 'phase-3', num: 3, title: 'React', subtitle: 'Components, state, hooks, forms', time: '~6–8 weeks', lessonFile: 'phase-3-react', accent: '#38bdf8' },
  { id: 'phase-4', num: 4, title: 'TypeScript + Router', subtitle: 'Types, custom hooks, routing, fetch', time: '~5–7 weeks', lessonFile: 'phase-4-typescript-router', accent: '#a78bfa' },
  { id: 'phase-5', num: 5, title: 'Backend + Auth + DB', subtitle: 'Full-stack with Supabase, RLS', time: '~6–9 weeks', lessonFile: 'phase-5-backend-supabase', accent: '#fb7185', flagship: true },
  { id: 'phase-6', num: 6, title: 'Quality & Ship', subtitle: 'Deploy, charts, testing, a11y', time: '~4–6 weeks', lessonFile: 'phase-6-quality-deploy', accent: '#22d3ee' },
  { id: 'phase-7', num: 7, title: "What's Next", subtitle: 'Reps, portfolio, learn-when-needed', time: 'ongoing', lessonFile: 'phase-7-whats-next', accent: '#c084fc' },
]

export const PHASE_BY_ID = Object.fromEntries(PHASES.map((p) => [p.id, p]))

export function phaseIndex(id) {
  return PHASES.findIndex((p) => p.id === id)
}

// Two units of work per phase: read the lesson, pass the quiz.
export const TOTAL_UNITS = PHASES.length * 2

// Curriculum version — bump when lesson structure changes in a way that needs migration.
export const CURRICULUM_VERSION = 1

// Phase 3 is the pilot: 8 structured micro-lessons (stable IDs — never renumber/reuse).
// As phases convert, add their lesson maps here. Phases without a map fall back to the slab.
export const LESSON_MAP = {
  // CURATED SESSIONS (backbone = javascript.info + freeCodeCamp JS; detours = Web Dev Simplified, MDN, build-alongs).
  'phase-2': [
    { id: 'p2-s1-fundamentals', order: 1, slug: 'fundamentals', title: 'JavaScript fundamentals', canDo: 'use variables, types, functions, conditionals and loops', estMinutes: 120 },
    { id: 'p2-s2-arrays-objects', order: 2, slug: 'arrays-objects', title: 'Arrays & objects', canDo: 'store and access data in arrays and objects', estMinutes: 60 },
    { id: 'p2-s3-dom', order: 3, slug: 'dom', title: 'The DOM', canDo: 'select and change page elements with JavaScript', estMinutes: 60 },
    { id: 'p2-s4-events', order: 4, slug: 'events', title: 'Events & delegation', canDo: 'respond to clicks, including on dynamically-added elements', estMinutes: 60 },
    { id: 'p2-s5-array-methods', order: 5, slug: 'array-methods', title: 'Array methods', canDo: 'transform data with map, filter, forEach and find', estMinutes: 60 },
    { id: 'p2-s6-localstorage', order: 6, slug: 'localstorage', title: 'localStorage & JSON', canDo: 'save and load data that survives a refresh', estMinutes: 45 },
    { id: 'p2-s7-async', order: 7, slug: 'async', title: 'Async & fetch (intro)', canDo: 'recognize promises, async/await and fetch', estMinutes: 45 },
    { id: 'p2-s8-build', order: 8, slug: 'build', title: 'Build: a real JavaScript app', canDo: 'build an interactive app with vanilla JavaScript', estMinutes: 360 },
  ],
  // CURATED SESSIONS (backbone = freeCodeCamp Responsive Web Design, detours = Kevin Powell + games).
  // Each session points at the best existing resource + focus notes + self-checks; phase quiz at the end.
  'phase-1': [
    { id: 'p1-s1-html', order: 1, slug: 'html', title: 'HTML foundations', canDo: 'structure a page with semantic HTML', estMinutes: 90 },
    { id: 'p1-s2-css', order: 2, slug: 'css', title: 'CSS foundations & the box model', canDo: 'style elements and control spacing', estMinutes: 120 },
    { id: 'p1-s3-flexbox', order: 3, slug: 'flexbox', title: 'Flexbox', canDo: 'lay out items in a row or column with Flexbox', estMinutes: 60 },
    { id: 'p1-s4-grid', order: 4, slug: 'grid', title: 'CSS Grid', canDo: 'build two-dimensional layouts with CSS Grid', estMinutes: 60 },
    { id: 'p1-s5-responsive', order: 5, slug: 'responsive', title: 'Responsive design', canDo: 'make layouts adapt to any screen size', estMinutes: 90 },
    { id: 'p1-s6-build', order: 6, slug: 'build', title: 'Build real projects', canDo: 'build responsive pages from scratch', estMinutes: 480 },
  ],
  // CURATED SESSIONS (backbone = Scrimba's free Learn React + react.dev; detours = Josh Comeau, freeCodeCamp).
  'phase-3': [
    { id: 'p3-s1-intro', order: 1, slug: 'intro', title: 'Why React & setup', canDo: 'explain what React is for and create a Vite app', estMinutes: 45 },
    { id: 'p3-s2-components', order: 2, slug: 'components', title: 'Components, JSX & props', canDo: 'build components and pass data with props', estMinutes: 90 },
    { id: 'p3-s3-state', order: 3, slug: 'state', title: 'State & events', canDo: 'add state with useState and handle events', estMinutes: 90 },
    { id: 'p3-s4-lists', order: 4, slug: 'lists', title: 'Lists & conditional rendering', canDo: 'render lists with keys and show UI conditionally', estMinutes: 60 },
    { id: 'p3-s5-forms', order: 5, slug: 'forms', title: 'Forms in React', canDo: 'build controlled form inputs', estMinutes: 60 },
    { id: 'p3-s6-effects', order: 6, slug: 'effects', title: 'useEffect & data', canDo: 'use useEffect to sync with the outside world', estMinutes: 75 },
    { id: 'p3-s7-build', order: 7, slug: 'build', title: 'Build: a React app', canDo: 'build a React app from scratch', estMinutes: 480 },
  ],
  // P0 — setup/git/deploy (curated, special-case)
  'phase-0': [
    { id: 'p0-s1-tools', order: 1, slug: 'tools', title: 'Set up your dev tools', canDo: 'install VS Code, Node, and use browser DevTools', estMinutes: 45 },
    { id: 'p0-s2-git', order: 2, slug: 'git', title: 'Terminal & Git', canDo: 'use the terminal basics and track code with Git & GitHub', estMinutes: 90 },
    { id: 'p0-s3-deploy', order: 3, slug: 'deploy', title: 'Your first page online', canDo: 'build and deploy a web page to a live URL', estMinutes: 60 },
  ],
  // P4 — TypeScript + Router (curated)
  'phase-4': [
    { id: 'p4-s1-typescript', order: 1, slug: 'typescript', title: 'TypeScript basics', canDo: 'add types to JavaScript to catch bugs early', estMinutes: 90 },
    { id: 'p4-s2-react-ts', order: 2, slug: 'react-ts', title: 'TypeScript with React', canDo: 'type React props and state', estMinutes: 75 },
    { id: 'p4-s3-hooks', order: 3, slug: 'hooks', title: 'Custom hooks', canDo: 'extract reusable logic into custom hooks', estMinutes: 60 },
    { id: 'p4-s4-router', order: 4, slug: 'router', title: 'React Router', canDo: 'add multiple pages with React Router', estMinutes: 75 },
    { id: 'p4-s5-state', order: 5, slug: 'state', title: 'Bigger state: useReducer', canDo: 'manage complex state with useReducer', estMinutes: 60 },
    { id: 'p4-s6-fetch', order: 6, slug: 'fetch', title: 'Fetching a typed API', canDo: 'fetch and type data from a public API', estMinutes: 75 },
    { id: 'p4-s7-build', order: 7, slug: 'build', title: 'Build: an API-driven app', canDo: 'build a typed app that fetches live data', estMinutes: 360 },
  ],
  // P5 — Backend + Auth + DB (Supabase) (curated)
  'phase-5': [
    { id: 'p5-s1-fullstack', order: 1, slug: 'fullstack', title: 'How full-stack works', canDo: 'explain how frontend, API and database fit together', estMinutes: 45 },
    { id: 'p5-s2-supabase', order: 2, slug: 'supabase', title: 'Supabase & databases', canDo: 'set up a Supabase project and a table', estMinutes: 75 },
    { id: 'p5-s3-crud', order: 3, slug: 'crud', title: 'Reading & writing data (CRUD)', canDo: 'create, read, update and delete data from React', estMinutes: 90 },
    { id: 'p5-s4-auth', order: 4, slug: 'auth', title: 'Authentication', canDo: 'add signup and login with Supabase Auth', estMinutes: 90 },
    { id: 'p5-s5-rls', order: 5, slug: 'rls', title: 'Row Level Security', canDo: 'secure data so users only see their own', estMinutes: 60 },
    { id: 'p5-s6-build', order: 6, slug: 'build', title: 'Build: a full-stack app', canDo: 'build a full-stack app with auth and a database', estMinutes: 600 },
  ],
  // P6 — Quality & Ship (curated)
  'phase-6': [
    { id: 'p6-s1-deploy', order: 1, slug: 'deploy', title: 'Deploy to the web', canDo: 'deploy a React app to Vercel from GitHub', estMinutes: 60 },
    { id: 'p6-s2-charts', order: 2, slug: 'charts', title: 'Charts with Recharts', canDo: 'visualize data with charts', estMinutes: 45 },
    { id: 'p6-s3-states', order: 3, slug: 'states', title: 'Loading, empty & error states', canDo: 'handle loading, empty and error UI states', estMinutes: 45 },
    { id: 'p6-s4-testing', order: 4, slug: 'testing', title: 'Testing basics', canDo: 'write basic tests with Vitest and React Testing Library', estMinutes: 90 },
    { id: 'p6-s5-a11y', order: 5, slug: 'a11y', title: 'Accessibility basics', canDo: 'make your app usable for everyone', estMinutes: 45 },
    { id: 'p6-s6-build', order: 6, slug: 'build', title: 'Ship: deploy your app publicly', canDo: 'ship a polished app to a public URL', estMinutes: 360 },
  ],
  // P7 — What's next (curated, lighter)
  'phase-7': [
    { id: 'p7-s1-reps', order: 1, slug: 'reps', title: 'Keep building', canDo: 'build reps and escape tutorial hell', estMinutes: 30 },
    { id: 'p7-s2-toolkit', order: 2, slug: 'toolkit', title: 'Learn-when-needed toolkit', canDo: 'know which tools to reach for next', estMinutes: 45 },
    { id: 'p7-s3-portfolio', order: 3, slug: 'portfolio', title: 'Portfolio & using AI well', canDo: 'build 3 of your own apps, then assemble a portfolio', estMinutes: 1800 },
  ],
}

// Course-level guidance fade (set per phase as it converts).
export const PHASE_FADE = {
  'phase-0': 'full', 'phase-1': 'full', 'phase-2': 'full',
  'phase-3': 'medium', 'phase-4': 'medium',
  'phase-5': 'light', 'phase-6': 'light', 'phase-7': 'light',
}
