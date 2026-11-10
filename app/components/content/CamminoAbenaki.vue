<script setup lang="ts">
// ::cammino-abenaki — the wandering of the four Abenaki peoples around the Ring, as a wheel that turns with our real
// days. One loop of the Ring takes one year: every year on the day in `inizio` (giorno-mese, our months are the
// months of Fulcron) each people sets off from the heart of its own land and walks in the direction of `verso`
// (orario: Est → Sud → Ovest → Nord, antiorario: the other way), a quarter of the year in each land. They come back
// to it some weeks before the next departure, to celebrate the Masar where they set off.
// `evidenzia` is the people the page is about: its land lights up and the months of the wheel follow its walk.
// E.g. ::cammino-abenaki{evidenzia="sud" inizio="21-03" verso="antiorario"}.
// The site is static: today is only known in the browser, so the markers appear once the page is open.
const props = withDefaults(defineProps<{ inizio?: string; verso?: string; evidenzia?: string }>(), {
  inizio: '01-03',
  verso: 'orario',
  evidenzia: 'est',
})

const REGIONI = [
  { id: 'nord', nome: 'Nord', centro: -90 },
  { id: 'est', nome: 'Est', centro: 0 },
  { id: 'sud', nome: 'Sud', centro: 90 },
  { id: 'ovest', nome: 'Ovest', centro: 180 },
] as const
type Regione = (typeof REGIONI)[number]

/** The four peoples, each with the colour of its pigment (only the East and the South are described by the wiki) */
const POPOLI = [
  { id: 'est', nome: 'Abenaki dell’Est', colore: '#1d4ed8', luce: '#38bdf8', bordo: '#bae6fd', pagina: '/wiki/popoli/abenaki' },
  { id: 'sud', nome: 'Abenaki del Sud', colore: '#15803d', luce: '#86efac', bordo: '#dcfce7', pagina: '/wiki/popoli/abenaki-del-sud' },
  { id: 'ovest', nome: 'Abenaki dell’Ovest', colore: '#c2410c', luce: '#fdba74', bordo: '#ffedd5', pagina: '' },
  { id: 'nord', nome: 'Abenaki del Nord', colore: '#7c3aed', luce: '#c4b5fd', bordo: '#ede9fe', pagina: '' },
] as const

const C = 220 // centre of the wheel
const R_TERRA_FUORI = 172
const R_TERRA_DENTRO = 118
const R_CAMMINO = 157 // the way, near the outer edge: each people walks its own lane around it
const CORSIA = 7
const R_NOMI = 134 // names of the lands, near the sea
const R_MESI = 194

const orario = computed(() => props.verso !== 'antiorario')
const centro = (regione: string) => REGIONI.find((r) => r.id === regione)?.centro ?? 0
const scelto = computed(() => (POPOLI.some((p) => p.id === props.evidenzia) ? props.evidenzia : 'est'))

const UN_GIORNO = 86400000
/** Days from `da` to `a` (local dates) */
const giorni = (da: Date, a: Date) =>
  Math.round(
    (Date.UTC(a.getFullYear(), a.getMonth(), a.getDate()) - Date.UTC(da.getFullYear(), da.getMonth(), da.getDate())) /
      UN_GIORNO,
  )
const giornoPartenza = computed(() => {
  const [g, m] = props.inizio.split('-').map(Number)
  return { g: g || 1, m: (m || 1) - 1 }
})
/** The day of departure in a given year */
const partenzaNel = (anno: number) => new Date(anno, giornoPartenza.value.m, giornoPartenza.value.g)
/** The last departure on or before a day */
const partenzaPrima = (d: Date) => {
  const p = partenzaNel(d.getFullYear())
  return p > d ? partenzaNel(d.getFullYear() - 1) : p
}

/** Angle on the wheel (degrees, 0 = east, clockwise as on the map) for a fraction (0–1) of the loop of a people
 * that set off from the heart of `partenza` */
const angolo = (f: number, partenza = scelto.value) => centro(partenza) + (orario.value ? 1 : -1) * 360 * f
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
onMounted(() => (oggi.value = new Date()))

/** The loop the tribes are walking today: from the last departure to the next one */
const ciclo = computed(() => {
  const inizio = partenzaPrima(oggi.value ?? new Date(2026, 0, 1))
  return { inizio, totale: giorni(inizio, partenzaNel(inizio.getFullYear() + 1)) }
})
const totale = computed(() => ciclo.value.totale)
/** Day of the loop shown on the wheel (0 = day of departure), moved by the slider */
const indice = ref(0)
watch(oggi, (d) => d && (indice.value = giorni(ciclo.value.inizio, d)))
const giorno = computed(() => {
  if (!oggi.value) return null
  const d = new Date(ciclo.value.inizio)
  d.setDate(d.getDate() + indice.value)
  return d
})

/** Where a day of our calendar falls in the loop (0–1) */
const nelCiclo = (m: number, g: number) => {
  const { inizio } = ciclo.value
  let d = new Date(inizio.getFullYear(), m, g)
  if (d < inizio) d = new Date(inizio.getFullYear() + 1, m, g)
  return giorni(inizio, d) / totale.value
}
const mesi = computed(() =>
  MESI_FULCRON.map((nome, m) => {
    const inizio = angolo(nelCiclo(m, 1))
    return {
      nome,
      linea: [punto(inizio, R_TERRA_FUORI), punto(inizio, R_TERRA_FUORI + 9)],
      etichetta: punto(angolo(nelCiclo(m, 15)), R_MESI),
    }
  }),
)
const regioni = REGIONI.map((r) => ({
  ...r,
  d: fetta(r.centro - 45, r.centro + 45, R_TERRA_FUORI, R_TERRA_DENTRO),
  etichetta: punto(r.centro, R_NOMI),
}))

