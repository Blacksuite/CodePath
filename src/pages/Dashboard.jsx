import { Link } from 'react-router-dom'
import { useProgress } from '../lib/progress.jsx'
import { PHASES } from '../data/curriculum.js'
import { getLesson } from '../lib/lessons.js'
import { ProgressRing, XPBar, Stat, Badge, BADGE_META } from '../components/ui.jsx'

function PhaseCard({ phase }) {
  const { phaseStatus } = useProgress()
  const st = phaseStatus(phase.id)
  const locked = !st.unlocked
  const Wrapper = locked ? 'div' : Link
  return (
    <Wrapper
      to={locked ? undefined : `/phase/${phase.id}`}
      className={`card group relative flex flex-col gap-3 p-4 transition ${locked ? 'cursor-not-allowed opacity-60' : 'hover:-translate-y-0.5 hover:shadow-glow'}`}
    >
      <div className="flex items-start justify-between">
        <div className="grid h-10 w-10 place-items-center rounded-xl text-lg font-extrabold text-white" style={{ background: phase.accent + '33', color: phase.accent }}>
          {st.done ? '✓' : locked ? '🔒' : phase.num}
        </div>
        {phase.flagship && <span className="pill bg-brand-500/15 text-brand-400">flagship</span>}
      </div>
      <div>
        <div className="font-bold text-white">{phase.title}</div>
        <div className="text-xs text-slate-400">{phase.subtitle}</div>
      </div>
      <div className="mt-auto">
        <div className="mb-1 flex justify-between text-[11px] text-slate-400">
          <span>{phase.time}</span>
          <span>{st.pct}%</span>
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
          <div className="h-full rounded-full" style={{ width: `${st.pct}%`, background: phase.accent }} />
        </div>
        <div className="mt-2 flex gap-2 text-[11px] text-slate-400">
          <span className={st.lesson ? 'text-mint-400' : ''}>{st.lesson ? '✓' : '○'} Lesson</span>
          <span className={st.quiz ? 'text-mint-400' : ''}>{st.quiz ? '✓' : '○'} Quiz</span>
        </div>
      </div>
    </Wrapper>
  )
}

export default function Dashboard() {
  const { overallPct, unitsDone, lessonsDone, quizzesDone, level, levelProgress, state, nextPhase, badgeCount } = useProgress()
  const totalUnits = PHASES.length * 2

  return (
    <div className="flex flex-col gap-8">
      {/* hero */}
      <section className="card relative overflow-hidden p-6 sm:p-8">
        <div className="relative z-10 flex flex-col items-center gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="max-w-md">
            <h1 className="text-2xl font-extrabold text-white sm:text-3xl">
              {overallPct === 0 ? 'Welcome. Let’s start coding.' : overallPct === 100 ? 'You did it. 🎓' : 'Welcome back.'}
            </h1>
            <p className="mt-2 text-sm text-slate-400">
              {overallPct === 100
                ? 'Every phase complete. Keep building — the portfolio is yours now.'
                : `You’ve completed ${unitsDone} of ${totalUnits} steps. Small sessions, steady progress.`}
            </p>
            {(() => {
              const resume = state.lastLessonId ? getLesson(state.lastLessonId) : null
              return (
                <div className="mt-5 flex flex-wrap gap-3">
                  {resume ? (
                    <Link to={`/phase/${resume.phaseId}/lesson/${resume.id}`} className="btn-primary">Continue: {resume.title} →</Link>
                  ) : nextPhase ? (
                    <Link to={`/phase/${nextPhase.id}`} className="btn-primary">{overallPct === 0 ? 'Start Phase 0 →' : `Continue: ${nextPhase.title} →`}</Link>
                  ) : null}
                  <Link to="/how-to-learn" className="btn-ghost">How to learn this</Link>
                </div>
              )
            })()}
          </div>
          <ProgressRing value={overallPct} label={`${overallPct}%`} sublabel="complete" size={140} />
        </div>
      </section>

      {/* stats */}
      <section className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat icon="⭐" value={`Lv ${level}`} label="Level" tone="text-brand-400" />
        <Stat icon="🔥" value={state.streak.count} label="Week streak" tone="text-gold-400" />
        <Stat icon="📚" value={`${lessonsDone}/${PHASES.length}`} label="Lessons" />
        <Stat icon="🧪" value={`${quizzesDone}/${PHASES.length}`} label="Quizzes passed" />
      </section>

      <section className="card p-5">
        <XPBar pct={levelProgress.pct} into={levelProgress.into} needed={levelProgress.needed} level={level} />
      </section>

      {/* phases */}
      <section>
        <h2 className="mb-3 text-lg font-bold text-white">Your path</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {PHASES.map((p) => <PhaseCard key={p.id} phase={p} />)}
        </div>
      </section>

      {/* badges */}
      <section>
        <h2 className="mb-3 flex items-center gap-2 text-lg font-bold text-white">
          Badges <span className="pill bg-white/5 text-slate-400">{badgeCount} earned</span>
        </h2>
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-6 lg:grid-cols-7">
          {Object.keys(BADGE_META).map((id) => <Badge key={id} id={id} earned={Boolean(state.badges[id])} />)}
        </div>
      </section>
    </div>
  )
}
