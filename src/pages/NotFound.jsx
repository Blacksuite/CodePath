import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="card p-10 text-center">
      <div className="text-5xl">🧭</div>
      <h1 className="mt-3 text-xl font-bold text-white">Page not found</h1>
      <Link to="/" className="btn-primary mt-5">Back to dashboard</Link>
    </div>
  )
}
