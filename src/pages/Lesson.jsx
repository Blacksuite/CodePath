import { useParams, Link } from 'react-router-dom'
import { useEffect } from 'react'
import { PHASE_BY_ID } from '../data/curriculum.js'
import { useProgress } from '../lib/progress.jsx'
import { lessonMarkdown } from '../lib/content.js'
import Markdown from '../components/Markdown.jsx'

export default function Lesson() {
  const { id } = useParams()
  const phase = PHASE_BY_ID[id]
  const { state, completeLesson, visit } = useProgress()

  useEffect(() => {
    if (phase) visit(phase.id)
    window.scrollTo(0, 0)
  }, [phase, visit])

  if (!phase) return <Link to="/" className="btn-ghost">← Back to dashboard</Link>
  const done = Boolean(state.completedLessons[phase.id])

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <Link to={`/phase/${phase.id}`} className="text-sm text-slate-400 hover:text-slate-200">← {phase.title}</Link>
        <span className="pill bg-white/5 text-slate-400">Phase {phase.num}</span>
      </div>

      <article className="card p-5 sm:p-8">
        <Markdown>{lessonMarkdown(phase.lessonFile)}</Markdown>
      </article>

      <div className="card sticky bottom-4 flex flex-wrap items-center justify-between gap-3 p-4">
        <div className="text-sm text-slate-400">
          {done ? '✅ Marked complete (+100 XP earned).' : 'Read it? Mark it done to earn XP and unlock progress.'}
        </div>
        <div className="flex gap-2">
          {done ? (
            <Link to={`/phase/${phase.id}/quiz`} className="btn-primary">Take the quiz →</Link>
          ) : (
            <button className="btn-primary" onClick={() => completeLesson(phase.id)}>Mark lesson complete</button>
          )}
        </div>
      </div>
    </div>
  )
}
