import { projectsMarkdown } from '../lib/content.js'
import Markdown from '../components/Markdown.jsx'

export default function Projects() {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-extrabold text-white">The 5-Project Portfolio</h1>
      <article className="card p-5 sm:p-8">
        <Markdown>{projectsMarkdown}</Markdown>
      </article>
    </div>
  )
}
