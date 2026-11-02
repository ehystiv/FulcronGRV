#!/usr/bin/env node
// One-off import of the old Wiki.js backup (github.com/ehystiv/FulcronWikiaBackUp)
// into content/wiki as Markdown.
//
//   node scripts/import-wiki.mjs /path/to/FulcronWikiaBackUp [--force]
//
// - pages exist as .md or .html (visual editor): when both exist, the newest wins
// - links to wikia.fulcrongrv.it (and older URL schemes) become /wiki/... links
// - "home" pages become index.md, paths are lowercased and without accents
// - headings are shifted down one level: the page title is the only <h1>
// - files in uploads/ are copied to public/wiki/uploads
// Existing files are never overwritten unless you pass --force.
import { existsSync } from 'node:fs'
import { copyFile, mkdir, readdir, readFile, writeFile } from 'node:fs/promises'
import { dirname, extname, join, relative } from 'node:path'
import { fileURLToPath } from 'node:url'
import TurndownService from 'turndown'

const source = process.argv[2]
const force = process.argv.includes('--force')
if (!source || !existsSync(source)) {
  console.error('Uso: node scripts/import-wiki.mjs <cartella del backup della wiki> [--force]')
  process.exit(1)
}

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const contentDir = join(root, 'content', 'wiki')
const uploadsDir = join(root, 'public', 'wiki', 'uploads')

// Order of the sections in the wiki menu (the rest is alphabetical)
const ORDER = {
  '/wiki/geopolitica': 1,
  '/wiki/geopolitica/nord': 1,
  '/wiki/geopolitica/est': 2,
  '/wiki/geopolitica/sud': 3,
  '/wiki/geopolitica/ovest': 4,
  '/wiki/geopolitica/mare': 5,
  '/wiki/religione': 2,
  '/wiki/razze': 3,
  '/wiki/storia': 4,
  '/wiki/calendario': 5,
}

// URLs of the very first version of the wiki
const LEGACY = [
  [/^\/geografia-e-regni\/il-nord/i, '/Geopolitica/Nord'],
  [/^\/geografia-e-regni\/l-est\/civilta-e-popolazioni/i, '/Geopolitica/Est/Popolazioni'],
  [/^\/geografia-e-regni\/l-est/i, '/Geopolitica/Est'],
]

const turndown = new TurndownService({ headingStyle: 'atx', bulletListMarker: '-', emDelimiter: '*' })

export function slugify(segment) {
  return segment
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

/** "Geopolitica/Est/Partaros/home" -> "/wiki/geopolitica/est/partaros" */
export function wikiPath(pagePath) {
  const parts = pagePath.split('/').filter(Boolean).map(slugify)
  if (parts.at(-1) === 'home') parts.pop()
  return ['/wiki', ...parts].join('/')
}

/** Rewrites a link found in a page to the new site, or leaves it untouched. */
export function rewriteLink(url) {
  let path = url.trim()
  const absolute = path.match(/^https?:\/\/wikia\.fulcrongrv\.it(\/.*)?$/i)
  if (absolute) path = absolute[1] || '/'
  else if (!path.startsWith('/')) return url

  path = path.replace(/^\/it(?=\/|$)/, '') || '/'
  const [pathname, hash = ''] = path.split('#')
  if (pathname.startsWith('/uploads/')) return pathname.replace('/uploads/', '/wiki/uploads/')
  let mapped = pathname
  for (const [re, to] of LEGACY) mapped = mapped.replace(re, to)
  return wikiPath(mapped) + (hash ? `#${hash}` : '')
}

function parsePage(raw, ext) {
  const match =
    ext === '.html' ? raw.match(/^<!--\s*\n([\s\S]*?)\n-->\s*\n?/) : raw.match(/^---\s*\n([\s\S]*?)\n---\s*\n?/)
  const meta = {}
  if (match) {
    for (const line of match[1].split('\n')) {
      const m = line.match(/^(\w+):\s*(.*)$/)
      if (m) meta[m[1]] = m[2].trim()
    }
  }
  const body = match ? raw.slice(match[0].length) : raw
  return { meta, body: ext === '.html' ? turndown.turndown(body) : body }
}

function cleanMarkdown(md) {
  return (
    md
      // Wiki.js callouts: "> text{.is-info}" -> ::notice
      .replace(/^> (.*?)\s*\{\.is-(info|success|warning|danger)\}\s*$/gm, '::notice\n$1\n::')
      // One <h1> per page (the title): shift every heading down a level
      .replace(/^(#{1,5}) /gm, '#$1 ')
      // Links: markdown and leftover HTML
      .replace(/\]\(([^)\s]+)\)/g, (_, url) => `](${rewriteLink(url)})`)
      .replace(/href="([^"]+)"/g, (_, url) => `href="${rewriteLink(url)}"`)
      // Images hotlinked from the old Fandom wiki can't be kept (external service)
      .replace(/!\[[^\]]*\]\(https?:\/\/static\.wikia\.nocookie\.net[^)]*\)\s*/g, '')
      .replace(/[ \t]+$/gm, '')
      .replace(/\n{3,}/g, '\n\n')
      .trim()
  )
}

const quote = (value) => JSON.stringify(value)

async function walk(dir) {
  const out = []
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    if (entry.name.startsWith('.')) continue
    const full = join(dir, entry.name)
    if (entry.isDirectory()) out.push(...(await walk(full)))
    else out.push(full)
  }
  return out
}

const files = await walk(source)

// Pick one version per page (newest `date`)
const pages = new Map()
for (const file of files) {
  const ext = extname(file)
  if (!['.md', '.html'].includes(ext) || file.endsWith('README.md')) continue
  const { meta, body } = parsePage(await readFile(file, 'utf8'), ext)
  const key = relative(source, file).slice(0, -ext.length)
  const current = pages.get(key)
  if (!current || new Date(meta.date || 0) > new Date(current.meta.date || 0)) {
    pages.set(key, { meta, body, file })
  }
}

let written = 0
for (const [key, { meta, body }] of pages) {
  const path = wikiPath(key)
  const isIndex = key.split('/').pop() === 'home' || path === '/wiki'
  const target =
    join(contentDir, ...path.split('/').slice(2), ...(isIndex ? ['index.md'] : [])) + (isIndex ? '' : '.md')
  if (existsSync(target) && !force) {
    console.warn(`  già presente, salto: ${relative(root, target)}`)
    continue
  }
  const fields = [
    `title: ${quote(meta.title || key.split('/').pop())}`,
    meta.description ? `description: ${quote(meta.description)}` : null,
    meta.date ? `updated: ${meta.date.slice(0, 10)}` : null,
    ORDER[path] ? `order: ${ORDER[path]}` : null,
  ].filter(Boolean)
  await mkdir(dirname(target), { recursive: true })
  await writeFile(target, `---\n${fields.join('\n')}\n---\n\n${cleanMarkdown(body)}\n`)
  written++
}
console.log(`wiki: ${written}/${pages.size} pagine scritte in content/wiki`)

const uploads = files.filter((f) => relative(source, f).startsWith('uploads/'))
await mkdir(uploadsDir, { recursive: true })
for (const file of uploads) await copyFile(file, join(uploadsDir, relative(join(source, 'uploads'), file)))
console.log(`uploads: ${uploads.length} file copiati in public/wiki/uploads`)
