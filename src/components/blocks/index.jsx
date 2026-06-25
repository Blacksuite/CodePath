import { lazy, Suspense, useState } from 'react'
import Markdown from '../Markdown.jsx'

const Sandbox = lazy(() => import('./Sandbox.jsx'))

function SandboxSlot(props) {
  return (
    <Suspense fallback={<div className="my-4 rounded-xl border border-white/10 bg-ink-950 p-6 text-sm text-slate-500">Loading editor…</div>}>
      <Sandbox {...props} />
    </Suspense>
  )
}

// Pick the Sandpack template: explicit block.template wins, else sniff HTML → static, else react.
function inferTemplate(block) {
  if (block.template) return block.template
  const text = [block.code, block.brokenCode, block.fixedCode, block.solutionCode, block.starterCode]
    .filter(Boolean).join('') + JSON.stringify(block.sandpackFiles || {})
  return /<!doctype|<html|<\/html>|index\.html|<style|<body/i.test(text) ? 'static' : 'react'
}

function Chip({ children, className = '' }) {
  return <span className={`pill text-[10px] uppercase tracking-wider ${className}`}>{children}</span>
}

// inline `code` for short bits of plain text (prompts etc.)
function Rich({ text }) {
  return String(text).split(/(`[^`]+`)/g).map((p, i) =>
    p.startsWith('`') && p.endsWith('`')
      ? <code key={i} className="rounded bg-white/10 px-1 py-0.5 font-mono text-[0.9em] text-mint-400">{p.slice(1, -1)}</code>
      : <span key={i}>{p}</span>
  )
}

// fenced markdown so the shared renderer highlights it
function StaticCode({ lang, code }) {
  return <Markdown>{`\`\`\`${lang || ''}\n${code}\n\`\`\``}</Markdown>
}

// ---------- prose (role-driven) ----------
const ROLE = {
  hook: { chip: 'Why', cls: 'bg-brand-500/15 text-brand-400' },
  objective: { chip: 'Goal', cls: 'bg-mint-500/15 text-mint-400' },
  concept: { chip: 'Idea', cls: 'bg-white/10 text-slate-300' },
  recap: { chip: 'Recap', cls: 'bg-gold-500/15 text-gold-400' },
  resource: { chip: 'Go deeper', cls: 'bg-white/10 text-slate-300' },
  aside: { chip: 'Aside', cls: 'bg-white/10 text-slate-300' },
}
const CALLOUT = {
  mistake: { chip: 'Heads-up', cls: 'border-rose-500/30 bg-rose-500/5', chipCls: 'bg-rose-500/15 text-rose-300' },
  tip: { chip: 'Tip', cls: 'border-mint-500/30 bg-mint-500/5', chipCls: 'bg-mint-500/15 text-mint-400' },
  break: { chip: 'Breather', cls: 'border-amber-500/30 bg-amber-500/5', chipCls: 'bg-amber-500/15 text-amber-300' },
  recall: { chip: 'Recall', cls: 'border-brand-500/30 bg-brand-500/5', chipCls: 'bg-brand-500/15 text-brand-400' },
}

function Prose({ block }) {
  const { role, md, variant } = block
  if (role === 'objective') {
    return (
      <div className="my-3 flex flex-wrap items-center gap-3 rounded-xl border border-mint-500/20 bg-mint-500/5 px-4 py-3">
        <Chip className={ROLE.objective.cls}>Goal</Chip>
        <span className="text-sm text-slate-200">By the end you can <strong className="text-white">{block.canDo}</strong>.</span>
        {block.estMinutes && <span className="ml-auto pill bg-white/5 text-slate-400">⏱ {block.estMinutes} min</span>}
      </div>
    )
  }
  if (role === 'callout') {
    const c = CALLOUT[variant] || CALLOUT.tip
    return (
      <div className={`my-3 rounded-xl border px-4 py-3 ${c.cls}`}>
        <Chip className={`mb-1 ${c.chipCls}`}>{c.chip}</Chip>
        <Markdown>{md}</Markdown>
      </div>
    )
  }
  if (role === 'aside') {
    return (
      <details className="my-3 rounded-lg border border-white/10 bg-ink-850/60 px-4 py-2" open={!block.collapsed ? false : undefined}>
        <summary className="cursor-pointer font-semibold text-slate-300">More detail</summary>
        <div className="mt-2"><Markdown>{md}</Markdown></div>
      </details>
    )
  }
  if (role === 'resource') {
    return (
      <a href={block.url} target="_blank" rel="noreferrer noopener" className="my-3 flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm hover:bg-white/10">
        <Chip className={ROLE.resource.cls}>Go deeper</Chip>
        <span className="text-slate-200">{block.label || md}</span>
        {block.source && <span className="ml-auto text-xs text-slate-500">{block.source} ↗</span>}
      </a>
    )
  }
  const meta = ROLE[role] || ROLE.concept
  return (
    <div className="my-2">
      <Chip className={`mb-1 ${meta.cls}`}>{meta.chip}</Chip>
      <Markdown>{md}</Markdown>
      {role === 'recap' && Array.isArray(block.bullets) && (
        <ul className="mt-1 list-disc pl-5 text-sm text-slate-300">{block.bullets.map((b, i) => <li key={i}><Rich text={b} /></li>)}</ul>
      )}
    </div>
  )
}

