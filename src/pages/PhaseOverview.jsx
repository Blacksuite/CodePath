import { useParams, Link, useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import { PHASE_BY_ID, PHASES, phaseIndex, LESSON_MAP } from '../data/curriculum.js'
import { useProgress } from '../lib/progress.jsx'
import { quizFor } from '../lib/content.js'

export default function PhaseOverview() {
  const { id } = useParams()
  const navigate = useNavigate()
  const phase = PHASE_BY_ID[id]
  const { phaseStatus, visit, lessonDone, phaseLessonProgress } = useProgress()

  useEffect(() => { if (phase) visit(phase.id) }, [phase, visit])

  if (!phase) return <Link to="/" className="btn-ghost">← Back to dashboard</Link>

  const st = phaseStatus(phase.id)
  const quiz = quizFor(phase.id)
  const lessons = LESSON_MAP[phase.id] || []
  const lp = phaseLessonProgress(phase.id)
  const idx = phaseIndex(phase.id)
  const prev = PHASES[idx - 1]
  const next = PHASES[idx + 1]

  if (!st.unlocked) {
    return (
      <div className="card p-8 text-center">
        <div className="text-4xl">🔒</div>
        <h1 className="mt-3 text-xl font-bold text-white">{phase.title} is locked</h1>
        <p className="mx-auto mt-2 max-w-sm text-sm text-slate-400">
          Pass the {prev ? prev.title : 'previous'} quiz to unlock it. Want to roam freely? Turn on Free Roam in Settings.
        </p>
        <div className="mt-5 flex justify-center gap-3">
          {prev && <Link to={`/phase/${prev.id}`} className="btn-primary">Go to {prev.title}</Link>}
          <Link to="/settings" className="btn-ghost">Settings</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <Link to="/" className="text-sm text-slate-400 hover:text-slate-200">← Dashboard</Link>
        <div className="mt-2 flex items-center gap-3">
          <span className="grid h-12 w-12 place-items-center rounded-2xl text-xl font-extrabold" style={{ background: phase.accent + '33', color: phase.accent }}>{phase.num}</span>
          <div>
            <h1 className="text-2xl font-extrabold text-white">{phase.title}</h1>
            <p className="text-sm text-slate-400">{phase.subtitle} · {phase.time}</p>
          </div>
        </div>
      </div>

      {lessons.length > 0 ? (
        <>
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400">Lessons</h2>
            <span className="text-xs text-slate-500">{lp.done} / {lp.total} done</span>
          </div>
          <p className="-mt-1 text-xs text-slate-500">⏱ Times are focused minimums — each session points at a full course, so budget more. The whole path is realistically ~12–18 months at a few hours a week (faster if you do more).</p>
          <ol className="flex flex-col gap-2">
            {lessons.map((l, i) => {
              const ld = lessonDone(l.id)
              const prevDone = i === 0 || lessonDone(lessons[i - 1].id)
              return (
                <li key={l.id}>
                  <Link to={`/phase/${phase.id}/lesson/${l.id}`} className="card group flex items-center gap-3 p-4 transition hover:shadow-glow">
                    <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full text-xs font-bold" style={{ background: ld ? '#16c79a' : prevDone ? phase.accent + '33' : 'rgba(255,255,255,0.06)', color: ld ? '#062' : phase.accent }}>
                      {ld ? '✓' : i + 1}
                    </span>
                    <div className="min-w-0">
                      <div className="truncate font-semibold text-white">{l.title}</div>
                      <div className="truncate text-xs text-slate-400">By the end you can {l.canDo}.</div>
                    </div>
                    <span className="ml-auto flex shrink-0 items-center gap-2 text-xs text-slate-500">⏱ {l.estMinutes}m <span className="text-brand-400 transition group-hover:translate-x-1">→</span></span>
                  </Link>
                </li>
              )
            })}
          </ol>

          <Link to={`/phase/${phase.id}/quiz`} className="card group mt-1 flex items-center justify-between p-4 transition hover:shadow-glow">
            <div className="flex items-center gap-2 font-bold text-white">🧪 Phase quiz {st.quiz && <span className="pill bg-mint-500/15 text-mint-400">passed</span>}</div>
            <div className="text-sm text-slate-400">{quiz ? `${quiz.questions.length} questions · pass at ${Math.round(quiz.passThreshold * 100)}%` : ''} <span className="text-brand-400">→</span></div>
          </Link>
        </>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          <Link to={`/phase/${phase.id}/lesson`} className="card group flex items-center justify-between p-5 transition hover:shadow-glow">
            <div>
              <div className="flex items-center gap-2 font-bold text-white">📖 Lesson {st.lesson && <span className="pill bg-mint-500/15 text-mint-400">done</span>}</div>
              <div className="mt-1 text-sm text-slate-400">Read, with concept-checks and exercises.</div>
            </div>
            <span className="text-brand-400 transition group-hover:translate-x-1">→</span>
          </Link>
          <Link to={`/phase/${phase.id}/quiz`} className="card group flex items-center justify-between p-5 transition hover:shadow-glow">
            <div>
              <div className="flex items-center gap-2 font-bold text-white">🧪 Quiz {st.quiz && <span className="pill bg-mint-500/15 text-mint-400">passed</span>}</div>
              <div className="mt-1 text-sm text-slate-400">{quiz ? `${quiz.questions.length} questions · pass at ${Math.round(quiz.passThreshold * 100)}%` : 'No quiz for this phase.'}</div>
            </div>
            <span className="text-brand-400 transition group-hover:translate-x-1">→</span>
          </Link>
        </div>
      )}

      <div className="flex justify-between">
        {prev ? <Link to={`/phase/${prev.id}`} className="btn-ghost">← {prev.title}</Link> : <span />}
        {next && <button onClick={() => navigate(`/phase/${next.id}`)} className="btn-ghost">{next.title} →</button>}
      </div>
    </div>
  )
}
