import { timingSafeEqual } from 'node:crypto'

// Aggregated statistics, readable only with NUXT_STATS_KEY.
export default defineEventHandler(async (event) => {
  const expected = useRuntimeConfig().statsKey
  const given = String(getQuery(event).key ?? '')
  const ok =
    expected.length > 0 &&
    given.length === expected.length &&
    timingSafeEqual(Buffer.from(given), Buffer.from(expected))
  if (!ok) throw createError({ statusCode: 404 })

  setResponseHeader(event, 'cache-control', 'no-store')
  const days = Math.min(Math.max(Number(getQuery(event).days) || 30, 7), 365)
  const data = await readDays(days)

  const pages: Record<string, number> = {}
  const referrers: Record<string, number> = {}
  for (const { stats } of data) {
    for (const [k, v] of Object.entries(stats.pages)) pages[k] = (pages[k] ?? 0) + v
    for (const [k, v] of Object.entries(stats.referrers)) referrers[k] = (referrers[k] ?? 0) + v
  }
  const top = (map: Record<string, number>) =>
    Object.entries(map)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 15)
      .map(([name, count]) => ({ name, count }))

  return {
    days: data.map(({ date, stats }) => ({ date, total: stats.total })),
    total: data.reduce((sum, d) => sum + d.stats.total, 0),
    pages: top(pages),
    referrers: top(referrers),
  }
})
