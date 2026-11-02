import { readdir } from 'node:fs/promises'

export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, 'slug') ?? ''
  const dir = albumDir(slug)
  if (!dir) throw createError({ statusCode: 404, statusMessage: 'Album non trovato' })

  let files: string[]
  try {
    files = await readdir(dir)
  } catch {
    throw createError({ statusCode: 404, statusMessage: 'Album non trovato' })
  }

  const photos = files
    .filter((f) => IMAGE_RE.test(f) && !f.startsWith('.'))
    .sort((a, b) => a.localeCompare(b, 'it', { numeric: true }))
    .map((f) => `/foto/${slug}/${encodeURIComponent(f)}`)

  return { slug, photos }
})
