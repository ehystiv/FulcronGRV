// Pure conversion helpers used by export-mongo.mjs (kept separate so they can be tested).
import TurndownService from 'turndown'

const turndown = new TurndownService({ headingStyle: 'atx', emDelimiter: '*', bulletListMarker: '-' })

/** "La Città Santa – Parte II" -> "la-citta-santa-parte-ii" */
export function slugify(text) {
  return String(text ?? '')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80)
}

function isoDate(value) {
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? null : date.toISOString().slice(0, 10)
}

// JSON strings and arrays are valid YAML, which avoids any quoting problem.
function frontmatter(fields) {
  const lines = Object.entries(fields)
    .filter(([, v]) => v !== undefined && v !== null && v !== '' && !(Array.isArray(v) && !v.length))
    .map(([k, v]) => `${k}: ${k === 'date' ? v : JSON.stringify(v)}`)
  return `---\n${lines.join('\n')}\n---\n`
}

function clean(text) {
  return String(text ?? '').trim()
}

export function postToMarkdown(post) {
  const date = isoDate(post.created_at) ?? isoDate(Date.now())
  const body = turndown.turndown(clean(post.text))
  return {
    path: `bacheca/${date}-${slugify(post.title)}.md`,
    content:
      frontmatter({ title: clean(post.title), date, image: post.image || undefined, tags: post.tag ?? [] }) +
      `\n${body}\n`,
  }
}

export function oneshotToMarkdown(oneshot) {
  const date = isoDate(oneshot.date)
  return {
    path: `oneshot/${slugify(oneshot.title)}.md`,
    content:
      frontmatter({
        title: clean(oneshot.title),
        date,
        image: oneshot.img,
        tags: oneshot.type ?? [],
        photos: oneshot.photo || undefined,
      }) + `\n${clean(oneshot.description)}\n`,
  }
}

export function albumToMarkdown(album) {
  const folder =
    clean(album.photos)
      .replace(/^\/+|\/+$/g, '')
      .split('/')
      .pop() || slugify(album.name)
  return {
    path: `gallery/${slugify(folder)}.md`,
    content:
      frontmatter({
        title: clean(album.name),
        date: isoDate(album.date),
        cover: album.copertina,
        folder,
        place: clean(album.luogo) || undefined,
        placeIG: clean(album.luogoIG) || undefined,
        highQuality: clean(album.highQuality) || undefined,
      }) + '\n',
  }
}
