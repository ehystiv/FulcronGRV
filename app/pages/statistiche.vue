<script setup lang="ts">
// Visit statistics, protected by NUXT_STATS_KEY (/statistiche?key=...).
useHead({ title: 'Statistiche', meta: [{ name: 'robots', content: 'noindex, nofollow' }] })

const route = useRoute()
const key = computed(() => String(route.query.key ?? ''))
const range = ref(30)

const { data, status, error } = await useFetch('/api/stats', {
  query: { key, days: range },
  server: false,
})

const max = computed(() => Math.max(1, ...(data.value?.days.map((d) => d.total) ?? [1])))
// Round the axis up to a "nice" number
const axisMax = computed(() => {
  const m = max.value
  const step = 10 ** Math.floor(Math.log10(m))
  return Math.ceil(m / step) * step
})
const ticks = computed(() => [0, 0.5, 1].map((f) => Math.round(axisMax.value * f)))

// The chart is drawn at the real width of its box, so text keeps its size on phones
const wrap = ref<HTMLElement>()
const W = ref(720)
const H = 220
let resizeObserver: ResizeObserver | undefined
watch(wrap, (el) => {
  resizeObserver?.disconnect()
  if (!el) return
  resizeObserver = new ResizeObserver(([entry]) => {
    if (entry) W.value = Math.max(280, Math.round(entry.contentRect.width))
  })
  resizeObserver.observe(el)
})
onBeforeUnmount(() => resizeObserver?.disconnect())
const PAD = { top: 12, right: 8, bottom: 26, left: 36 }
const plotW = computed(() => W.value - PAD.left - PAD.right)
const plotH = H - PAD.top - PAD.bottom

const bars = computed(() => {
  const days = data.value?.days ?? []
  const slot = plotW.value / Math.max(days.length, 1)
  const width = Math.max(slot - 2, 1) // 2px gap between bars
  return days.map((d, i) => {
    const h = (d.total / axisMax.value) * plotH
    return { ...d, x: PAD.left + i * slot + 1, w: width, h, y: PAD.top + plotH - h, slot }
  })
})

const hover = ref<number | null>(null)
const hovered = computed(() => (hover.value === null ? null : bars.value[hover.value]))
// Keeps the tooltip inside the chart near the edges
const tooltipStyle = computed(() => {
  const b = hovered.value
  if (!b) return {}
  const x = b.x + b.w / 2
  const shift = x < 90 ? '0%' : x > W.value - 90 ? '-100%' : '-50%'
  return { left: `${x}px`, top: `${b.y}px`, transform: `translate(${shift}, calc(-100% - 8px))` }
})

const shortDate = new Intl.DateTimeFormat('it-IT', { day: 'numeric', month: 'short' })
const longDate = new Intl.DateTimeFormat('it-IT', { weekday: 'long', day: 'numeric', month: 'long' })
const label = (iso: string, long = false) => (long ? longDate : shortDate).format(new Date(`${iso}T12:00:00`))

function barPath(b: { x: number; y: number; w: number; h: number }) {
  // Rounded top (4px), square on the baseline
  if (b.h <= 0) return ''
  const r = Math.min(4, b.w / 2, b.h)
  return `M${b.x},${b.y + b.h}V${b.y + r}Q${b.x},${b.y} ${b.x + r},${b.y}H${b.x + b.w - r}Q${b.x + b.w},${b.y} ${b.x + b.w},${b.y + r}V${b.y + b.h}Z`
}

const nf = new Intl.NumberFormat('it-IT')
</script>

