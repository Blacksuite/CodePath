# Lesson content schema (v1)

A lesson is one JSON file: `src/content/lessons/<phaseId>/<order>-<slug>.json`.

```jsonc
{
  "id": "p3-l03-usestate",     // STABLE, never reused/renumbered. Progress keys on this.
  "phaseId": "phase-3",
  "order": 3,
  "title": "State with useState",
  "canDo": "add state to a component and update it from an event",  // one observable outcome
  "estMinutes": 15,            // 8-20
  "fade": "medium",            // full | medium | light (course-level guidance density)
  "sources": [                 // ATTRIBUTION — required when a block is adapted from a source
    { "name": "react.dev", "url": "https://react.dev/learn/state-a-components-memory",
      "license": "CC-BY-4.0", "reviewed": "2026-06-23", "topic": "useState" }
  ],
  "blocks": [ /* ordered Block[] — see below */ ]
}
```

## Block types (7)
```jsonc
// 1. prose — absorbs hook/objective/concept/callout/recap/resource/aside
{ "type": "prose", "role": "hook|objective|concept|callout|recap|resource|aside",
  "md": "markdown string",
  "variant": "mistake|tip|break|recall",   // callout only
  "canDo": "…", "estMinutes": 15,          // objective only
  "bullets": ["…"], "nextLessonId": "p3-l04-…", "nextLessonTitle": "…", // recap only
  "url": "…", "source": "react.dev", "label": "…",                      // resource only
  "collapsed": true, "refLessonId": "p3-l02-…" }                        // aside / recall

// 2. code — narrated worked example; live Sandpack from P2+
{ "type": "code", "lang": "jsx", "code": "…", "caption": "line narration (md)",
  "sandpack": true, "sandpackFiles": { "/App.js": "…" }, "runUrl": "https://…" }

// 3. video — verified free clip at the modality-switch moment
{ "type": "video", "title": "…", "url": "https://…", "source": "react.dev|freeCodeCamp|Scrimba|MDN|youtube",
  "startSeconds": 0, "minutes": 6, "note": "watch 0:00-6:00 then come back" }

// 4. predict — predict the output before reveal
{ "type": "predict", "lang": "js", "code": "…", "prompt": "What does this log?",
  "answer": "…", "explanation": "md", "choices": ["…"] }   // choices optional (MC variant)

// 5. fixbug — broken code → learner fixes → reveal (from the ⚠️ mistake lines)
{ "type": "fixbug", "lang": "jsx", "brokenCode": "…", "prompt": "What's wrong and how do you fix it?",
  "fixedCode": "…", "explanation": "md", "sandpack": false }

// 6. check — the 🧠 concept-check: question + sample answer, self-marked. TERMINAL gate.
{ "type": "check", "question": "…", "sampleAnswer": "md", "selfMark": true }

// 7b. quiz — a short GRADED multiple-choice quiz (per-session). Counts as a terminal block.
{ "type": "quiz", "passThreshold": 0.7, "questions": [
  { "question": "…", "options": ["…","…","…","…"], "answerIndex": 0, "explanation": "one sentence" }
] }  // 3–4 questions, exactly 4 options each, one correct, vary answerIndex

// 7. nowYouTry — advance the running build one verifiable step. Highest-care block.
{ "type": "nowYouTry", "task": "md",
  "sandpack": true, "sandpackFiles": { "/App.js": "starter…" },   // P2+ ; or "starterCode": "…"
  "definitionOfDone": "the app now … (what you should SEE working)",
  "hints": ["nudge", "partial", "answer"],   // EXACTLY 3, escalating
  "gatedSolution": true, "solutionCode": "…" }  // or "solutionUrl": "https://…"
```

## Rules (enforced by dev-lint)
- **One new concept per lesson**, 8–20 min. Two verbs in `canDo` → two lessons.
- **No 3 consecutive _heavy_ `prose` blocks** (role concept/callout/aside/resource/recap). The short framing bands (hook, objective) don't count — the `hook → objective → concept → code` opener is the intended pattern.
- **Terminal block must be `check`, `quiz`, or `nowYouTry`** (never end on prose; recap may follow but completion gates on the last interactive block).
- **Curated sessions** (the current model): a session = focus-note prose + the best resource (`video` embed and/or `prose role:"resource"` link cards with "do this, come back") + a graded `quiz` (or a `nowYouTry` for build sessions). Point at the best EXISTING course; don't re-teach it.
- Every factual/code block traces to a verified source; **`sources[]` is required** when adapted. No invented APIs.
- Respect freshness fixes (react.dev modern hooks, no create-react-app, `react-router` import on P4, `VITE_SUPABASE_PUBLISHABLE_KEY` on P5/6, Node v24, current MDN URLs).
