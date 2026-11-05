import { queryCollection } from '@nuxt/content/server'

// Generated once at build time (prerendered to /sitemap.xml)
const PAGES = [
  '/',
  '/inizia-a-giocare',
  '/chi-siamo',
  '/sinfonia/ambientazione',
  '/sinfonia/regolamento',
  '/sinfonia/eventi',
  '/sinfonia/bacheca',
  '/oneshot',
  '/oneshot/sunless-dawn',
  '/oneshot/teoria-del-nulla',
  '/oneshot/palazzo-destini',
  '/oneshot/palazzo-destini/pgos',
  '/oneshot/palazzo-destini/iscrizioni',
  '/gallery',
  '/privacy',
]

export default defineEventHandler(async (event) => {
  const base = useRuntimeConfig().public.siteUrl.replace(/\/$/, '')
  const wiki = await queryCollection(event, 'wiki').select('path').all()
  const albums = await queryCollection(event, 'gallery').select('stem', 'count').all()
  const galleries = albums.filter((album) => album.count).map((album) => `/gallery/${album.stem.split('/').pop()}`)
  const urls = [...PAGES, ...galleries, ...wiki.map((page) => page.path)]
    .map((p) => `  <url><loc>${base}${p}</loc></url>`)
    .join('\n')
  setResponseHeader(event, 'content-type', 'application/xml; charset=utf-8')
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`
})