const frazione = computed(() => (indice.value + 0.5) / totale.value)
const testoPartenza = computed(() => `${giornoPartenza.value.g} ${MESI_FULCRON[giornoPartenza.value.m]}`)
const regioneA = (gradi: number): Regione => {
  const a = (((gradi + 45) % 360) + 360) % 360
  return REGIONI[[1, 2, 3, 0][Math.floor(a / 90)]!]!
}
const popoli = computed(() =>
  POPOLI.map((p, i) => {
    const r = R_CAMMINO + (i - 1.5) * CORSIA
    const da = angolo(0, p.id)
    const ora = angolo(frazione.value, p.id)
    const p1 = punto(da, r)
    const p2 = punto(ora, r)
    const grande = Math.abs(ora - da) > 180 ? 1 : 0
    return {
      ...p,
      scelto: p.id === scelto.value,
      partenza: p1,
      posizione: p2,
      /** The stretch walked since the departure */
      scia: `M${p1.x} ${p1.y}A${r} ${r} 0 ${grande} ${orario.value ? 1 : 0} ${p2.x} ${p2.y}`,
      regione: regioneA(ora),
    }
  })
    // the people of the page is drawn last, on top of the others, and listed first
    .sort((a, b) => Number(a.scelto) - Number(b.scelto)),
)
const elenco = computed(() => [popoli.value.at(-1)!, ...popoli.value.slice(0, -1)])
const regione = computed(() => popoli.value.at(-1)!.regione)
const data = computed(() => (giorno.value ? dataFulcron(giorno.value) : null))
const eOggi = computed(() => !!oggi.value && !!giorno.value && giorno.value.toDateString() === oggi.value.toDateString())
const nelle = (r: Regione) => (r.id === 'est' || r.id === 'ovest' ? `nell’${r.nome}` : `nel ${r.nome}`)
const id = useId()
</script>

<template>
  <figure class="not-prose my-8 rounded-card border border-line bg-surface p-5 shadow-card sm:p-6">
    <svg
      viewBox="0 0 440 440"
      class="mx-auto block w-full max-w-md"
      role="img"
      :aria-label="
        data
          ? `Il cammino degli Abenaki, ${data.testo}: ${elenco.map((p) => `${p.nome} ${nelle(p.regione)}`).join(', ')}`
          : 'Il cammino degli Abenaki attorno all’Anello'
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

      <!-- The four peoples: where each set off, the way walked so far and where it is, glowing like its pigment -->
      <g v-for="p in popoli" :key="p.id" :opacity="p.scelto ? 1 : 0.75">
        <rect
          :x="p.partenza.x - 4"
          :y="p.partenza.y - 4"
          width="8"
          height="8"
          :transform="`rotate(45 ${p.partenza.x} ${p.partenza.y})`"
          :fill="p.colore"
          class="stroke-surface"
          stroke-width="1.5"
        >
          <title>Partenza degli {{ p.nome }}: {{ testoPartenza }}</title>
        </rect>
        <template v-if="data">
          <path
            :d="p.scia"
            fill="none"
            :stroke="p.colore"
            :stroke-width="p.scelto ? 3 : 2"
            stroke-linecap="round"
            stroke-dasharray="2 6"
            :opacity="p.scelto ? 0.75 : 0.45"
          />
          <circle
            :cx="p.posizione.x"
            :cy="p.posizione.y"
            :r="p.scelto ? 11 : 8"
            :fill="p.luce"
            opacity="0.6"
            :filter="`url(#${id}-luce)`"
          />
          <circle
            :cx="p.posizione.x"
            :cy="p.posizione.y"
            :r="p.scelto ? 6.5 : 5"
            :fill="p.colore"
            :stroke="p.bordo"
            stroke-width="2"
          >
            <title>{{ p.nome }}</title>
          </circle>
        </template>
      </g>
    </svg>

    <figcaption class="mt-4 text-center">
      <p class="mb-1 text-xs font-semibold tracking-[0.18em] text-gold-ink uppercase">
        {{ eOggi ? 'Oggi' : 'In questo giorno' }}
      </p>
      <p class="m-0 min-h-[1.4em] font-display text-[clamp(1.3rem,3.2vw,1.7rem)] text-ink" aria-live="polite">
        <template v-if="data">{{ data.testo }}</template>
      </p>
      <p class="mt-1 mb-0 min-h-[1.4em] text-sm text-muted">
        <template v-if="data">giorno {{ indice + 1 }} di {{ totale }} del cammino, partito il {{ testoPartenza }}</template>
      </p>
      <ul class="mx-auto mt-4 mb-0 grid max-w-md list-none gap-x-6 gap-y-1.5 p-0 text-left sm:grid-cols-2">
        <li v-for="p in elenco" :key="p.id" class="flex items-center gap-2 text-sm before:content-none" :class="p.scelto ? 'font-semibold text-ink' : 'text-body'">
          <span class="size-3 shrink-0 rounded-full" :style="{ background: p.colore, boxShadow: `0 0 6px ${p.luce}` }" aria-hidden="true" />
          <span>
            <NuxtLink v-if="p.pagina && !p.scelto" :to="p.pagina" class="text-teal underline">{{ p.nome }}</NuxtLink>
            <template v-else>{{ p.nome }}</template>
            <template v-if="data">: {{ nelle(p.regione) }}</template>
          </span>
        </li>
      </ul>
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
        @click="oggi && (indice = giorni(ciclo.inizio, oggi))"
      >
        Oggi
      </button>
    </div>
  </figure>
</template>
