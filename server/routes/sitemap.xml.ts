const PAGES = [
  '/',
  '/inizia-a-giocare',
  '/chi-siamo',
  '/sinfonia/ambientazione',
  '/sinfonia/regolamento',
  '/sinfonia/bacheca',
  '/oneshot',
  '/oneshot/palazzo-destini',
  '/gallery',
  '/privacy',
]

export default defineEventHandler((event) => {
  const base = useRuntimeConfig().public.siteUrl.replace(/\/$/, '')
  const urls = PAGES.map((p) => `  <url><loc>${base}${p}</loc></url>`).join('\n')
  setResponseHeader(event, 'content-type', 'application/xml; charset=utf-8')
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`
})
