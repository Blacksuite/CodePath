// Small shared UI primitives. Kept in one file on purpose.

export function ProgressRing({ value = 0, size = 120, stroke = 10, color = '#6d6cf0', label, sublabel }) {
  const r = (size - stroke) / 2
  const c = 2 * Math.PI * r
  const offset = c - (Math.min(100, Math.max(0, value)) / 100) * c
  return (
    <div className="relative inline-grid place-items-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth={stroke} />
        <circle
          cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={stroke}
          strokeDasharray={c} strokeDashoffset={offset} strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 700ms cubic-bezier(.2,.8,.2,1)' }}
        />
      </svg>
      <div className="absolute text-center">
        <div className="text-2xl font-extrabold text-white">{label}</div>
        {sublabel && <div className="text-[11px] uppercase tracking-wide text-slate-400">{sublabel}</div>}
      </div>
    </div>
  )
}

export function XPBar({ pct, into, needed, level }) {
  return (
    <div className="w-full">
      <div className="mb-1 flex items-center justify-between text-xs text-slate-400">
        <span className="font-semibold text-brand-400">Level {level}</span>
        <span>{into} / {needed} XP</span>
      </div>
      <div className="h-2.5 w-full overflow-hidden rounded-full bg-white/10">
        <div className="h-full rounded-full bg-gradient-to-r from-brand-500 to-mint-400 transition-all duration-700" style={{ width: `${pct}%` }} />
      </div>
    </div>
  )
}

export function Stat({ icon, value, label, tone = 'text-white' }) {
  return (
    <div className="card flex items-center gap-3 px-4 py-3">
      <div className="text-2xl">{icon}</div>
      <div>
        <div className={`text-xl font-extrabold leading-none ${tone}`}>{value}</div>
        <div className="text-[11px] uppercase tracking-wide text-slate-400">{label}</div>
      </div>
    </div>
  )
}

export const BADGE_META = {
  'phase-0-complete': { icon: '🛠️', name: 'Bootstrapped' },
  'phase-1-complete': { icon: '🎨', name: 'Page Painter' },
  'phase-2-complete': { icon: '⚡', name: 'It’s Alive' },
  'phase-3-complete': { icon: '⚛️', name: 'React Rookie' },
  'phase-4-complete': { icon: '🧩', name: 'Type Safe' },
  'phase-5-complete': { icon: '🚀', name: 'Full-Stack' },
  'phase-6-complete': { icon: '✅', name: 'Shipped It' },
  'phase-7-complete': { icon: '🧭', name: 'Self-Driven' },
  'quiz-ace': { icon: '💯', name: 'Perfect Score' },
  'streak-3': { icon: '🔥', name: '3-Week Streak' },
  'streak-7': { icon: '🔥', name: '7-Week Streak' },
  'streak-30': { icon: '🌋', name: '30-Week Streak' },
  graduate: { icon: '🎓', name: 'Graduate' },
}

export function Badge({ id, earned }) {
  const meta = BADGE_META[id] || { icon: '🏅', name: id }
  return (
    <div
      title={meta.name}
      className={`flex flex-col items-center gap-1 rounded-xl border px-3 py-3 text-center transition ${
        earned ? 'border-gold-500/40 bg-gold-500/10' : 'border-white/5 bg-ink-900/40 opacity-40 grayscale'
      }`}
    >
      <div className="text-2xl">{meta.icon}</div>
      <div className="text-[10px] font-semibold leading-tight text-slate-300">{meta.name}</div>
    </div>
  )
}

export function Pill({ children, className = '' }) {
  return <span className={`pill ${className}`}>{children}</span>
}
