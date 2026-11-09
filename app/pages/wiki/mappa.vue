<script setup lang="ts">
import type { LuogoMappa, Riquadro } from '~/components/mappa/MappaAnello.vue'

// The interactive map of the Ring. Places come from content/mappa.yml, the texts below the map from
// content/wiki/mappa.md (which also puts the map in the wiki menu and in the wiki search).
const route = useRoute()
const router = useRouter()

const [{ data: pagina }, { data: dati }] = await Promise.all([
  useAsyncData('wiki-mappa', () => queryCollection('wiki').path('/wiki/mappa').first()),
  useAsyncData('mappa-luoghi', () => queryCollection('mappa').first()),
])
const luoghi = computed<LuogoMappa[]>(() =>
  (dati.value?.luoghi ?? []).map((l) => ({ ...l, livello: l.livello ?? 2, stimato: l.stimato ?? false })),
)

useNotte()
useSocialMeta({
  title: 'Mappa dell’Anello · Wiki',
  description: () => pagina.value?.description,
  image: '/mappa/anello.jpg',
  modified: () => pagina.value?.updated,
})

const TIPI: Record<string, string> = {
  capitale: 'Capitale',
  citta: 'Città',
  borgo: 'Borgo',
  fortezza: 'Fortezza',
  luogo: 'Luogo',
  evento: 'Battaglia',
  macro: 'Terra',
  regione: 'Regione',
  regno: 'Regno',
  mare: 'Mare',
  isola: 'Isola',
  foresta: 'Foresta',
  monti: 'Monti',
  pianura: 'Pianura',
  lago: 'Lago',
  fiume: 'Fiume',
  deserto: 'Deserto',
  palude: 'Palude',
}
const AREE: Record<string, string> = { nord: 'Nord', est: 'Est', sud: 'Sud', ovest: 'Ovest', mare: 'Mare Interno' }
const DELLE_AREE: Record<string, string> = {
  nord: 'del Nord',
  est: 'dell’Est',
  sud: 'del Sud',
  ovest: 'dell’Ovest',
  mare: 'del Mare Interno',
}

// ---------- Selection, kept in the address (?luogo=partaros) so it can be shared ----------
type Comandi = {
  vaiA: (id: string, durata?: number) => void
  mostra: (id: string) => void
  adatta: () => void
  zoom: (f: number) => void
}
const mappa = ref<Comandi>()
// The 3D relief (?vista=3d): downloaded only when opened, it lies over the flat map
const rilievo = ref<Comandi>()
const vista3d = ref(route.query.vista === '3d')
const attiva = computed(() => (vista3d.value ? rilievo.value : mappa.value))
const selezionato = ref<string | null>(typeof route.query.luogo === 'string' ? route.query.luogo : null)
const luogo = computed(() => luoghi.value.find((l) => l.id === selezionato.value))

function aggiornaIndirizzo() {
  router.replace({
    query: {
      ...(selezionato.value ? { luogo: selezionato.value } : {}),
      ...(vista3d.value ? { vista: '3d' } : {}),
    },
  })
}
function seleziona(id: string | null, vola = false) {
  selezionato.value = id
  aggiornaIndirizzo()
  if (id && vola) attiva.value?.vaiA(id)
  // Tapped on the map: once the panel is open, make sure it does not hide the place
  else if (id) nextTick(() => requestAnimationFrame(() => attiva.value?.mostra(id)))
}
function cambiaVista() {
  vista3d.value = !vista3d.value
  livelliAperti.value = false
  aggiornaIndirizzo()
  // Back to the flat map: show the place chosen meanwhile
  if (!vista3d.value && selezionato.value) nextTick(() => mappa.value?.vaiA(selezionato.value!))
}
// Back and forward buttons
watch(
  () => route.query.luogo,
  (q) => {
    const id = typeof q === 'string' ? q : null
    if (id !== selezionato.value) seleziona(id, true)
  },
)
watch(
  () => route.query.vista,
  (q) => {
    if ((q === '3d') !== vista3d.value) cambiaVista()
  },
)