// ---------- code ----------
function CodeBlock({ block }) {
  return (
    <div className="my-4">
      <Chip className="mb-1 bg-white/10 text-slate-300">{block.sandpack || block.sandpackFiles ? 'Run it' : 'Example'}</Chip>
      {block.caption && <div className="mb-1 text-sm text-slate-400"><Markdown>{block.caption}</Markdown></div>}
      {block.sandpack || block.sandpackFiles
        ? <SandboxSlot files={block.sandpackFiles} code={block.code} template={inferTemplate(block)} />
        : <StaticCode lang={block.lang} code={block.code} />}
      {block.runUrl && <a href={block.runUrl} target="_blank" rel="noreferrer noopener" className="text-xs text-brand-400 hover:underline">Open in an external editor ↗</a>}
    </div>
  )
}

// ---------- video ----------
function ytId(url = '') {
  const m = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]{6,})/)
  return m ? m[1] : null
}
function VideoBlock({ block }) {
  const id = ytId(block.url)
  return (
    <div className="my-4">
      <Chip className="mb-1 bg-rose-500/15 text-rose-300">Watch</Chip>
      {id ? (
        <div className="overflow-hidden rounded-xl border border-white/10" style={{ aspectRatio: '16 / 9' }}>
          <iframe className="h-full w-full" src={`https://www.youtube.com/embed/${id}${block.startSeconds ? `?start=${block.startSeconds}` : ''}`} title={block.title} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
        </div>
      ) : (
        <a href={block.url} target="_blank" rel="noreferrer noopener" className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3 hover:bg-white/10">
          <span className="text-2xl">▶️</span>
          <span><div className="font-semibold text-white">{block.title}</div><div className="text-xs text-slate-400">{block.source}{block.minutes ? ` · ${block.minutes} min` : ''}</div></span>
          <span className="ml-auto text-brand-400">↗</span>
        </a>
      )}
      {block.note && <div className="mt-1 text-xs text-slate-400">{block.note}</div>}
    </div>
  )
}

// ---------- interactive: predict ----------
function Predict({ block, onResolved }) {
  const [revealed, setRevealed] = useState(false)
  const [picked, setPicked] = useState(null)
  function reveal() { setRevealed(true); onResolved?.() }
  return (
    <div className="my-4 card p-4">
      <Chip className="mb-2 bg-brand-500/15 text-brand-400">Predict</Chip>
      <div className="mb-2 text-sm font-semibold text-white"><Rich text={block.prompt} /></div>
      <StaticCode lang={block.lang} code={block.code} />
      {block.choices ? (
        <div className="flex flex-col gap-2">
          {block.choices.map((c, i) => (
            <button key={i} onClick={() => { setPicked(i); reveal() }} disabled={revealed}
              className={`rounded-lg border px-3 py-2 text-left text-sm transition ${revealed ? (c === block.answer ? 'border-mint-500/50 bg-mint-500/10' : i === picked ? 'border-rose-500/50 bg-rose-500/10' : 'border-white/5 opacity-60') : 'border-white/10 hover:bg-white/5'}`}>
              <Rich text={c} />
            </button>
          ))}
        </div>
      ) : (
        !revealed && <button onClick={reveal} className="btn-ghost mt-1">Reveal the answer</button>
      )}
      {revealed && (
        <div className="mt-3 rounded-lg border border-white/10 bg-ink-850/60 p-3 text-sm">
          <div className="text-mint-400">Answer: <span className="font-mono">{block.answer}</span></div>
          {block.explanation && <div className="mt-1 text-slate-300"><Markdown>{block.explanation}</Markdown></div>}
        </div>
      )}
    </div>
  )
}

