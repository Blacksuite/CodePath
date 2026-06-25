import { useState } from 'react'
import { NavLink, Link } from 'react-router-dom'
import { useProgress } from '../lib/progress.jsx'
import { PHASES } from '../data/curriculum.js'

const nav = [
  { to: '/', label: 'Dashboard', icon: '🏠', end: true },
  { to: '/projects', label: 'Projects', icon: '🧱' },
  { to: '/cheatsheets', label: 'Cheat-sheets', icon: '📑' },
  { to: '/how-to-learn', label: 'How to Learn', icon: '🧠' },
  { to: '/settings', label: 'Settings', icon: '⚙️' },
]

function NavItem({ to, label, icon, end, onClick }) {
  return (
    <NavLink
      to={to}
      end={end}
      onClick={onClick}
      className={({ isActive }) =>
        `flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition ${
          isActive ? 'bg-brand-500/15 text-white ring-1 ring-brand-500/30' : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'
        }`
      }
    >
      <span className="text-base">{icon}</span>
      {label}
    </NavLink>
  )
}

function SidebarContent({ onNavigate }) {
  const { phaseStatus } = useProgress()
  return (
    <div className="flex h-full flex-col gap-6 p-4">
      <Link to="/" onClick={onNavigate} className="flex items-center gap-2 px-2">
        <span className="grid h-9 w-9 place-items-center rounded-xl bg-brand-500 font-extrabold text-white shadow-glow">{'</>'}</span>
        <span className="text-lg font-extrabold tracking-tight text-white">CodePath</span>
      </Link>

      <nav className="flex flex-col gap-1">
        {nav.map((n) => <NavItem key={n.to} {...n} onClick={onNavigate} />)}
      </nav>

      <div className="min-h-0 flex-1 overflow-y-auto">
        <div className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-500">Phases</div>
        <div className="flex flex-col gap-0.5">
          {PHASES.map((p) => {
            const st = phaseStatus(p.id)
            return (
              <NavLink
                key={p.id}
                to={`/phase/${p.id}`}
                onClick={onNavigate}
                className={({ isActive }) =>
                  `flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm transition ${
                    isActive ? 'bg-white/10 text-white' : 'text-slate-400 hover:bg-white/5'
                  } ${!st.unlocked ? 'opacity-50' : ''}`
                }
              >
                <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full text-[11px]" style={{ background: st.done ? '#16c79a' : 'rgba(255,255,255,0.08)' }}>
                  {st.done ? '✓' : !st.unlocked ? '🔒' : p.num}
                </span>
                <span className="truncate">{p.title}</span>
              </NavLink>
            )
          })}
        </div>
      </div>
    </div>
  )
}

function TopStats() {
  const { level, levelProgress, state } = useProgress()
  return (
    <div className="flex items-center gap-3 text-sm">
      <span className="pill bg-gold-500/15 text-gold-400" title="Weekly streak">🔥 {state.streak.count}</span>
      <span className="pill bg-brand-500/15 text-brand-400" title="Level">⭐ Lv {level}</span>
      <span className="hidden sm:inline pill bg-mint-500/15 text-mint-400" title="Total XP">✨ {state.xp} XP</span>
      <div className="hidden md:block w-28">
        <div className="h-2 w-full overflow-hidden rounded-full bg-white/10">
          <div className="h-full rounded-full bg-gradient-to-r from-brand-500 to-mint-400" style={{ width: `${levelProgress.pct}%` }} />
        </div>
      </div>
    </div>
  )
}

export default function Layout({ children }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="min-h-screen lg:grid lg:grid-cols-[16rem_1fr]">
      {/* desktop sidebar */}
      <aside className="sticky top-0 hidden h-screen border-r border-white/10 bg-ink-900/60 backdrop-blur lg:block">
        <SidebarContent />
      </aside>

      {/* mobile drawer */}
      {open && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-black/60" onClick={() => setOpen(false)} />
          <aside className="absolute left-0 top-0 h-full w-72 border-r border-white/10 bg-ink-900">
            <SidebarContent onNavigate={() => setOpen(false)} />
          </aside>
        </div>
      )}

      <div className="flex min-w-0 flex-col">
        <header className="sticky top-0 z-30 flex items-center justify-between gap-3 border-b border-white/10 bg-ink-950/80 px-4 py-3 backdrop-blur">
          <button className="btn-ghost lg:hidden" onClick={() => setOpen(true)} aria-label="Open menu">☰</button>
          <div className="hidden text-sm text-slate-400 lg:block">Learn full-stack, the calm way.</div>
          <TopStats />
        </header>
        <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-6 sm:px-6 sm:py-8">{children}</main>
      </div>
    </div>
  )
}