// ---------- Layers ----------
const livelli = reactive({ confini: true, insediamenti: true, eventi: true, stimati: false })
const livelliAperti = ref(false)

// ---------- Search ----------
const cerca = ref('')
const attivo = ref(0)
const normalizza = (t: string) =>
  t
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()
const risultati = computed(() => {
  const q = normalizza(cerca.value.trim())
  if (!q) return []
  return luoghi.value
    .map((l) => {
      const nome = normalizza(l.nome)
      const altro = normalizza(l.dipinto ?? '')
      const punti = nome.startsWith(q) ? 0 : nome.includes(q) ? 1 : altro.includes(q) ? 2 : -1
      return { l, punti }
    })
    .filter((r) => r.punti >= 0)
    .sort((a, b) => a.punti - b.punti || a.l.livello - b.l.livello || a.l.nome.localeCompare(b.l.nome, 'it'))
    .slice(0, 8)
    .map((r) => r.l)
})
watch(cerca, () => (attivo.value = 0))
function scegli(l: LuogoMappa) {
  cerca.value = ''
  seleziona(l.id, true)
}
function tastoRicerca(e: KeyboardEvent) {
  const n = risultati.value.length
  if (!n) return
  if (e.key === 'ArrowDown') attivo.value = (attivo.value + 1) % n
  else if (e.key === 'ArrowUp') attivo.value = (attivo.value - 1 + n) % n
  else if (e.key === 'Enter') scegli(risultati.value[attivo.value]!)
  else if (e.key === 'Escape') cerca.value = ''
  else return
  e.preventDefault()
}

// ---------- Room taken by the panels over the map ----------
const testata = ref<HTMLElement>()
const scheda = ref<HTMLElement>()
const largo = ref(false)
const misure = reactive({ testata: 0, scheda: 0 })
const riquadro = computed<Riquadro>(() =>
  largo.value
    ? { top: 0, left: 0, right: luogo.value ? misure.scheda + 80 : 0, bottom: 0 }
    : { top: misure.testata + 12, left: 0, right: 0, bottom: luogo.value ? misure.scheda : 0 },
)
let osservatore: ResizeObserver | undefined
onMounted(() => {
  const mq = matchMedia('(min-width: 64rem)')
  const aggiorna = () => (largo.value = mq.matches)
  aggiorna()
  mq.addEventListener('change', aggiorna)
  osservatore = new ResizeObserver(() => {
    misure.testata = largo.value ? (testata.value?.offsetWidth ?? 0) : (testata.value?.offsetHeight ?? 0)
    misure.scheda = largo.value ? (scheda.value?.offsetWidth ?? 0) : (scheda.value?.offsetHeight ?? 0)
  })
  if (testata.value) osservatore.observe(testata.value)
  // The selected place from the address: show it once the map knows its size
  if (selezionato.value) requestAnimationFrame(() => mappa.value?.vaiA(selezionato.value!, 0))
})
watch(scheda, (el, prima) => {
  if (prima) osservatore?.unobserve(prima)
  if (el) osservatore?.observe(el)
  else misure.scheda = 0
})
onBeforeUnmount(() => osservatore?.disconnect())

// ---------- The list under the map ----------
const MARCATORI = ['capitale', 'citta', 'borgo', 'fortezza', 'luogo', 'evento']
const elenco = computed(() =>
  Object.keys(AREE).map((area) => ({
    area,
    nome: AREE[area]!,
    luoghi: luoghi.value
      .filter((l) => l.area === area && l.tipo !== 'macro' && (l.testo || MARCATORI.includes(l.tipo)))
      .sort((a, b) => a.nome.localeCompare(b.nome, 'it')),
  })),
)
const sezioneMappa = ref<HTMLElement>()