// ---------- interactive: fixbug ----------
function FixBug({ block, onResolved }) {
  const [revealed, setRevealed] = useState(false)
  return (
    <div className="my-4 card p-4">
      <Chip className="mb-2 bg-amber-500/15 text-amber-300">Fix the bug</Chip>
      <div className="mb-2 text-sm font-semibold text-white"><Rich text={block.prompt} /></div>
      {block.sandpack ? <SandboxSlot code={block.brokenCode} template={inferTemplate(block)} /> : <StaticCode lang={block.lang} code={block.brokenCode} />}
      {!revealed ? (
        <button onClick={() => { setRevealed(true); onResolved?.() }} className="btn-ghost">Show the fix</button>
      ) : (
        <div className="mt-2">
          <div className="text-xs uppercase tracking-wide text-mint-400">Fixed</div>
          <StaticCode lang={block.lang} code={block.fixedCode} />
          {block.explanation && <div className="text-sm text-slate-300"><Markdown>{block.explanation}</Markdown></div>}
        </div>
      )}
    </div>
  )
}

// ---------- interactive: check ----------
function Check({ block, onResolved }) {
  const [revealed, setRevealed] = useState(false)
  const [marked, setMarked] = useState(null)
  return (
    <div className="my-4 card p-4">
      <Chip className="mb-2 bg-mint-500/15 text-mint-400">Check yourself</Chip>
      <div className="mb-2 font-semibold text-white"><Rich text={block.question} /></div>
      {!revealed ? (
        <button onClick={() => setRevealed(true)} className="btn-ghost">Reveal a model answer</button>
      ) : (
        <>
          <div className="rounded-lg border border-white/10 bg-ink-850/60 p-3 text-sm text-slate-300"><Markdown>{block.sampleAnswer}</Markdown></div>
          <div className="mt-3 flex items-center gap-2">
            <span className="text-sm text-slate-400">How did you do?</span>
            <button onClick={() => { setMarked('got'); onResolved?.() }} className={`pill ${marked === 'got' ? 'bg-mint-500/30 text-mint-300' : 'bg-white/5 text-slate-300 hover:bg-white/10'}`}>✓ I got it</button>
            <button onClick={() => { setMarked('not'); onResolved?.() }} className={`pill ${marked === 'not' ? 'bg-amber-500/30 text-amber-200' : 'bg-white/5 text-slate-300 hover:bg-white/10'}`}>↻ Not yet</button>
          </div>
          {marked === 'not' && <div className="mt-2 text-xs text-slate-400">No problem — re-read the idea above, or revisit it later. Spaced repetition is how it sticks.</div>}
        </>
      )}
    </div>
  )
}

// ---------- interactive: nowYouTry ----------
function HintLadder({ hints }) {
  const [shown, setShown] = useState(0)
  const labels = ['Nudge', 'More help', 'Show me']
  return (
    <div className="mt-3">
      {hints.slice(0, shown).map((h, i) => (
        <div key={i} className="mb-2 rounded-lg border border-white/10 bg-ink-850/60 p-3 text-sm text-slate-300">
          <span className="mr-2 text-xs font-semibold uppercase text-brand-400">{labels[i] || `Hint ${i + 1}`}</span><Rich text={h} />
        </div>
      ))}
      {shown < hints.length && (
        <button onClick={() => setShown((s) => s + 1)} className="btn-ghost text-sm">
          💡 {shown === 0 ? 'Stuck? Get a hint' : `Another hint (${shown}/${hints.length} used)`}
        </button>
      )}
    </div>
  )
}

function NowYouTry({ block, onResolved }) {
  const [usedHints, setUsedHints] = useState(false)
  const [showSolution, setShowSolution] = useState(false)
  const [built, setBuilt] = useState(false)
  return (
    <div className="my-4 rounded-2xl border border-brand-500/30 bg-brand-500/5 p-5">
      <Chip className="mb-2 bg-brand-500/20 text-brand-300">Now you try 🛠️</Chip>
      <div className="font-semibold text-white"><Markdown>{block.task}</Markdown></div>
      {block.definitionOfDone && (
        <div className="mt-2 rounded-lg border border-mint-500/20 bg-mint-500/5 p-3 text-sm">
          <span className="font-semibold text-mint-400">Done when: </span><span className="text-slate-200"><Rich text={block.definitionOfDone} /></span>
        </div>
      )}
      {(block.sandpackFiles || block.starterCode || block.code) && (
        <SandboxSlot files={block.sandpackFiles} code={block.starterCode || block.code} template={inferTemplate(block)} height={360} />
      )}
      {Array.isArray(block.hints) && <div onClick={() => setUsedHints(true)}><HintLadder hints={block.hints} /></div>}

      <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-white/10 pt-3">
        {block.gatedSolution && !showSolution && (
          <button onClick={() => { if (confirm('Give it a real attempt first — open the solution anyway?')) setShowSolution(true) }} className="btn-ghost text-sm">Reveal solution</button>
        )}
        <button onClick={() => { setBuilt(true); onResolved?.() }} className={`btn text-sm ${built ? 'bg-mint-500/20 text-mint-300' : 'btn-primary'}`}>
          {built ? '✓ Built it' : 'I built it'}
        </button>
        {usedHints && <span className="pill bg-white/5 text-[10px] text-slate-500">used a hint</span>}
      </div>
      {showSolution && (
        <div className="mt-3">
          <div className="text-xs uppercase tracking-wide text-slate-400">Solution</div>
          {block.solutionFiles
            ? <SandboxSlot files={block.solutionFiles} template={inferTemplate(block)} height={360} />
            : block.solutionCode
            ? <SandboxSlot code={block.solutionCode} template={inferTemplate(block)} height={360} />
            : block.solutionUrl
              ? <a href={block.solutionUrl} target="_blank" rel="noreferrer noopener" className="text-brand-400 hover:underline">Open the solution ↗</a>
              : <div className="text-sm text-slate-400">—</div>}
        </div>
      )}
    </div>
  )
}

