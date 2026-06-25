import { howToLearnMarkdown } from '../lib/content.js'
import Markdown from '../components/Markdown.jsx'

export default function HowToLearn() {
  return (
    <div className="flex flex-col gap-4">
      <article className="card p-5 sm:p-8">
        <Markdown>{howToLearnMarkdown}</Markdown>
      </article>
    </div>
  )
}