// ---------- Full screen ----------
// The browser's own full screen where it allows it; where it does not (Safari on iPhone, for pages) the map simply
// covers the whole window, site header included
const schermoIntero = ref(false)
let nativo = false
/** Once the map has its new size: the whole Ring again, or the chosen place */
function riadatta() {
  nextTick(() =>
    requestAnimationFrame(() => (selezionato.value ? attiva.value?.vaiA(selezionato.value) : attiva.value?.adatta())),
  )
}
async function cambiaSchermoIntero() {
  const el = sezioneMappa.value
  if (!el) return
  if (schermoIntero.value) {
    if (document.fullscreenElement) await document.exitFullscreen().catch(() => {})
    return esciDalloSchermoIntero()
  }
  schermoIntero.value = true
  document.documentElement.style.overflow = 'hidden'
  if (el.requestFullscreen) {
    try {
      await el.requestFullscreen({ navigationUI: 'hide' })
      nativo = true
    } catch {
      nativo = false
    }
  }
  riadatta()
}
function esciDalloSchermoIntero() {
  schermoIntero.value = false
  nativo = false
  document.documentElement.style.overflow = ''
  riadatta()
}
// Left with the browser's own means (Esc, the system gesture): follow it
function suCambioSchermo() {
  if (!document.fullscreenElement && nativo) esciDalloSchermoIntero()
}
function suTasto(e: KeyboardEvent) {
  if (e.key === 'Escape' && schermoIntero.value && !nativo) esciDalloSchermoIntero()
}
onMounted(() => {
  document.addEventListener('fullscreenchange', suCambioSchermo)
  document.addEventListener('keydown', suTasto)
})
onBeforeUnmount(() => {
  document.removeEventListener('fullscreenchange', suCambioSchermo)
  document.removeEventListener('keydown', suTasto)
  document.documentElement.style.overflow = ''
})
function mostra(id: string) {
  sezioneMappa.value?.scrollIntoView({ behavior: 'smooth' })
  seleziona(id, true)
}

const testoScheda = computed(() => {
  const l = luogo.value
  if (!l) return ''
  if (l.testo) return l.testo
  if (l.tipo === 'isola') return `Isola ${DELLE_AREE.mare}.`
  if (l.tipo === 'mare') return 'Uno dei mari in cui si divide il Mare Interno.'
  return `${TIPI[l.tipo]} ${DELLE_AREE[l.area]}. La wiki non ne parla ancora.`
})
</script>

