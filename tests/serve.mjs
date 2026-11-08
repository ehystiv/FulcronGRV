// Serves the generated site (.output/public) like Vercel does: files as they are, `/path` from
// `/path/index.html`, and 404.html with a real 404 for everything else (see vercel.json).
//
//   node tests/serve.mjs [port]
import { createReadStream, existsSync, statSync } from 'node:fs'
import { createServer } from 'node:http'
import path from 'node:path'

const ROOT = path.resolve('.output/public')
const PORT = Number(process.argv[2] ?? 4321)
const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.xml': 'application/xml',
  '.txt': 'text/plain',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
  '.pdf': 'application/pdf',
  '.mp4': 'video/mp4',
}

if (!existsSync(ROOT)) {
  console.error('Manca .output/public: lancia prima `npm run generate`.')
  process.exit(1)
}

/** The file that answers a URL path, or null. */
function resolveFile(urlPath) {
  const clean = path.normalize(decodeURIComponent(urlPath)).replace(/^(\.\.[/\\])+/, '')
  const base = path.join(ROOT, clean)
  if (!base.startsWith(ROOT)) return null
  for (const candidate of [base, path.join(base, 'index.html'), `${base}.html`]) {
    if (existsSync(candidate) && statSync(candidate).isFile()) return candidate
  }
  return null
}

createServer((req, res) => {
  const { pathname } = new URL(req.url ?? '/', 'http://localhost')
  const file = resolveFile(pathname)
  const status = file ? 200 : 404
  const target = file ?? path.join(ROOT, '404.html')
  res.writeHead(status, { 'content-type': TYPES[path.extname(target)] ?? 'application/octet-stream' })
  createReadStream(target).pipe(res)
}).listen(PORT, () => console.log(`Sito generato su http://localhost:${PORT}`))
