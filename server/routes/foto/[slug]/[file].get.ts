import { createReadStream } from 'node:fs'
import { mkdir, stat, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { basename, extname, join } from 'node:path'
import sharp from 'sharp'

const TYPES: Record<string, string> = {
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.gif': 'image/gif',
}

// Only a few sizes are allowed, so nobody can fill the disk with variants
const WIDTHS = new Set([480, 960, 1600])
const CACHE_DIR = join(tmpdir(), 'fulcron-gallery-cache')

/**
 * Serves a photo of an album from NUXT_GALLERY_DIR/<slug>/<file>.
 * With ?w=480|960|1600 it returns a resized WebP (cached on disk), used for
 * thumbnails and the lightbox; without it, the original file (download).
 */
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

  const width = Number(getQuery(event).w)
  let servePath = path
  let type = TYPES[extname(file).toLowerCase()] ?? 'application/octet-stream'

  if (WIDTHS.has(width)) {
    const cached = join(CACHE_DIR, slug, `${width}-${info.mtimeMs}-${file}.webp`)
    if (!(await stat(cached).catch(() => null))) {
      try {
        const buffer = await sharp(path)
          .rotate()
          .resize({ width, withoutEnlargement: true })
          .webp({ quality: 74 })
          .toBuffer()
        await mkdir(join(CACHE_DIR, slug), { recursive: true })
        await writeFile(cached, buffer)
      } catch (error) {
        console.error('[gallery] resize fallito:', file, error)
        throw createError({ statusCode: 500 })
      }
    }
    servePath = cached
    type = 'image/webp'
  }

  const served = servePath === path ? info : await stat(servePath)
  setResponseHeaders(event, {
    'content-type': type,
    'content-length': served.size,
    'cache-control': 'public, max-age=604800',
  })
  return sendStream(event, createReadStream(servePath))
})
