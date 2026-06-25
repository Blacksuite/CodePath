import { useParams, Link } from 'react-router-dom'
import { cheatsheets, cheatsheet } from '../lib/content.js'
import Markdown from '../components/Markdown.jsx'

export default function Cheatsheets() {
  const { id } = useParams()

  if (id) {
    const sheet = cheatsheet(id)
    if (!sheet) return <Link to="/cheatsheets" className="btn-ghost">← All cheat-sheets</Link>
    return (
      <div className="flex flex-col gap-4">
        <Link to="/cheatsheets" className="text-sm text-slate-400 hover:text-slate-200">← All cheat-sheets</Link>
        <article className="card p-5 sm:p-8">
          <Markdown>{sheet.raw}</Markdown>
        </article>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-extrabold text-white">Cheat-sheets</h1>
      <p className="text-sm text-slate-400">Quick reference cards. Keep one open while you code.</p>
      <div className="grid gap-3 sm:grid-cols-2">
        {cheatsheets.map((c) => (
          <Link key={c.id} to={`/cheatsheets/${c.id}`} className="card flex items-center justify-between p-5 transition hover:shadow-glow">
            <span className="font-semibold text-white">📑 {c.title}</span>
            <span className="text-brand-400">→</span>
          </Link>
        ))}
      </div>
    </div>
  )
}
