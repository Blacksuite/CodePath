import { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { PHASES, PHASE_BY_ID, phaseIndex, TOTAL_UNITS, LESSON_MAP } from '../data/curriculum.js'
import { storage } from './persistence.js'

// ---- gamification constants ----
export const XP = { LESSON: 30, PHASE_BONUS: 50, QUIZ_PASS: 80, QUIZ_PERFECT: 40, SLAB_LESSON: 100 }
export const XP_PER_LEVEL = 300
const WEEK = 604800000

const EMPTY = {
  completedLessons: {}, // structured lessonIds AND legacy slab phaseIds → true
  legacyPhaseComplete: {},
  quizScores: {},
  xp: 0,
  badges: {},
  streak: { count: 0, lastWeekIdx: null }, // forgiving weekly streak
  lastLessonId: null,
  lastVisited: null,
  freeRoam: false,
  awarded: {},
}

function load() {
  const saved = storage.load()
  return saved ? { ...EMPTY, ...saved } : { ...EMPTY }
}
function thisWeekIdx() {
  return Math.floor(Date.now() / WEEK)
}

export function levelFromXp(xp) { return Math.floor(xp / XP_PER_LEVEL) + 1 }
export function levelProgress(xp) {
  const into = xp % XP_PER_LEVEL
  return { into, needed: XP_PER_LEVEL, pct: Math.round((into / XP_PER_LEVEL) * 100) }
}

// is a phase's "lesson" unit complete? structured = all lessons done; legacy = the phase flag
export function phaseLessonsComplete(state, phaseId) {
  const lessons = LESSON_MAP[phaseId]
  if (lessons && lessons.length) return lessons.every((l) => state.completedLessons[l.id])
  return Boolean(state.completedLessons[phaseId])
}

const ProgressCtx = createContext(null)

export function ProgressProvider({ children }) {
  const [state, setState] = useState(load) // localStorage cache → instant first paint
  const hydrated = useRef(false)

  // On mount, pull authoritative progress from the backend (source of truth across devices).
  useEffect(() => {
    let alive = true
    storage.loadRemote()
      .then((remote) => { if (alive && remote) setState(remote) })
      .finally(() => { hydrated.current = true })
    return () => { alive = false }
  }, [])

  // Persist on change — but not before the remote read, so we never clobber server data
  // with a stale local cache on a fresh device.
  useEffect(() => {
    if (!hydrated.current) return
    storage.save(state)
  }, [state])

  const actions = useMemo(() => {
    function withStreak(s) {
      const t = thisWeekIdx()
      const last = s.streak.lastWeekIdx
      if (last == null) return { count: 1, lastWeekIdx: t }
      const diff = t - last
      if (diff <= 0) return s.streak
      if (diff === 1) return { count: s.streak.count + 1, lastWeekIdx: t }
      if (diff === 2) return { count: s.streak.count, lastWeekIdx: t } // one grace week — forgiving
      return { count: 1, lastWeekIdx: t }
    }
    function recomputeBadges(s) {
      const b = { ...s.badges }
      for (const p of PHASES) {
        if (phaseLessonsComplete(s, p.id) && s.quizScores[p.id]?.passed) b[`${p.id}-complete`] = true
      }
      if (Object.values(s.quizScores).some((q) => q.perfect)) b['quiz-ace'] = true
      if (s.streak.count >= 3) b['streak-3'] = true
      if (s.streak.count >= 7) b['streak-7'] = true
      if (s.streak.count >= 30) b['streak-30'] = true
      if (PHASES.every((p) => phaseLessonsComplete(s, p.id) && s.quizScores[p.id]?.passed)) b['graduate'] = true
      return b
    }

    return {
      // structured micro-lesson completion
      completeStructuredLesson(lessonId, phaseId) {
        setState((s) => {
          const next = { ...s, completedLessons: { ...s.completedLessons, [lessonId]: true }, lastLessonId: lessonId, lastVisited: { phaseId } }
          const guard = `lesson:${lessonId}`
          if (!s.awarded[guard]) { next.xp = s.xp + XP.LESSON; next.awarded = { ...s.awarded, [guard]: true } }
          // phase-complete bonus
          if (phaseLessonsComplete(next, phaseId)) {
            const pg = `phasebonus:${phaseId}`
            if (!next.awarded[pg]) { next.xp += XP.PHASE_BONUS; next.awarded = { ...next.awarded, [pg]: true } }
          }
          next.streak = withStreak(s)
          next.badges = recomputeBadges(next)
          return next
        })
      },
      // legacy slab completion (phases not yet converted)
      completeLesson(phaseId) {
        setState((s) => {
          const next = { ...s, completedLessons: { ...s.completedLessons, [phaseId]: true }, lastVisited: { phaseId } }
          const guard = `slab:${phaseId}`
          if (!s.awarded[guard]) { next.xp = s.xp + XP.SLAB_LESSON; next.awarded = { ...s.awarded, [guard]: true } }
          next.streak = withStreak(s)
          next.badges = recomputeBadges(next)
          return next
        })
      },
      recordQuiz(phaseId, fraction, passThreshold = 0.7) {
        setState((s) => {
          const passed = fraction >= passThreshold
          const perfect = fraction >= 0.999
          const prev = s.quizScores[phaseId] || { best: 0, attempts: 0 }
          const score = { best: Math.max(prev.best, fraction), attempts: prev.attempts + 1, passed: prev.passed || passed, perfect: prev.perfect || perfect }
          const next = { ...s, quizScores: { ...s.quizScores, [phaseId]: score }, lastVisited: { phaseId } }
          let xp = s.xp
          if (passed && !s.awarded[`quizpass:${phaseId}`]) { xp += XP.QUIZ_PASS; next.awarded = { ...next.awarded, [`quizpass:${phaseId}`]: true } }
          if (perfect && !next.awarded[`quizperfect:${phaseId}`]) { xp += XP.QUIZ_PERFECT; next.awarded = { ...next.awarded, [`quizperfect:${phaseId}`]: true } }
          next.xp = xp
          next.streak = withStreak(s)
          next.badges = recomputeBadges(next)
          return next
        })
      },
      visit(phaseId) { setState((s) => (s.lastVisited?.phaseId === phaseId ? s : { ...s, lastVisited: { phaseId } })) },
      setFreeRoam(v) { setState((s) => ({ ...s, freeRoam: v })) },
      reset() { setState({ ...EMPTY }) },
      importData(obj) { setState({ ...EMPTY, ...obj }) },
    }
  }, [])

  const derived = useMemo(() => {
    const lessonsDone = PHASES.filter((p) => phaseLessonsComplete(state, p.id)).length
    const quizzesDone = PHASES.filter((p) => state.quizScores[p.id]?.passed).length
    const unitsDone = lessonsDone + quizzesDone
    const overallPct = Math.round((unitsDone / TOTAL_UNITS) * 100)

    function isUnlocked(phaseId) {
      if (state.freeRoam) return true
      const idx = phaseIndex(phaseId)
      if (idx <= 0) return true
      return Boolean(state.quizScores[PHASES[idx - 1].id]?.passed)
    }
    function phaseStatus(phaseId) {
      const lesson = phaseLessonsComplete(state, phaseId)
      const quiz = Boolean(state.quizScores[phaseId]?.passed)
      return { lesson, quiz, done: lesson && quiz, unlocked: isUnlocked(phaseId), pct: (Number(lesson) + Number(quiz)) * 50 }
    }
    function lessonDone(lessonId) { return Boolean(state.completedLessons[lessonId]) }
    function phaseLessonProgress(phaseId) {
      const lessons = LESSON_MAP[phaseId] || []
      return { done: lessons.filter((l) => state.completedLessons[l.id]).length, total: lessons.length }
    }
    function nextLessonInPhase(phaseId) {
      const lessons = LESSON_MAP[phaseId] || []
      return lessons.find((l) => !state.completedLessons[l.id]) || null
    }

    let nextPhase = PHASES.find((p) => isUnlocked(p.id) && !(phaseLessonsComplete(state, p.id) && state.quizScores[p.id]?.passed))
    if (!nextPhase) nextPhase = state.lastVisited ? PHASE_BY_ID[state.lastVisited.phaseId] : PHASES[0]

    return {
      lessonsDone, quizzesDone, unitsDone, overallPct,
      isUnlocked, phaseStatus, lessonDone, phaseLessonProgress, nextLessonInPhase, nextPhase,
      badgeCount: Object.keys(state.badges).length,
      level: levelFromXp(state.xp), levelProgress: levelProgress(state.xp),
    }
  }, [state])

  const value = useMemo(() => ({ state, ...actions, ...derived }), [state, actions, derived])
  return <ProgressCtx.Provider value={value}>{children}</ProgressCtx.Provider>
}

export function useProgress() {
  const ctx = useContext(ProgressCtx)
  if (!ctx) throw new Error('useProgress must be used inside ProgressProvider')
  return ctx
}