// ---------- graded mini-quiz (per-session) ----------
function QuizBlock({ block, onResolved }) {
  const qs = block.questions || []
  const [i, setI] = useState(0)
  const [picked, setPicked] = useState(null)
  const [correct, setCorrect] = useState(0)
  const [done, setDone] = useState(false)
  if (!qs.length) return null

  const q = qs[i]
  const isLast = i === qs.length - 1
  function choose(idx) {
    if (picked !== null) return
    setPicked(idx)
    if (idx === q.answerIndex) setCorrect((c) => c + 1)
  }
  function next() {
    if (isLast) { setDone(true); onResolved?.() } else { setI(i + 1); setPicked(null) }
  }
  function retry() { setI(0); setPicked(null); setCorrect(0); setDone(false) }

  if (done) {
    const pct = Math.round((correct / qs.length) * 100)
    const passed = pct >= Math.round((block.passThreshold || 0.7) * 100)
    return (
      <div className="my-4 rounded-2xl border border-mint-500/30 bg-mint-500/5 p-5 text-center">
        <div className="text-3xl">{pct === 100 ? '💯' : passed ? '🎉' : '💪'}</div>
        <div className="mt-1 font-bold text-white">{correct} / {qs.length} correct ({pct}%)</div>
        <div className="mt-1 text-sm text-slate-400">{passed ? 'Nice — that stuck.' : 'Worth a quick review, then try again.'}</div>
        <button onClick={retry} className="btn-ghost mt-3 text-sm">Try again</button>
      </div>
    )
  }
  return (
    <div className="my-4 rounded-2xl border border-brand-500/30 bg-brand-500/5 p-5">
      <div className="mb-2 flex items-center justify-between">
        <Chip className="bg-brand-500/20 text-brand-300">Quiz</Chip>
        <span className="text-xs text-slate-400">{i + 1} / {qs.length}</span>
      </div>
      <div className="font-semibold text-white"><Rich text={q.question} /></div>
      <div className="mt-3 flex flex-col gap-2">
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
            <button key={idx} onClick={() => choose(idx)} disabled={picked !== null} className={`flex items-center gap-3 rounded-xl border px-4 py-2.5 text-left text-sm transition ${cls}`}>
              <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full border border-white/15 text-xs">{'ABCD'[idx]}</span>
              <span><Rich text={opt} /></span>
              {picked !== null && isAnswer && <span className="ml-auto text-mint-400">✓</span>}
              {picked !== null && isPicked && !isAnswer && <span className="ml-auto text-rose-400">✗</span>}
            </button>
          )
        })}
      </div>
      {picked !== null && q.explanation && (
        <div className="mt-3 rounded-lg border border-white/10 bg-ink-850/60 p-3 text-sm text-slate-300"><span className="font-semibold text-brand-400">Why: </span><Rich text={q.explanation} /></div>
      )}
      <div className="mt-3 flex justify-end">
        <button onClick={next} disabled={picked === null} className="btn-primary text-sm">{isLast ? 'Finish quiz' : 'Next →'}</button>
      </div>
    </div>
  )
}

// ---------- the switch ----------
export function BlockRenderer({ block, onResolved }) {
  switch (block.type) {
    case 'prose': return <Prose block={block} />
    case 'code': return <CodeBlock block={block} />
    case 'video': return <VideoBlock block={block} />
    case 'predict': return <Predict block={block} onResolved={onResolved} />
    case 'fixbug': return <FixBug block={block} onResolved={onResolved} />
    case 'check': return <Check block={block} onResolved={onResolved} />
    case 'nowYouTry': return <NowYouTry block={block} onResolved={onResolved} />
    case 'quiz': return <QuizBlock block={block} onResolved={onResolved} />
    default: return null
  }
}

export const INTERACTIVE = new Set(['predict', 'fixbug', 'check', 'nowYouTry', 'quiz'])