<template>
  <div>
    <section
      ref="sezioneMappa"
      :class="
        schermoIntero
          ? 'fixed inset-0 z-70 h-dvh bg-ink-deep'
          : 'relative h-[calc(100svh-var(--spacing-header)-6rem)] min-h-[28rem] lg:h-[calc(100svh-var(--spacing-header)-2.5rem)]'
      "
      aria-label="Mappa interattiva"
    >
      <MappaAnello
        ref="mappa"
        class="absolute inset-0"
        :luoghi="luoghi"
        :selezionato="selezionato"
        :confini="livelli.confini"
        :insediamenti="livelli.insediamenti"
        :eventi="livelli.eventi"
        :stimati="livelli.stimati"
        :riquadro="riquadro"
        :inert="vista3d"
        @seleziona="seleziona"
      />
      <LazyMappaRilievo
        v-if="vista3d"
        ref="rilievo"
        class="absolute inset-0"
        :luoghi="luoghi"
        :selezionato="selezionato"
        :insediamenti="livelli.insediamenti"
        :riquadro="riquadro"
        @seleziona="seleziona"
      />

      <!-- Title and search -->
      <div ref="testata" class="pointer-events-none absolute inset-x-3 top-3 lg:right-auto lg:w-[22rem]">
        <div
          class="pointer-events-auto rounded-card bg-surface/95 p-3 shadow-card-lg ring-1 ring-line backdrop-blur-sm sm:p-4"
        >
          <nav aria-label="Percorso" class="text-xs">
            <NuxtLink to="/wiki" class="font-semibold tracking-wide text-gold-ink no-underline"
              >Wiki di Fulcron</NuxtLink
            >
            <span class="text-muted" aria-hidden="true"> › </span>
            <NuxtLink to="/wiki/geopolitica" class="text-muted no-underline hover:text-ink">Geografia e Regni</NuxtLink>
          </nav>
          <h1 class="mt-1 mb-2 text-[clamp(1.4rem,3vw,1.9rem)]">Mappa dell’Anello</h1>
          <div class="relative">
            <AppIcon
              name="search"
              :size="18"
              class="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-muted"
            />
            <input
              v-model="cerca"
              type="search"
              placeholder="Cerca un luogo…"
              aria-label="Cerca un luogo sulla mappa"
              aria-controls="mappa-risultati"
              :aria-expanded="risultati.length > 0"
              :aria-activedescendant="risultati.length ? `mappa-r-${attivo}` : undefined"
              role="combobox"
              autocomplete="off"
              class="w-full rounded-lg border border-line bg-surface py-2 pr-3 pl-9 text-[0.95rem] text-ink placeholder:text-muted focus:border-gold focus:outline-none"
              @keydown="tastoRicerca"
            />
            <ul
              v-show="risultati.length"
              id="mappa-risultati"
              role="listbox"
              class="absolute inset-x-0 top-full z-10 mt-1 overflow-hidden rounded-lg border border-line bg-surface shadow-card-lg"
            >
              <li
                v-for="(r, i) in risultati"
                :id="`mappa-r-${i}`"
                :key="r.id"
                role="option"
                :aria-selected="i === attivo"
                class="flex cursor-pointer items-baseline justify-between gap-3 px-3 py-2 text-[0.95rem]"
                :class="i === attivo ? 'bg-surface-2 text-ink' : 'text-body'"
                @mouseenter="attivo = i"
                @mousedown.prevent="scegli(r)"
              >
                <span>{{ r.nome }}</span>
                <span class="text-xs text-muted">{{ TIPI[r.tipo] }} · {{ AREE[r.area] }}</span>
              </li>
            </ul>
            <p v-if="cerca.trim() && !risultati.length" class="mt-2 text-sm text-muted">
              Nessun luogo con questo nome.
            </p>
          </div>
        </div>
      </div>

      <!-- Zoom and layers -->
      <!-- From under the title box to the bottom of the map: the layers panel sits beside the buttons on phones and
           above them on wide screens, and scrolls if it does not fit (it used to slip under the site header) -->
      <div
        class="pointer-events-none absolute right-3 flex items-end justify-end gap-2 transition-[bottom] duration-300 lg:flex-col"
        :style="{ top: `${largo ? 12 : misure.testata + 24}px`, bottom: `${(largo ? 0 : riquadro.bottom) + 12}px` }"
      >
        <div
          v-if="livelliAperti"
          id="mappa-livelli"
          class="pointer-events-auto max-h-full min-h-0 w-60 overflow-y-auto overscroll-contain rounded-card bg-surface/95 p-4 text-sm shadow-card-lg ring-1 ring-line backdrop-blur-sm"
        >
          <p class="mb-2 font-semibold text-ink">Mostra sulla mappa</p>
          <label class="flex items-center gap-2 py-1"
            ><input v-model="livelli.insediamenti" type="checkbox" /> Città e luoghi</label
          >
          <label class="flex items-center gap-2 py-1"
            ><input v-model="livelli.eventi" type="checkbox" /> Battaglie</label
          >
          <label class="flex items-center gap-2 py-1"
            ><input v-model="livelli.confini" type="checkbox" /> Confini</label
          >
          <label class="flex items-center gap-2 py-1"
            ><input v-model="livelli.stimati" type="checkbox" /> Evidenzia le posizioni indicative</label
          >
          <p class="mt-3 mb-1 font-semibold text-ink">Legenda</p>
          <ul class="space-y-1 text-muted">
            <li class="flex items-center gap-2">
              <svg width="16" height="16" viewBox="-8 -8 16 16" aria-hidden="true">
                <path d="M-6 5V-2H-4.6V-5H-2.6V-2H-1V-6.5H1V-2H2.6V-5H4.6V-2H6V5Z" fill="#2b2118" />
              </svg>
              Capitale
            </li>
            <li class="flex items-center gap-2">
              <svg width="16" height="16" viewBox="-8 -8 16 16" aria-hidden="true">
                <circle r="4.2" fill="#efe5cc" stroke="#2b2118" stroke-width="1.6" />
                <circle r="1.7" fill="#2b2118" />
              </svg>
              Città
            </li>
            <li class="flex items-center gap-2">
              <svg width="16" height="16" viewBox="-8 -8 16 16" aria-hidden="true">
                <circle r="2.6" fill="#2b2118" />
              </svg>
              Borgo
            </li>
            <li class="flex items-center gap-2">
              <svg width="16" height="16" viewBox="-8 -8 16 16" aria-hidden="true">
                <path d="M-3.6 5V-1.5H-4.8V-5.5H-2.8V-3.8H-1V-5.5H1V-3.8H2.8V-5.5H4.8V-1.5H3.6V5Z" fill="#2b2118" />
              </svg>
              Fortezza
            </li>
            <li class="flex items-center gap-2">
              <svg width="16" height="16" viewBox="-8 -8 16 16" aria-hidden="true">
                <rect x="-3.6" y="-3.6" width="7.2" height="7.2" transform="rotate(45)" fill="#7a3326" />
              </svg>
              Luogo notevole
            </li>
            <li class="flex items-center gap-2">
              <svg width="16" height="16" viewBox="-8 -8 16 16" aria-hidden="true">
                <path
                  d="M-5 -5L5 5M5 -5L-5 5M-5 -1.5L-1.5 -5M5 -1.5L1.5 -5"
                  stroke="#8a2b1e"
                  stroke-width="2"
                  stroke-linecap="round"
                  fill="none"
                />
              </svg>
              Battaglia
            </li>
            <li class="flex items-center gap-2">
              <svg width="16" height="16" viewBox="-8 -8 16 16" aria-hidden="true">
                <path d="M-7 0H7" stroke="#9a3a2a" stroke-width="2.4" stroke-dasharray="0.1 4" stroke-linecap="round" />
              </svg>
              Confine tra le quattro terre
            </li>
            <li class="flex items-center gap-2">
              <svg width="16" height="16" viewBox="-8 -8 16 16" aria-hidden="true">
                <circle r="6" fill="none" stroke="#8a3527" stroke-width="1.4" stroke-dasharray="2.5 2.5" />
              </svg>
              Posizione indicativa
            </li>
          </ul>
        </div>
        <div
          class="pointer-events-auto flex shrink-0 flex-col overflow-hidden rounded-lg bg-surface/95 shadow-card-lg ring-1 ring-line backdrop-blur-sm"
        >
          <button
            type="button"
            class="grid size-11 place-items-center font-heading text-[0.95rem] font-semibold text-ink hover:bg-surface-2"
            :aria-label="vista3d ? 'Torna alla mappa piatta' : 'Vedi l’Anello in rilievo, in 3D'"
            :aria-pressed="vista3d"
            @click="cambiaVista"
          >
            {{ vista3d ? '2D' : '3D' }}
          </button>
          <button
            type="button"
            class="grid size-11 place-items-center border-t border-line text-ink hover:bg-surface-2"
            :aria-label="schermoIntero ? 'Esci dallo schermo intero' : 'Schermo intero'"
            :aria-pressed="schermoIntero"
            @click="cambiaSchermoIntero"
          >
            <AppIcon :name="schermoIntero ? 'shrink' : 'expand'" />
          </button>
          <button
            v-show="!vista3d"
            type="button"
            class="grid size-11 place-items-center border-t border-line text-ink hover:bg-surface-2"
            :class="livelliAperti && 'bg-surface-2'"
            aria-label="Livelli e legenda"
            aria-controls="mappa-livelli"
            :aria-expanded="livelliAperti"
            @click="livelliAperti = !livelliAperti"
          >
            <AppIcon name="layers" />
          </button>
          <button
            type="button"
            class="grid size-11 place-items-center border-t border-line text-ink hover:bg-surface-2"
            aria-label="Ingrandisci"
            @click="attiva?.zoom(1.6)"
          >
            <AppIcon name="plus" />
          </button>
          <button
            type="button"
            class="grid size-11 place-items-center border-t border-line text-ink hover:bg-surface-2"
            aria-label="Rimpicciolisci"
            @click="attiva?.zoom(1 / 1.6)"
          >
            <AppIcon name="minus" />
          </button>
          <button
            type="button"
            class="grid size-11 place-items-center border-t border-line text-ink hover:bg-surface-2"
            aria-label="Mostra tutto l’Anello"
            @click="attiva?.adatta()"
          >
            <AppIcon name="fit" />
          </button>
        </div>
      </div>

      <!-- The selected place: on the right on wide screens, at the bottom on phones -->
      <Transition
        enter-active-class="transition duration-300 ease-out"
        enter-from-class="opacity-0 translate-y-4 lg:translate-y-0 lg:translate-x-4"
        leave-active-class="transition duration-150 ease-in"
        leave-to-class="opacity-0"
      >
        <aside
          v-if="luogo"
          ref="scheda"
          :key="luogo.id"
          class="absolute inset-x-0 bottom-0 max-h-[46%] overflow-y-auto rounded-t-card bg-surface p-5 shadow-card-lg ring-1 ring-line lg:inset-x-auto lg:top-3 lg:right-[4.25rem] lg:bottom-auto lg:max-h-[calc(100%-1.5rem)] lg:w-[22rem] lg:rounded-card"
          aria-live="polite"
        >
          <button
            type="button"
            class="absolute top-3 right-3 grid size-9 place-items-center rounded-full text-muted hover:bg-surface-2 hover:text-ink"
            aria-label="Chiudi la scheda"
            @click="seleziona(null)"
          >
            <AppIcon name="close" :size="18" />
          </button>
          <p class="pr-10 text-xs font-semibold tracking-wider text-gold-ink uppercase">
            {{ TIPI[luogo.tipo] }}<template v-if="luogo.tipo !== 'macro'"> · {{ AREE[luogo.area] }}</template>
          </p>
          <h2 class="mt-1 pr-8 text-subheading">{{ luogo.nome }}</h2>
          <p v-if="luogo.dipinto" class="mt-1 text-sm text-muted">Sulla mappa dipinta: {{ luogo.dipinto }}</p>
          <p
            v-if="luogo.stimato"
            class="mt-3 inline-flex items-center gap-2 rounded-full bg-surface-2 px-3 py-1 text-xs font-semibold text-ink"
          >
            <AppIcon name="pin" :size="14" />
            Posizione indicativa
          </p>
          <p class="mt-3 text-[0.98rem] leading-relaxed">{{ testoScheda }}</p>
          <UiButton
            v-if="luogo.wiki"
            :to="luogo.wiki"
            variant="primary"
            size="sm"
            icon-right="arrow-right"
            class="mt-4"
          >
            Leggi nella wiki
          </UiButton>
        </aside>
      </Transition>
    </section>

    <!-- Under the map: how to read it, and every place as a list -->
    <div class="container-site py-[clamp(2.5rem,6vw,4rem)]">
      <ContentRenderer v-if="pagina" :value="pagina" class="prose-fulcron max-w-reading" />

      <h2 class="mt-12 mb-6 text-heading">Tutti i luoghi</h2>
      <div class="grid gap-x-8 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
        <section v-for="gruppo in elenco" :key="gruppo.area">
          <h3 class="mb-2 border-b border-line pb-1 text-[1.25rem]">{{ gruppo.nome }}</h3>
          <ul class="columns-2 gap-4 text-[0.95rem]">
            <li v-for="l in gruppo.luoghi" :key="l.id" class="break-inside-avoid">
              <button
                type="button"
                class="py-0.5 text-left text-body hover:text-gold-ink hover:underline"
                @click="mostra(l.id)"
              >
                {{ l.nome }}
              </button>
            </li>
          </ul>
        </section>
      </div>
    </div>
  </div>
</template>
