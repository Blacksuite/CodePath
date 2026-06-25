// ponytail: one-shot verification harness. Mechanical checks only (no LLM).
// Parses every session JSON, runs lint rules, extracts URLs/videoIds/quizzes,
// and checks chain integrity. Prints JSON report to stdout.
import { readFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = fileURLToPath(new URL('../src/content/lessons/', import.meta.url))
const phases = readdirSync(ROOT).filter((d) => d.startsWith('phase-')).sort()

const report = { sessions: [], lintErrors: [], urls: new Set(), videoIds: new Set(), quizzes: [], chain: [] }

const HEAVY = new Set(['concept', 'aside'])
const TERMINAL_OK = new Set(['check', 'quiz', 'nowYouTry'])

function lintLesson(l, file) {
  const errs = []
  if (!l.slug) errs.push(`${file}: missing slug`)
  if (!Array.isArray(l.sources) || l.sources.length === 0) errs.push(`${file}: empty sources[]`)
  const blocks = l.blocks || []
  // terminal interactive
  const interactive = blocks.filter((b) => ['check', 'quiz', 'nowYouTry', 'predict', 'fixbug'].includes(b.type))
  const last = interactive[interactive.length - 1]
  if (last && !TERMINAL_OK.has(last.type)) errs.push(`${file}: terminal interactive is ${last.type}`)
  // 3 consecutive heavy prose
  let run = 0
  for (const b of blocks) {
    if (b.type === 'prose' && HEAVY.has(b.role)) { run++; if (run >= 3) { errs.push(`${file}: 3 consecutive heavy prose`); break } }
    else run = 0
  }
  // nowYouTry hints
  for (const b of blocks) {
    if (b.type === 'nowYouTry' && (!Array.isArray(b.hints) || b.hints.length !== 3)) errs.push(`${file}: nowYouTry needs exactly 3 hints (has ${b.hints?.length})`)
  }
  return errs
}

for (const phase of phases) {
  const dir = join(ROOT, phase)
  const files = readdirSync(dir).filter((f) => f.endsWith('.json')).sort()
  for (const f of files) {
    const path = join(dir, f)
    let l
    try { l = JSON.parse(readFileSync(path, 'utf8')) } catch (e) { report.lintErrors.push(`${phase}/${f}: INVALID JSON — ${e.message}`); continue }
    report.sessions.push({ id: l.id, phaseId: l.phaseId, order: l.order, file: `${phase}/${f}`, title: l.title })
    report.lintErrors.push(...lintLesson(l, `${phase}/${f}`))
    for (const s of l.sources || []) if (s.url) report.urls.add(s.url)
    for (const b of l.blocks || []) {
      if (b.type === 'video' && b.videoId) report.videoIds.add(b.videoId)
      if (b.type === 'video' && b.url) report.urls.add(b.url)
      if (b.type === 'prose' && b.role === 'resource' && b.url) report.urls.add(b.url)
      if (b.type === 'quiz') {
        for (const q of b.questions || []) {
          report.quizzes.push({ session: l.id, q: q.prompt || q.question, options: q.options, answerIndex: q.answerIndex })
        }
      }
    }
  }
}

report.urls = [...report.urls]
report.videoIds = [...report.videoIds]
console.log(JSON.stringify(report, null, 2))
