<script setup lang="ts">
// ::cammino-abenaki — the wandering of the Abenaki around the Ring, as a wheel that turns with our real days.
// One loop of the Ring takes one year: the tribes set off on 1 Nevoso from the edge of the region in `partenza`
// and walk in the direction of `verso` (orario: Est → Sud → Ovest → Nord, antiorario: the other way), three months
// in each region. Both can be changed from the Markdown, e.g. ::cammino-abenaki{partenza="nord" verso="antiorario"}.
// The site is static: today is only known in the browser, so the marker appears once the page is open.
const props = withDefaults(defineProps<{ partenza?: string; verso?: string }>(), {
  partenza: 'est',
  verso: 'orario',
})

const REGIONI = [
  { id: 'nord', nome: 'Nord', centro: -90 },
  { id: 'est', nome: 'Est', centro: 0 },
  { id: 'sud', nome: 'Sud', centro: 90 },
  { id: 'ovest', nome: 'Ovest', centro: 180 },
] as const

const C = 220 // centre of the wheel
const R_TERRA_FUORI = 172
const R_TERRA_DENTRO = 118
const R_CAMMINO = 157 // the way, near the outer edge
const R_NOMI = 134 // names of the lands, near the sea
const R_MESI = 194

const orario = computed(() => props.verso !== 'antiorario')
const centroPartenza = computed(() => REGIONI.find((r) => r.id === props.partenza)?.centro ?? 0)
/** Angle (degrees, 0 = east, clockwise as on the map) where the walk starts */
const angoloInizio = computed(() => centroPartenza.value + (orario.value ? -45 : 45))

const giorniAnno = (anno: number) => ((anno % 4 === 0 && anno % 100 !== 0) || anno % 400 === 0 ? 366 : 365)
const giornoAnno = (d: Date) =>
  Math.round((Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()) - Date.UTC(d.getFullYear(), 0, 1)) / 86400000)

/** Angle on the wheel for a fraction (0–1) of the year */
const angolo = (f: number) => angoloInizio.value + (orario.value ? 1 : -1) * 360 * f
const punto = (gradi: number, r: number) => {
  const a = (gradi * Math.PI) / 180
  return { x: +(C + r * Math.cos(a)).toFixed(2), y: +(C + r * Math.sin(a)).toFixed(2) }
}
/** SVG path of a ring slice between two angles (from < to) */
const fetta = (da: number, a: number, rFuori: number, rDentro: number) => {
  const p1 = punto(da, rFuori)
  const p2 = punto(a, rFuori)
  const p3 = punto(a, rDentro)
  const p4 = punto(da, rDentro)
  const grande = a - da > 180 ? 1 : 0
  return `M${p1.x} ${p1.y}A${rFuori} ${rFuori} 0 ${grande} 1 ${p2.x} ${p2.y}L${p3.x} ${p3.y}A${rDentro} ${rDentro} 0 ${grande} 0 ${p4.x} ${p4.y}Z`
}

const oggi = ref<Date | null>(null)
const scarto = ref(0) // days moved away from today with the slider
onMounted(() => (oggi.value = new Date()))

const giorno = computed(() => {
  if (!oggi.value) return null
  const d = new Date(oggi.value.getFullYear(), 0, 1)
  d.setDate(d.getDate() + scarto.value)
  return d
})
const totale = computed(() => giorniAnno((giorno.value ?? new Date(2026, 0, 1)).getFullYear()))
const indice = computed({
  get: () => (giorno.value ? giornoAnno(giorno.value) : 0),
  set: (v: number) => (scarto.value = Number(v)),
})
watch(oggi, (d) => d && (scarto.value = giornoAnno(d)))

const anno = computed(() => giorno.value?.getFullYear() ?? 2026)
const mesi = computed(() =>
  MESI_FULCRON.map((nome, m) => {
    const inizio = giornoAnno(new Date(anno.value, m, 1)) / totale.value
    const meta = giornoAnno(new Date(anno.value, m, 15)) / totale.value
    return { nome, linea: [punto(angolo(inizio), R_TERRA_FUORI), punto(angolo(inizio), R_TERRA_FUORI + 9)], etichetta: punto(angolo(meta), R_MESI) }
  }),
)
const regioni = REGIONI.map((r) => ({
  ...r,
  d: fetta(r.centro - 45, r.centro + 45, R_TERRA_FUORI, R_TERRA_DENTRO),
  etichetta: punto(r.centro, R_NOMI),
}))

const frazione = computed(() => (indice.value + 0.5) / totale.value)
const posizione = computed(() => punto(angolo(frazione.value), R_CAMMINO))
/** The stretch already walked this year */
const scia = computed(() => {
  const a = angolo(0)
  const b = angolo(frazione.value)
  const r = R_CAMMINO
  const p1 = punto(a, r)
  const p2 = punto(b, r)
  const grande = Math.abs(b - a) > 180 ? 1 : 0
  return `M${p1.x} ${p1.y}A${r} ${r} 0 ${grande} ${orario.value ? 1 : 0} ${p2.x} ${p2.y}`
})
const regione = computed(() => {
  const a = (((angolo(frazione.value) + 45) % 360) + 360) % 360
  return REGIONI[[1, 2, 3, 0][Math.floor(a / 90)]!]!
})
const data = computed(() => (giorno.value ? dataFulcron(giorno.value) : null))
const eOggi = computed(() => !!oggi.value && !!giorno.value && giorno.value.toDateString() === oggi.value.toDateString())
const nelle = (r: (typeof REGIONI)[number]) => (r.id === 'est' || r.id === 'ovest' ? `nell’${r.nome}` : `nel ${r.nome}`)
const id = useId()
</script>

