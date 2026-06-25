// Loads the verified course markdown + grounded quizzes at build time.
// Content is rendered, never generated — this is a presentation layer.

const phaseMd = import.meta.glob('../content/phases/*.md', { query: '?raw', import: 'default', eager: true })
const cheatMd = import.meta.glob('../content/cheatsheets/*.md', { query: '?raw', import: 'default', eager: true })
const projectMd = import.meta.glob('../content/projects/*.md', { query: '?raw', import: 'default', eager: true })
const rootMd = import.meta.glob('../content/*.md', { query: '?raw', import: 'default', eager: true })
const quizJson = import.meta.glob('../data/quizzes/*.json', { import: 'default', eager: true })

function titleFromMd(raw, fallback) {
  const m = raw.match(/^#\s+(.+)$/m)
  return m ? m[1].trim() : fallback
}

export function lessonMarkdown(lessonFile) {
  return phaseMd[`../content/phases/${lessonFile}.md`] || '# Lesson not found'
}

export function quizFor(phaseId) {
  return quizJson[`../data/quizzes/${phaseId}.json`] || null
}

export const cheatsheets = Object.entries(cheatMd)
  .map(([path, raw]) => {
    const id = path.split('/').pop().replace('.md', '')
    return { id, raw, title: titleFromMd(raw, id) }
  })
  .sort((a, b) => a.id.localeCompare(b.id))

export function cheatsheet(id) {
  return cheatsheets.find((c) => c.id === id)
}

export const projectsMarkdown = projectMd['../content/projects/README.md'] || '# Projects'
export const howToLearnMarkdown = rootMd['../content/00-how-to-learn.md'] || '# How to learn'
