// Privacy-friendly page view counter: no cookies, no IP addresses, no
// identifiers. For each day it only keeps how many times each page was
// viewed and from which sites (domain only) visitors arrived.

export interface DayStats {
  total: number
  pages: Record<string, number>
  referrers: Record<string, number>
}

const MAX_KEYS = 500 // per day, so random URLs can't grow the file forever

const dayFormatter = new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Rome' })

/** "2026-11-02" in Italian time */
export function today() {
  return dayFormatter.format(new Date())
}

function bump(map: Record<string, number>, key: string) {
  if (key in map || Object.keys(map).length < MAX_KEYS) map[key] = (map[key] ?? 0) + 1
}

// Writes are serialized so concurrent requests don't overwrite each other.
let queue: Promise<unknown> = Promise.resolve()

export function recordHit(path: string, referrer: string | null) {
  queue = queue
    .then(async () => {
      const storage = useStorage('data')
      const key = `stats:${today()}`
      const day = ((await storage.getItem<DayStats>(key)) ?? { total: 0, pages: {}, referrers: {} }) as DayStats
      day.total++
      bump(day.pages, path)
      if (referrer) bump(day.referrers, referrer)
      await storage.setItem(key, day)
    })
    .catch((error) => console.error('[stats]', error))
  return queue
}

export async function readDays(days: number) {
  const storage = useStorage('data')
  const result: { date: string; stats: DayStats }[] = []
  const now = Date.now()
  for (let i = days - 1; i >= 0; i--) {
    const date = dayFormatter.format(new Date(now - i * 86_400_000))
    const stats = ((await storage.getItem<DayStats>(`stats:${date}`)) ?? {
      total: 0,
      pages: {},
      referrers: {},
    }) as DayStats
    result.push({ date, stats })
  }
  return result
}
