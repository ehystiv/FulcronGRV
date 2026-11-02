import { resolve, join } from 'node:path'

export const SLUG_RE = /^[a-z0-9][a-z0-9-]*$/
export const IMAGE_RE = /\.(jpe?g|png|webp|avif|gif)$/i

/** Turns a DB value like "/alla-vecchia-spada" into "alla-vecchia-spada". */
export function albumSlug(photos?: string | null) {
  const slug =
    (photos ?? '')
      .trim()
      .replace(/^\/+|\/+$/g, '')
      .split('/')
      .pop() ?? ''
  return SLUG_RE.test(slug) ? slug : null
}

/** Absolute folder of an album; the slug is validated so it can't escape. */
export function albumDir(slug: string) {
  if (!SLUG_RE.test(slug)) return null
  const root = resolve(useRuntimeConfig().galleryDir)
  return join(root, slug)
}
