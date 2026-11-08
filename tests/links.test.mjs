// Checks every internal link and asset in the generated site (.output/public): each href and src
// that points inside the site must lead to a file. Run after `npm run generate`:
//
//   node --test tests/links.test.mjs
import assert from 'node:assert/strict'
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs'
import path from 'node:path'
import { test } from 'node:test'

const ROOT = path.resolve('.output/public')
// Pages of this site that link elsewhere on purpose (redirect stubs, error pages)
const SKIP_PAGES = new Set(['200.html', '404.html'])

function htmlFiles(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) return entry.name.startsWith('_') ? [] : htmlFiles(full)
    return entry.name.endsWith('.html') ? [full] : []
  })
}

function exists(urlPath) {
  const base = path.join(ROOT, decodeURIComponent(urlPath))
  return [base, path.join(base, 'index.html'), `${base}.html`].some((f) => existsSync(f) && statSync(f).isFile())
}

/** Internal URLs referenced by a page: href, src and each srcset candidate. */
function references(html) {
  const urls = []
  for (const [, attr, value] of html.matchAll(/\s(href|src|srcset|poster)="([^"]*)"/g)) {
    const values = attr === 'srcset' ? value.split(',').map((part) => part.trim().split(/\s+/)[0]) : [value]
    for (const raw of values) {
      const url = raw.replaceAll('&amp;', '&')
      // Only same-site paths: no external links, protocols, protocol-relative URLs or anchors
      if (!url.startsWith('/') || url.startsWith('//')) continue
      urls.push(url.split('#')[0].split('?')[0])
    }
  }
  return urls.filter(Boolean)
}

test('the site has been generated', () => {
  assert.ok(existsSync(path.join(ROOT, 'index.html')), 'Manca .output/public: lancia prima `npm run generate`.')
})

test('internal links and assets all lead to a file', () => {
  const broken = []
  for (const file of htmlFiles(ROOT)) {
    const page = path.relative(ROOT, file)
    if (SKIP_PAGES.has(page)) continue
    for (const url of new Set(references(readFileSync(file, 'utf8')))) {
      if (!exists(url)) broken.push(`${page} → ${url}`)
    }
  }
  assert.deepEqual(broken, [], `Link rotti:\n${broken.join('\n')}`)
})