<template>
  <div class="container section">
    <h1>Statistiche delle visite</h1>
    <p class="muted intro">
      Conteggi anonimi: niente cookie, niente indirizzi IP. Ogni cambio di pagina conta come una visualizzazione.
    </p>

    <ClientOnly>
      <p v-if="!key" class="notice">
        Per vedere le statistiche apri questa pagina con la chiave: <code>/statistiche?key=…</code>
      </p>
      <p v-else-if="error" class="notice">Chiave non valida, oppure statistiche non attive sul server.</p>
      <p v-else-if="status === 'pending'" class="muted">Caricamento…</p>

      <template v-else-if="data">
        <div class="toolbar">
          <div class="hero-number">
            <span class="value">{{ nf.format(data.total) }}</span>
            <span class="muted">visualizzazioni negli ultimi {{ range }} giorni</span>
          </div>
          <div class="ranges" role="group" aria-label="Periodo">
            <button
              v-for="r in [7, 30, 90, 365]"
              :key="r"
              type="button"
              class="range"
              :class="{ active: range === r }"
              :aria-pressed="range === r"
              @click="range = r"
            >
              {{ r === 365 ? '1 anno' : `${r} giorni` }}
            </button>
          </div>
        </div>

        <figure class="chart">
          <figcaption>Visualizzazioni al giorno</figcaption>
          <div ref="wrap" class="chart-wrap" @mouseleave="hover = null">
            <svg
              :width="W"
              :height="H"
              :viewBox="`0 0 ${W} ${H}`"
              role="img"
              :aria-label="`Grafico delle visualizzazioni al giorno, massimo ${max}`"
            >
              <g class="grid">
                <g v-for="t in ticks" :key="t">
                  <line
                    :x1="PAD.left"
                    :x2="W - PAD.right"
                    :y1="PAD.top + plotH - (t / axisMax) * plotH"
                    :y2="PAD.top + plotH - (t / axisMax) * plotH"
                  />
                  <text :x="PAD.left - 6" :y="PAD.top + plotH - (t / axisMax) * plotH + 4" text-anchor="end">
                    {{ nf.format(t) }}
                  </text>
                </g>
              </g>
              <path
                v-for="(b, i) in bars"
                :key="b.date"
                :d="barPath(b)"
                class="bar"
                :class="{ dim: hover !== null && hover !== i }"
              />
              <!-- Hit areas wider than the bars -->
              <rect
                v-for="(b, i) in bars"
                :key="`hit-${b.date}`"
                :x="b.x - 1"
                :y="PAD.top"
                :width="b.slot"
                :height="plotH"
                class="hit"
                @mouseenter="hover = i"
              />
              <text
                v-for="(b, i) in bars.filter(
                  (_, i) => i === 0 || i === bars.length - 1 || i === Math.floor(bars.length / 2),
                )"
                :key="`x-${i}`"
                :x="b.x + b.w / 2"
                :y="H - 6"
                text-anchor="middle"
                class="x-label"
              >
                {{ label(b.date) }}
              </text>
            </svg>
            <div v-if="hovered" class="tooltip" :style="tooltipStyle">
              <strong>{{ nf.format(hovered.total) }}</strong>
              <span>{{ label(hovered.date, true) }}</span>
            </div>
          </div>
        </figure>

        <div class="lists">
          <section>
            <h2>Pagine più viste</h2>
            <p v-if="!data.pages.length" class="muted">Nessun dato.</p>
            <ol class="bar-list">
              <li v-for="p in data.pages" :key="p.name">
                <span class="bar-bg" :style="{ width: `${(p.count / data.pages[0]!.count) * 100}%` }" />
                <span class="name">{{ p.name }}</span>
                <span class="count">{{ nf.format(p.count) }}</span>
              </li>
            </ol>
          </section>
          <section>
            <h2>Da dove arrivano</h2>
            <p v-if="!data.referrers.length" class="muted">Nessun sito esterno (visite dirette o da app).</p>
            <ol class="bar-list">
              <li v-for="r in data.referrers" :key="r.name">
                <span class="bar-bg" :style="{ width: `${(r.count / data.referrers[0]!.count) * 100}%` }" />
                <span class="name">{{ r.name }}</span>
                <span class="count">{{ nf.format(r.count) }}</span>
              </li>
            </ol>
          </section>
        </div>

        <details class="table-view">
          <summary>Vedi i dati in tabella</summary>
          <table>
            <thead>
              <tr>
                <th scope="col">Giorno</th>
                <th scope="col">Visualizzazioni</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="d in [...data.days].reverse()" :key="d.date">
                <td>{{ label(d.date, true) }}</td>
                <td>{{ nf.format(d.total) }}</td>
              </tr>
            </tbody>
          </table>
        </details>
      </template>
    </ClientOnly>
  </div>
