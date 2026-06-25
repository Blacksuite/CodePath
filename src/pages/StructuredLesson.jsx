import { useParams, Link, useNavigate } from 'react-router-dom'
import { useEffect, useMemo, useState } from 'react'
import { PHASE_BY_ID, LESSON_MAP } from '../data/curriculum.js'
import { getLesson } from '../lib/lessons.js'
import { useProgress } from '../lib/progress.jsx'
import { BlockRenderer, INTERACTIVE } from '../components/blocks/index.jsx'

export default function StructuredLesson() {
  const { id: phaseId, lessonId } = useParams()
  const navigate = useNavigate()
  const phase = PHASE_BY_ID[phaseId]
  const lesson = getLesson(lessonId)
  const { completeStructuredLesson, lessonDone, visit } = useProgress()

  const [resolved, setResolved] = useState(() => new Set())

  useEffect(() => { setResolved(new Set()); window.scrollTo(0, 0); if (phase) visit(phase.id) }, [lessonId, phase, visit])

  const terminalIdx = useMemo(() => {
    if (!lesson) return -1
    for (let i = lesson.blocks.length - 1; i >= 0; i--) if (INTERACTIVE.has(lesson.blocks[i].type)) return i
    return -1
  }, [lesson])

  if (!phase || !lesson) return <Link to="/" className="btn-ghost">← Dashboard</Link>

  const lessons = LESSON_MAP[phaseId] || []
  const pos = lessons.findIndex((l) => l.id === lessonId)
  const nextLesson = lessons[pos + 1]
  const done = lessonDone(lessonId)
  const ready = done || terminalIdx === -1 || resolved.has(terminalIdx)

  function finish() {
    completeStructuredLesson(lessonId, phaseId)
    if (nextLesson) navigate(`/phase/${phaseId}/lesson/${nextLesson.id}`)
    else navigate(`/phase/${phaseId}/quiz`)
  }

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-4">
      <div className="flex items-center justify-between">
        <Link to={`/phase/${phaseId}`} className="text-sm text-slate-400 hover:text-slate-200">← {phase.title}</Link>
        <span className="text-sm text-slate-400">Lesson {pos + 1} / {lessons.length}</span>
      </div>

      <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
        <div className="h-full rounded-full bg-brand-500 transition-all" style={{ width: `${((pos + 1) / lessons.length) * 100}%` }} />
      </div>

      <h1 className="text-2xl font-extrabold text-white">{lesson.title}</h1>

      <article className="card p-5 sm:p-7">
        {lesson.blocks.map((b, i) => (
          <BlockRenderer key={i} block={b} onResolved={() => setResolved((prev) => new Set(prev).add(i))} />
        ))}

        {Array.isArray(lesson.sources) && lesson.sources.length > 0 && (
          <details className="mt-6 border-t border-white/10 pt-3 text-xs text-slate-500">
            <summary className="cursor-pointer">Sources & attribution</summary>
            <ul className="mt-2 space-y-1">
              {lesson.sources.map((s, i) => (
                <li key={i}>
                  <a href={s.url} target="_blank" rel="noreferrer noopener" className="text-brand-400 hover:underline">{s.name}</a>
                  {s.topic ? ` — ${s.topic}` : ''}{s.license ? ` · ${s.license}` : ''}{s.reviewed ? ` · reviewed ${s.reviewed}` : ''}
                </li>
              ))}
            </ul>
          </details>
        )}
      </article>

      <div className="card sticky bottom-4 flex flex-wrap items-center justify-between gap-3 p-4">
        <div className="text-sm text-slate-400">
          {done ? '✅ Completed.' : ready ? 'Nice — you’re ready to move on.' : 'Finish the check or build task above to continue.'}
        </div>
        <div className="flex gap-2">
          {pos > 0 && <Link to={`/phase/${phaseId}/lesson/${lessons[pos - 1].id}`} className="btn-ghost">← Previous</Link>}
          <button onClick={finish} disabled={!ready} className="btn-primary">
            {nextLesson ? 'Complete & continue →' : 'Complete & take the quiz →'}
          </button>
        </div>
      </div>
    </div>
  )
}
