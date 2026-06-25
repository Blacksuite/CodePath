import { Sandpack } from '@codesandbox/sandpack-react'

// In-browser runnable editor. Lazy-loaded (see BlockRenderer) so Sandpack's weight
// never lands on the dashboard bundle.
export default function Sandbox({ files, code, template = 'react', height = 320, readOnly = false }) {
  const entry = template === 'static' ? '/index.html' : '/App.js'
  const f = files && Object.keys(files).length ? files : code ? { [entry]: code } : {}
  return (
    <div className="my-4 overflow-hidden rounded-xl border border-white/10">
      <Sandpack
        template={template}
        theme="dark"
        files={f}
        options={{
          editorHeight: height,
          showLineNumbers: true,
          showTabs: Object.keys(f).length > 1,
          readOnly,
          externalResources: [],
        }}
      />
    </div>
  )
}