</template>

<style scoped>
.intro {
  max-width: 60ch;
}
.notice {
  padding: 1rem 1.25rem;
  border-radius: var(--radius-sm);
  background: var(--surface-2);
}
.toolbar {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  justify-content: space-between;
  gap: 1rem;
  margin: 2rem 0 1rem;
}
.hero-number {
  display: flex;
  flex-direction: column;
}
.hero-number .value {
  font-family: var(--font-display);
  font-size: clamp(2.4rem, 6vw, 3.4rem);
  line-height: 1;
  color: var(--ink);
}
.ranges {
  display: flex;
  gap: 0.35rem;
  flex-wrap: wrap;
}
.range {
  padding: 0.4rem 0.9rem;
  border-radius: 999px;
  border: 1px solid var(--border);
  background: var(--surface);
  color: var(--text);
  font: 500 0.85rem var(--font-body);
  cursor: pointer;
}
.range.active {
  background: var(--ink);
  border-color: var(--ink);
  color: var(--on-dark);
}
.chart {
  margin: 0 0 2.5rem;
  padding: 1.25rem;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius);
}
.chart figcaption {
  font-weight: 600;
  margin-bottom: 0.75rem;
  color: var(--ink);
}
.chart-wrap {
  position: relative;
}
svg {
  display: block;
  max-width: 100%;
  overflow: visible;
}
.grid line {
  stroke: var(--border);
  stroke-width: 1;
}
.grid text,
.x-label {
  font: 11px var(--font-body);
  fill: var(--text-muted);
}
.bar {
  fill: var(--teal);
  transition: opacity 0.15s ease;
}
.bar.dim {
  opacity: 0.45;
}
.hit {
  fill: transparent;
}
.tooltip {
  position: absolute;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0.4rem 0.7rem;
  border-radius: var(--radius-sm);
  background: var(--ink-deep);
  color: var(--on-dark);
  font-size: 0.8rem;
  white-space: nowrap;
  pointer-events: none;
  box-shadow: var(--shadow);
}
.tooltip strong {
  font-size: 1rem;
}
.lists {
  display: grid;
  gap: 2rem;
}
@media (min-width: 800px) {
  .lists {
    grid-template-columns: 1fr 1fr;
  }
}
.lists h2 {
  font-size: 1.35rem;
}
.bar-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  gap: 0.35rem;
}
.bar-list li {
  position: relative;
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  padding: 0.45rem 0.75rem;
  border-radius: var(--radius-sm);
  overflow: hidden;
  font-size: 0.92rem;
}
.bar-bg {
  position: absolute;
  inset: 0 auto 0 0;
  background: color-mix(in srgb, var(--teal) 14%, transparent);
  border-radius: var(--radius-sm);
}
.name,
.count {
  position: relative;
}
.name {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.count {
  font-variant-numeric: tabular-nums;
  color: var(--text-muted);
}
.table-view {
  margin-top: 2.5rem;
}
.table-view summary {
  cursor: pointer;
  font-weight: 600;
  color: var(--teal);
}
table {
  margin-top: 1rem;
  border-collapse: collapse;
  width: 100%;
  max-width: 420px;
  font-size: 0.92rem;
}
th,
td {
  text-align: left;
  padding: 0.4rem 0.6rem;
  border-bottom: 1px solid var(--border);
}
td:last-child,
th:last-child {
  text-align: right;
  font-variant-numeric: tabular-nums;
}
</style>
