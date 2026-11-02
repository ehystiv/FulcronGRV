import { createReadStream } from 'node:fs'
import { stat } from 'node:fs/promises'
import { basename, extname, join } from 'node:path'

const TYPES: Record<string, string> = {
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.gif': 'image/gif',
}

// Serves a single photo of an album from NUXT_GALLERY_DIR/<slug>/<file>.
export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, 'slug') ?? ''
  const file = decodeURIComponent(getRouterParam(event, 'file') ?? '')
  const dir = albumDir(slug)

  if (!dir || file !== basename(file) || file.startsWith('.') || !IMAGE_RE.test(file)) {
    throw createError({ statusCode: 404 })
  }

  const path = join(dir, file)
  const info = await stat(path).catch(() => null)
  if (!info?.isFile()) throw createError({ statusCode: 404 })

  setResponseHeaders(event, {
    'content-type': TYPES[extname(file).toLowerCase()] ?? 'application/octet-stream',
    'content-length': info.size,
    'cache-control': 'public, max-age=604800, immutable',
  })
  return sendStream(event, createReadStream(path))
})