<template>
  <figure class="not-prose my-8 rounded-card border border-line bg-surface p-5 shadow-card sm:p-6">
    <svg
      viewBox="0 0 440 440"
      class="mx-auto block w-full max-w-md"
      role="img"
      :aria-label="
        data ? `Il cammino degli Abenaki: ${data.testo}, sono ${nelle(regione)}` : 'Il cammino degli Abenaki attorno all’Anello'
      "
    >
      <defs>
        <radialGradient :id="`${id}-mare`">
          <stop offset="0%" stop-color="var(--color-teal)" stop-opacity="0.08" />
          <stop offset="100%" stop-color="var(--color-teal)" stop-opacity="0.22" />
        </radialGradient>
        <filter :id="`${id}-luce`" x="-100%" y="-100%" width="300%" height="300%">
          <feGaussianBlur stdDeviation="4" />
        </filter>
      </defs>

      <!-- The Inner Sea -->
      <circle :cx="C" :cy="C" :r="R_TERRA_DENTRO" :fill="`url(#${id}-mare)`" />
      <text :x="C" :y="C" text-anchor="middle" dominant-baseline="middle" class="fill-muted font-display text-[13px] italic">
        Mare Interno
      </text>

      <!-- The four lands of the Ring -->
      <path
        v-for="r in regioni"
        :key="r.id"
        :d="r.d"
        class="stroke-surface transition-colors duration-500"
        stroke-width="2"
        :class="r.id === regione.id && data ? 'fill-gold/30' : 'fill-surface-2'"
      />
      <text
        v-for="r in regioni"
        :key="`t-${r.id}`"
        :x="r.etichetta.x"
        :y="r.etichetta.y"
        :transform="`rotate(${r.id === 'est' ? 90 : r.id === 'ovest' ? -90 : 0} ${r.etichetta.x} ${r.etichetta.y})`"
        text-anchor="middle"
        dominant-baseline="middle"
        class="fill-ink font-heading text-[13px] tracking-[0.15em] uppercase"
      >
        {{ r.nome }}
      </text>

      <!-- The months of Fulcron -->
      <g class="text-[10px]">
        <template v-for="m in mesi" :key="m.nome">
          <line
            :x1="m.linea[0]!.x"
            :y1="m.linea[0]!.y"
            :x2="m.linea[1]!.x"
            :y2="m.linea[1]!.y"
            class="stroke-gold"
            stroke-width="1.5"
          />
          <text
            :x="m.etichetta.x"
            :y="m.etichetta.y"
            text-anchor="middle"
            dominant-baseline="middle"
            class="transition-colors"
            :class="data?.mese === m.nome ? 'fill-gold-ink font-semibold' : 'fill-muted'"
          >
            {{ m.nome }}
          </text>
        </template>
      </g>

      <!-- The way walked so far and the tribe, glowing like the Hajar 'azraq -->
      <template v-if="data">
        <path :d="scia" fill="none" stroke="#3b82f6" stroke-width="3" stroke-linecap="round" stroke-dasharray="2 6" opacity="0.7" />
        <circle :cx="posizione.x" :cy="posizione.y" r="11" fill="#38bdf8" opacity="0.6" :filter="`url(#${id}-luce)`" />
        <circle :cx="posizione.x" :cy="posizione.y" r="6.5" fill="#1d4ed8" stroke="#bae6fd" stroke-width="2" />
      </template>
    </svg>

    <figcaption class="mt-4 text-center">
      <p class="mb-1 text-xs font-semibold tracking-[0.18em] text-gold-ink uppercase">
        {{ eOggi ? 'Oggi gli Abenaki sono' : 'In questo giorno gli Abenaki sono' }}
      </p>
      <p class="m-0 min-h-[1.4em] font-display text-[clamp(1.4rem,3.5vw,1.9rem)] text-ink" aria-live="polite">
        <template v-if="data">{{ nelle(regione) }}</template>
      </p>
      <p class="mt-1 mb-0 min-h-[1.4em] text-sm text-muted">
        <template v-if="data">{{ data.testo }} · giorno {{ indice + 1 }} di {{ totale }} del cammino</template>
      </p>
    </figcaption>

    <div class="mx-auto mt-5 flex max-w-md flex-wrap items-center gap-3">
      <label :for="id" class="sr-only">Sposta il giorno</label>
      <input
        :id="id"
        v-model.number="indice"
        type="range"
        min="0"
        :max="totale - 1"
        :disabled="!data"
        class="min-h-11 flex-1 accent-gold"
      />
      <button
        type="button"
        class="min-h-11 rounded-lg border border-line px-3 text-sm font-semibold text-ink transition hover:border-gold disabled:opacity-40"
        :disabled="eOggi || !data"
        @click="oggi && (scarto = giornoAnno(oggi))"
      >
        Oggi
      </button>
    </div>
  </figure>
</template>
