const BOT_RE = /bot|crawl|spider|slurp|preview|monitor|lighthouse|headless|curl|wget|python|httpclient/i

// Receives a page view from the browser (see app/plugins/analytics.client.ts).
export default defineEventHandler(async (event) => {
  const ua = getHeader(event, 'user-agent') ?? ''
  const optOut = getHeader(event, 'dnt') === '1' || getHeader(event, 'sec-gpc') === '1'
  if (!ua || BOT_RE.test(ua) || optOut) return null

  const body = await readBody<{ p?: unknown; r?: unknown }>(event).catch(() => null)
  const path = typeof body?.p === 'string' ? body.p : ''
  if (!path.startsWith('/') || path.length > 200 || path.startsWith('/statistiche')) return null

  // Only the domain of the referring site is kept, never the full URL
  let referrer: string | null = null
  if (typeof body?.r === 'string' && body.r) {
    try {
      const host = new URL(body.r).hostname.replace(/^www\./, '')
      const self = new URL(useRuntimeConfig().public.siteUrl).hostname.replace(/^www\./, '')
      if (host && host !== self && host !== getRequestHost(event).split(':')[0]) referrer = host
    } catch {
      // not a valid URL: ignore it
    }
  }

  await recordHit(path.replace(/\/+$/, '') || '/', referrer)
  return null
})
