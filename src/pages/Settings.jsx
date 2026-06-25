import { useRef, useState } from 'react'
import { useProgress } from '../lib/progress.jsx'

export default function Settings() {
  const { state, setFreeRoam, reset, importData, level } = useProgress()
  const fileRef = useRef(null)
  const [msg, setMsg] = useState('')

  function exportData() {
    const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'codepath-progress.json'
    a.click()
    URL.revokeObjectURL(url)
  }

  function onImport(e) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      try {
        importData(JSON.parse(String(reader.result)))
        setMsg('Progress imported ✓')
      } catch {
        setMsg('That file was not valid progress JSON.')
      }
    }
    reader.readAsText(file)
  }

  return (
    <div className="flex max-w-2xl flex-col gap-5">
      <h1 className="text-2xl font-extrabold text-white">Settings</h1>

      <section className="card p-5">
        <h2 className="font-bold text-white">Free Roam</h2>
        <p className="mt-1 text-sm text-slate-400">Phases normally unlock as you pass each quiz. Turn this on to open every phase right away.</p>
        <label className="mt-3 inline-flex cursor-pointer items-center gap-3">
          <input type="checkbox" checked={state.freeRoam} onChange={(e) => setFreeRoam(e.target.checked)} className="h-5 w-5 accent-brand-500" />
          <span className="text-sm text-slate-200">{state.freeRoam ? 'On — all phases unlocked' : 'Off — unlock by passing quizzes'}</span>
        </label>
      </section>

      <section className="card p-5">
        <h2 className="font-bold text-white">Your progress</h2>
        <p className="mt-1 text-sm text-slate-400">Stored only in this browser. Export it to back up or move to another device.</p>
        <div className="mt-3 grid grid-cols-3 gap-3 text-center">
          <div className="rounded-xl bg-white/5 p-3"><div className="text-xl font-extrabold text-brand-400">Lv {level}</div><div className="text-[11px] text-slate-400">Level</div></div>
          <div className="rounded-xl bg-white/5 p-3"><div className="text-xl font-extrabold text-mint-400">{state.xp}</div><div className="text-[11px] text-slate-400">XP</div></div>
          <div className="rounded-xl bg-white/5 p-3"><div className="text-xl font-extrabold text-gold-400">🔥 {state.streak.count}</div><div className="text-[11px] text-slate-400">Streak</div></div>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          <button onClick={exportData} className="btn-ghost">⬇ Export progress</button>
          <button onClick={() => fileRef.current?.click()} className="btn-ghost">⬆ Import progress</button>
          <input ref={fileRef} type="file" accept="application/json" className="hidden" onChange={onImport} />
        </div>
        {msg && <p className="mt-2 text-sm text-mint-400">{msg}</p>}
      </section>

      <section className="card border-rose-500/20 p-5">
        <h2 className="font-bold text-white">Reset</h2>
        <p className="mt-1 text-sm text-slate-400">Wipe all progress, XP, and badges. Can’t be undone.</p>
        <button
          onClick={() => { if (confirm('Reset all progress? This cannot be undone.')) { reset(); setMsg('Progress reset.') } }}
          className="btn mt-3 border border-rose-500/40 text-rose-300 hover:bg-rose-500/10"
        >
          Reset everything
        </button>
      </section>
    </div>
  )
}
