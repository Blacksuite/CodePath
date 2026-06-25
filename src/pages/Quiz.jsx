import { useParams, Link } from 'react-router-dom'
import { useEffect, useMemo, useState } from 'react'
import { PHASE_BY_ID, PHASES, phaseIndex } from '../data/curriculum.js'
import { useProgress } from '../lib/progress.jsx'
import { quizFor } from '../lib/content.js'

// Renders inline `code` spans inside quiz text (questions/options/explanations).
function Rich({ text }) {
  return String(text).split(/(`[^`]+`)/g).map((p, i) =>
    p.startsWith('`') && p.endsWith('`')
      ? <code key={i} className="rounded bg-white/10 px-1 py-0.5 font-mono text-[0.9em] text-mint-400">{p.slice(1, -1)}</code>
      : <span key={i}>{p}</span>
  )
}

export default function Quiz() {
  const { id } = useParams()
  const phase = PHASE_BY_ID[id]
  const quiz = quizFor(id)
  const { recordQuiz, visit } = useProgress()

  const [i, setI] = useState(0)
  const [picked, setPicked] = useState(null) // index picked for current q
  const [answers, setAnswers] = useState([]) // booleans correct/incorrect
  const [done, setDone] = useState(false)
  const [recorded, setRecorded] = useState(false)

  useEffect(() => { if (phase) visit(phase.id) }, [phase, visit])

  const score = useMemo(() => (answers.length ? answers.filter(Boolean).length / quiz.questions.length : 0), [answers, quiz])

  useEffect(() => {
    if (done && !recorded && quiz) {
      recordQuiz(phase.id, score, quiz.passThreshold)
      setRecorded(true)
    }
  }, [done, recorded, quiz, phase, score, recordQuiz])

  if (!phase) return <Link to="/" className="btn-ghost">← Dashboard</Link>
  if (!quiz) return (
    <div className="card p-8 text-center text-slate-400">
      No quiz for this phase. <Link to={`/phase/${phase.id}`} className="text-brand-400">Back to {phase.title}</Link>
    </div>
  )

  const q = quiz.questions[i]
  const isLast = i === quiz.questions.length - 1

  function choose(idx) {
    if (picked !== null) return
    setPicked(idx)
    setAnswers((a) => [...a, idx === q.answerIndex])
  }
  function next() {
    if (isLast) { setDone(true); return }
    setI((n) => n + 1)
    setPicked(null)
  }
  function retry() {
    setI(0); setPicked(null); setAnswers([]); setDone(false); setRecorded(false)
  }

  if (done) {
    const passed = score >= quiz.passThreshold
    const pct = Math.round(score * 100)
    const nextPhase = PHASES[phaseIndex(phase.id) + 1]
    return (
      <div className="mx-auto max-w-xl">
        <div className="card p-8 text-center">
          <div className="text-5xl">{score >= 0.999 ? '💯' : passed ? '🎉' : '💪'}</div>
          <h1 className="mt-3 text-2xl font-extrabold text-white">{passed ? 'Quiz passed!' : 'Not quite yet'}</h1>
          <p className="mt-1 text-slate-400">You scored {answers.filter(Boolean).length} / {quiz.questions.length} ({pct}%). Pass mark is {Math.round(quiz.passThreshold * 100)}%.</p>
          {passed && !recorded && <p className="mt-1 text-mint-400">Nice — XP awarded.</p>}
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <button onClick={retry} className="btn-ghost">Try again</button>
            <Link to={`/phase/${phase.id}`} className="btn-ghost">Back to phase</Link>
            {passed && nextPhase && <Link to={`/phase/${nextPhase.id}`} className="btn-primary">Next: {nextPhase.title} →</Link>}
            {passed && !nextPhase && <Link to="/" className="btn-primary">Finish 🎓</Link>}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto flex max-w-xl flex-col gap-5">
      <div className="flex items-center justify-between">
        <Link to={`/phase/${phase.id}`} className="text-sm text-slate-400 hover:text-slate-200">← {phase.title}</Link>
        <span className="text-sm text-slate-400">Question {i + 1} / {quiz.questions.length}</span>
      </div>

      <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
        <div className="h-full rounded-full bg-brand-500 transition-all" style={{ width: `${((i + (picked !== null ? 1 : 0)) / quiz.questions.length) * 100}%` }} />
      </div>

      <div className="card p-6">
        <h2 className="text-lg font-bold text-white"><Rich text={q.question} /></h2>
        <div className="mt-4 flex flex-col gap-2">
          {q.options.map((opt, idx) => {
            const isAnswer = idx === q.answerIndex
            const isPicked = idx === picked
            let cls = 'border-white/10 hover:bg-white/5'
            if (picked !== null) {
              if (isAnswer) cls = 'border-mint-500/50 bg-mint-500/10 text-white'
              else if (isPicked) cls = 'border-rose-500/50 bg-rose-500/10 text-white'
              else cls = 'border-white/5 opacity-60'
            }
            return (
              <button
                key={idx}
                onClick={() => choose(idx)}
                disabled={picked !== null}
                className={`flex items-center gap-3 rounded-xl border px-4 py-3 text-left text-sm transition ${cls}`}
              >
                <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full border border-white/15 text-xs">{'ABCD'[idx]}</span>
                <span><Rich text={opt} /></span>
                {picked !== null && isAnswer && <span className="ml-auto text-mint-400">✓</span>}
                {picked !== null && isPicked && !isAnswer && <span className="ml-auto text-rose-400">✗</span>}
              </button>
            )
          })}
        </div>

        {picked !== null && (
          <div className="mt-4 rounded-xl border border-white/10 bg-ink-850/60 p-3 text-sm text-slate-300">
            <span className="font-semibold text-brand-400">Why: </span><Rich text={q.explanation} />
          </div>
        )}
      </div>

      <div className="flex justify-end">
        <button onClick={next} disabled={picked === null} className="btn-primary">{isLast ? 'See results' : 'Next question →'}</button>
      </div>
    </div>
  )
}
