// ponytail: single-file stdlib server (no deps). Serves the built dist/ and one progress blob.
// This is a single-user product, so progress is ONE JSON file — no users, no auth, no DB.
// Ceiling: one global blob, last-write-wins. If it ever goes multi-tenant, add a user key + a real DB.
import { createServer } from 'node:http'
import { readFile, writeFile, mkdir } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { join, extname, normalize, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const PORT = process.env.PORT || 8080
const DIST = fileURLToPath(new URL('./dist/', import.meta.url))
const DATA_FILE = process.env.DATA_FILE || fileURLToPath(new URL('./data/progress.json', import.meta.url))

const TYPES = {
  '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json',
  '.svg': 'image/svg+xml', '.png': 'image/png', '.ico': 'image/x-icon',
  '.woff': 'font/woff', '.woff2': 'font/woff2', '.map': 'application/json',
}

async function readBody(req) {
  const chunks = []
  for await (const c of req) chunks.push(c)
  return Buffer.concat(chunks).toString('utf8')
}

const server = createServer(async (req, res) => {
  const url = new URL(req.url, 'http://localhost')

  // --- progress API ---
  if (url.pathname === '/api/progress') {
    if (req.method === 'GET') {
      try {
        const data = await readFile(DATA_FILE, 'utf8') // read before writing headers
        res.writeHead(200, { 'Content-Type': 'application/json' }).end(data)
      } catch {
        res.writeHead(204).end() // nothing saved yet
      }
      return
    }
    if (req.method === 'PUT') {
      try {
        const body = await readBody(req)
        JSON.parse(body) // validate before persisting — never write garbage
        await mkdir(dirname(DATA_FILE), { recursive: true })
        await writeFile(DATA_FILE, body)
        res.writeHead(204).end()
      } catch {
        res.writeHead(400, { 'Content-Type': 'application/json' }).end('{"error":"invalid JSON"}')
      }
      return
    }
    res.writeHead(405).end()
    return
  }

  // --- static files (GET only); HashRouter means unknown paths fall back to index.html ---
  if (req.method !== 'GET') { res.writeHead(405).end(); return }
  let filePath = normalize(join(DIST, url.pathname === '/' ? '/index.html' : url.pathname))
  if (!filePath.startsWith(DIST)) { res.writeHead(403).end(); return } // path-traversal guard
  if (!existsSync(filePath)) filePath = join(DIST, 'index.html')
  try {
    const file = await readFile(filePath)
    res.writeHead(200, { 'Content-Type': TYPES[extname(filePath)] || 'application/octet-stream' }).end(file)
  } catch {
    res.writeHead(404).end('Not found')
  }
})

server.listen(PORT, () => console.log(`CodePath on http://localhost:${PORT}`))
