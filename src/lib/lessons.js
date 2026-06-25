// Loads structured lesson JSON and provides a dev-time lint. See content/lessons/SCHEMA.md.
const lessonModules = import.meta.glob('../content/lessons/*/*.json', { import: 'default', eager: true })

// key: '../content/lessons/phase-3/3-usestate.json'
const byPhase = {}
for (const [path, lesson] of Object.entries(lessonModules)) {
  const phaseId = path.split('/').slice(-2, -1)[0]
  ;(byPhase[phaseId] ||= []).push(lesson)
}
for (const p of Object.keys(byPhase)) byPhase[p].sort((a, b) => a.order - b.order)

export function lessonsForPhase(phaseId) {
  return byPhase[phaseId] || []
}
export function getLesson(lessonId) {
  for (const list of Object.values(byPhase)) {
    const found = list.find((l) => l.id === lessonId)
    if (found) return found
  }
  return null
}
export function phaseHasLessons(phaseId) {
  return (byPhase[phaseId] || []).length > 0
}

// ---- dev-time lint: surfaces structural problems early (no build dependency) ----
export function lintLesson(lesson) {
  const errs = []
  if (!lesson.id || !lesson.phaseId || lesson.order == null) errs.push('missing id/phaseId/order')
  const blocks = lesson.blocks || []
  if (!blocks.length) errs.push('no blocks')
  const last = blocks[blocks.length - 1]
  const terminalOk = blocks.some((b) => b.type === 'check' || b.type === 'nowYouTry' || b.type === 'quiz')
  if (!terminalOk) errs.push('no terminal check/nowYouTry block')
  if (last && last.type === 'prose' && last.role !== 'recap') errs.push('ends on non-recap prose')
  // No wall of text: flag 3+ consecutive genuinely-dense prose (concept/aside).
  // Framing bands (hook, objective, recap), callouts, and resource link-cards are visually
  // distinct breaks, not walls — they don't count toward the run.
  const HEAVY = new Set(['concept', 'aside'])
  let heavyRun = 0
  for (const b of blocks) {
    heavyRun = b.type === 'prose' && HEAVY.has(b.role) ? heavyRun + 1 : 0
    if (heavyRun >= 3) { errs.push('3+ consecutive heavy prose blocks'); break }
  }
  for (const b of blocks) {
    if (b.type === 'nowYouTry' && (!Array.isArray(b.hints) || b.hints.length !== 3)) errs.push('nowYouTry needs exactly 3 hints')
  }
  return errs
}

if (import.meta.env?.DEV) {
  for (const list of Object.values(byPhase)) {
    for (const l of list) {
      const errs = lintLesson(l)
      if (errs.length) console.warn(`[lesson-lint] ${l.id}:`, errs.join(' · '))
    }
  }
}
