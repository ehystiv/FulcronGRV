<script setup lang="ts">
// Interactive map of the Ring: an SVG drawn in the style of a fantasy map, with pan and zoom (mouse, wheel,
// fingers, keyboard). Map units go from 0 to 1280 on both axes (see utils/mappa.ts).
// Symbols and names of the places keep the same size on screen at every zoom; painted names (regions, seas,
// forests…) grow with the map. Smaller places appear only when there is room for them.

export interface LuogoMappa {
  id: string
  nome: string
  tipo: string
  area: string
  x: number
  y: number
  livello: number
  ruota?: number
  etichetta?: string
  lato?: 'destra' | 'sinistra'
  stimato: boolean
  dipinto?: string
  testo?: string
  wiki?: string
}

export interface Riquadro {
  top: number
  right: number
  bottom: number
  left: number
}

const props = withDefaults(
  defineProps<{
    luoghi: LuogoMappa[]
    selezionato?: string | null
    /** Layers that can be switched off */
    confini?: boolean
    insediamenti?: boolean
    eventi?: boolean
    /** Highlight the places whose position is only estimated */
    stimati?: boolean
    /** Room taken by the panels over the map (px): fitted views and flights keep clear of it */
    riquadro?: Riquadro
  }>(),
  {
    selezionato: null,
    confini: true,
    insediamenti: true,
    eventi: true,
    stimati: false,
    riquadro: () => ({ top: 0, right: 0, bottom: 0, left: 0 }),
  },
)
const emit = defineEmits<{ seleziona: [id: string | null] }>()

const LATO = MAPPA_LATO
const MARCATORI = new Set(['capitale', 'citta', 'borgo', 'fortezza', 'luogo', 'evento'])

// ---------- Terrain ----------
// Thousands of trees and peaks: scattered in the browser only, so the page itself stays light
const terreno = shallowRef<Terreno | null>(null)

const marcatori = computed(() => props.luoghi.filter((l) => MARCATORI.has(l.tipo)))
// Painted names: the size in map units, and the zoom step from which they are readable
const STILE_NOMI: Record<string, { fs: number; classe: string }> = {
  macro: { fs: 44, classe: 'n-macro' },
  regione: { fs: 18, classe: 'n-regione' },
  regno: { fs: 13.5, classe: 'n-regno' },
  mare: { fs: 12, classe: 'n-mare' },
  deserto: { fs: 17, classe: 'n-regione' },
  isola: { fs: 11, classe: 'n-isola' },
  foresta: { fs: 9, classe: 'n-foresta' },
  monti: { fs: 9, classe: 'n-monti' },
  pianura: { fs: 8, classe: 'n-monti' },
  lago: { fs: 7, classe: 'n-acqua' },
  fiume: { fs: 6.5, classe: 'n-acqua' },
  palude: { fs: 9, classe: 'n-foresta' },
}
// Lower bound of the screen scale (px per map unit) of each zoom step
const GRADINI = [0, 0.5, 0.8, 1.3, 2.2]
const nomi = computed(() =>
  props.luoghi
    .filter((l) => !MARCATORI.has(l.tipo))
    .map((l) => {
      const stile = STILE_NOMI[l.tipo] ?? STILE_NOMI.regione!
      let fs = l.tipo === 'isola' && l.livello >= 3 ? 7 : stile.fs
      let classe = stile.classe
      // The Mare Interno is a "land" of its own, but written like a sea
      if (l.tipo === 'macro' && l.area === 'mare') [fs, classe] = [19, 'n-mare n-mare-interno']
      // The great forests (the Chult) are named large, like regions
      if (l.tipo === 'foresta' && l.livello <= 1) fs = 17
      // The four lands and the sea are names for the whole map: they step aside when zooming in
      if (l.tipo === 'macro') classe += ' n-vasto'
      // Readable from about 7.5px on screen, never before the step of its level
      let da = GRADINI.findIndex((g) => g * fs >= 7.5)
      if (da < 0) da = GRADINI.length - 1
      if (l.livello <= 1) da = 0
      else da = Math.max(da, l.livello - 1)
      // "Città libere|del Deserto": one line per piece, centred on the point
      const righe = (l.etichetta ?? l.nome).split('|')
      return { ...l, fs, classe, da, righe }
    }),
)

// ---------- View ----------
const contenitore = ref<HTMLDivElement>()
const misure = reactive({ w: 0, h: 0 })
const vista = reactive({ x: 0, y: 0, w: LATO, h: LATO })
const pronta = ref(false)

const scala = computed(() => (misure.w ? misure.w / vista.w : 0.6))
const gradino = computed(() => {
  let g = 0
  GRADINI.forEach((soglia, i) => {
    if (scala.value >= soglia) g = i
  })
  return g
})
const viewBox = computed(() => (pronta.value ? `${vista.x} ${vista.y} ${vista.w} ${vista.h}` : `0 0 ${LATO} ${LATO}`))

/** Map width that shows the whole Ring inside the free part of the screen */
function larghezzaIntera() {
  const r = props.riquadro
  const liberoW = Math.max(misure.w - r.left - r.right, 120)
  const liberoH = Math.max(misure.h - r.top - r.bottom, 120)
  const scalaIntera = Math.min(liberoW, liberoH) / (LATO * 1.04)
  return misure.w / scalaIntera
}
// Closest zoom: about 4.5 screen pixels per map unit
const larghezzaMin = () => misure.w / 4.5

/** Puts the map point (cx, cy) at the centre of the free part of the screen, with the given width. */
function imposta(cx: number, cy: number, w: number) {
  const r = props.riquadro
  w = Math.min(Math.max(w, larghezzaMin()), larghezzaIntera() * 1.25)
  const s = misure.w / w
  const h = misure.h / s
  // Offset of the free area's centre from the screen centre, in map units
  const dx = (r.left - r.right) / 2 / s
  const dy = (r.top - r.bottom) / 2 / s
  vista.w = w
  vista.h = h
  vista.x = vincola(cx - w / 2 - dx, w, r.left / s, r.right / s)
  vista.y = vincola(cy - h / 2 - dy, h, r.top / s, r.bottom / s)
}
/**
 * Keeps a view from showing much beyond the sheet: at most a small margin, plus the room the panels take on
 * that side (so a place by the edge can still sit beside the panel). A view wider than the sheet is centred.
 */
function vincola(inizio: number, lato: number, primaPannello: number, dopoPannello: number) {
  const margine = 30
  const min = -margine - primaPannello
  const max = LATO - lato + margine + dopoPannello
  return min <= max ? Math.min(Math.max(inizio, min), max) : (min + max) / 2
}
const centro = () => {
  const s = scala.value
  const r = props.riquadro
  return [vista.x + vista.w / 2 + (r.left - r.right) / 2 / s, vista.y + vista.h / 2 + (r.top - r.bottom) / 2 / s]
}

let animazione = 0
function vola(cx: number, cy: number, w: number, durata = 650) {
  cancelAnimationFrame(animazione)
  const ridotto = matchMedia('(prefers-reduced-motion: reduce)').matches
  if (ridotto || durata === 0) return imposta(cx, cy, w)
  const [x0, y0] = centro() as [number, number]
  const w0 = vista.w
  const inizio = performance.now()
  const passo = (t: number) => {
    const k = Math.min((t - inizio) / durata, 1)
    const e = k < 0.5 ? 4 * k * k * k : 1 - (-2 * k + 2) ** 3 / 2
    // Zoom in log space, so it feels even
    imposta(x0 + (cx - x0) * e, y0 + (cy - y0) * e, Math.exp(Math.log(w0) + (Math.log(w) - Math.log(w0)) * e))
    if (k < 1) animazione = requestAnimationFrame(passo)
  }
  animazione = requestAnimationFrame(passo)
}

function adatta(durata = 650) {
  vola(LATO / 2, LATO / 2, larghezzaIntera(), durata)
}
function zoom(fattore: number) {
  const [cx, cy] = centro() as [number, number]
  vola(cx, cy, vista.w / fattore, 300)
}
/** Flies to a place, close enough to read it and its neighbours */
function vaiA(id: string, durata = 650) {
  const l = props.luoghi.find((q) => q.id === id)
  if (!l) return
  // Screen scale (px per map unit) to reach: wide for regions, closer for small places
  const scale: Record<string, number> = { macro: 0.55, regione: 0.95, deserto: 0.95, mare: 1.1, regno: 1.2 }
  const s = scale[l.tipo] ?? (l.livello >= 3 ? 2.4 : 1.5)
  vola(l.x, l.y, Math.min(misure.w / s, larghezzaIntera()), durata)
}
/** Brings a place into the free part of the screen, without zooming, if it is hidden */
function mostra(id: string) {
  const l = props.luoghi.find((q) => q.id === id)
  if (!l || !misure.w) return
  const r = props.riquadro
  const s = scala.value
  const px = (l.x - vista.x) * s
  const py = (l.y - vista.y) * s
  const margine = 40
  if (
    px < r.left + margine ||
    px > misure.w - r.right - margine ||
    py < r.top + margine ||
    py > misure.h - r.bottom - margine
  ) {
    vola(l.x, l.y, vista.w, 450)
  }
}
defineExpose({ vaiA, mostra, adatta, zoom })

// ---------- Pointer: drag, pinch, wheel, click ----------
const svg = ref<SVGSVGElement>()
const puntatori = new Map<number, { x: number; y: number }>()
let partenza: { x: number; y: number; vista: { x: number; y: number; w: number } } | null = null
let mosso = false
let pizzico: { d: number; w: number; cx: number; cy: number } | null = null

/** Map point under a screen point */
function inMappa(clientX: number, clientY: number) {
  const box = contenitore.value!.getBoundingClientRect()
  return [
    vista.x + ((clientX - box.left) / box.width) * vista.w,
    vista.y + ((clientY - box.top) / box.height) * vista.h,
  ]
}
/** Zooms around a screen point, keeping it still */
function zoomSu(clientX: number, clientY: number, w: number) {
  const box = contenitore.value!.getBoundingClientRect()
  const [mx, my] = inMappa(clientX, clientY) as [number, number]
  w = Math.min(Math.max(w, larghezzaMin()), larghezzaIntera() * 1.25)
  const fx = (clientX - box.left) / box.width
  const fy = (clientY - box.top) / box.height
  const h = (w * misure.h) / misure.w
  vista.w = w
  vista.h = h
  vista.x = mx - fx * w
  vista.y = my - fy * h
}

function giu(e: PointerEvent) {
  if (e.button !== 0) return
  cancelAnimationFrame(animazione)
  svg.value?.setPointerCapture(e.pointerId)
  puntatori.set(e.pointerId, { x: e.clientX, y: e.clientY })
  mosso = false
  if (puntatori.size === 1) {
    partenza = { x: e.clientX, y: e.clientY, vista: { x: vista.x, y: vista.y, w: vista.w } }
  } else if (puntatori.size === 2) {
    const [a, b] = [...puntatori.values()] as [{ x: number; y: number }, { x: number; y: number }]
    pizzico = { d: Math.hypot(a.x - b.x, a.y - b.y), w: vista.w, cx: (a.x + b.x) / 2, cy: (a.y + b.y) / 2 }
    mosso = true
  }
}
function sposta(e: PointerEvent) {
  if (!puntatori.has(e.pointerId)) return
  puntatori.set(e.pointerId, { x: e.clientX, y: e.clientY })
  if (puntatori.size === 2 && pizzico) {
    const [a, b] = [...puntatori.values()] as [{ x: number; y: number }, { x: number; y: number }]
    const d = Math.hypot(a.x - b.x, a.y - b.y)
    const cx = (a.x + b.x) / 2
    const cy = (a.y + b.y) / 2
    // Pan with the midpoint, zoom with the distance
    const s = misure.w / vista.w
    vista.x -= (cx - pizzico.cx) / s
    vista.y -= (cy - pizzico.cy) / s
    zoomSu(cx, cy, (pizzico.w * pizzico.d) / Math.max(d, 1))
    pizzico.cx = cx
    pizzico.cy = cy
    pizzico.w = vista.w
    pizzico.d = d
    return
  }
  if (!partenza) return
  const dx = e.clientX - partenza.x
  const dy = e.clientY - partenza.y
  if (!mosso && Math.hypot(dx, dy) < 6) return
  mosso = true
  const s = misure.w / partenza.vista.w
  vista.x = partenza.vista.x - dx / s
  vista.y = partenza.vista.y - dy / s
}
function su(e: PointerEvent) {
  if (!puntatori.has(e.pointerId)) return
  puntatori.delete(e.pointerId)
  if (puntatori.size < 2) pizzico = null
  if (puntatori.size === 1) {
    // Back to one finger: carry on panning from here
    const [p] = [...puntatori.values()] as [{ x: number; y: number }]
    partenza = { x: p.x, y: p.y, vista: { x: vista.x, y: vista.y, w: vista.w } }
    return
  }
  partenza = null
  if (mosso || e.type === 'pointercancel') return
  // A tap: the place under the pointer, or nothing
  const bersaglio = document.elementFromPoint(e.clientX, e.clientY)?.closest<SVGElement>('[data-luogo]')
  emit('seleziona', bersaglio?.dataset.luogo ?? null)
}
function rotella(e: WheelEvent) {
  e.preventDefault()
  cancelAnimationFrame(animazione)
  // Lines (Firefox) and pixels (the rest); pinch on a trackpad arrives as wheel + ctrl
  const delta = e.deltaMode === 1 ? e.deltaY * 16 : e.deltaY
  zoomSu(e.clientX, e.clientY, vista.w * Math.exp(delta * (e.ctrlKey ? 0.01 : 0.0018)))
}
function doppio(e: MouseEvent) {
  const [mx, my] = inMappa(e.clientX, e.clientY) as [number, number]
  vola(mx, my, vista.w / 2, 350)
}
function tasto(e: KeyboardEvent) {
  const passo = vista.w / 8
  const [cx, cy] = centro() as [number, number]
  const azioni: Record<string, () => void> = {
    ArrowLeft: () => vola(cx - passo, cy, vista.w, 200),
    ArrowRight: () => vola(cx + passo, cy, vista.w, 200),
    ArrowUp: () => vola(cx, cy - passo, vista.w, 200),
    ArrowDown: () => vola(cx, cy + passo, vista.w, 200),
    '+': () => zoom(1.6),
    '=': () => zoom(1.6),
    '-': () => zoom(1 / 1.6),
    '0': () => adatta(),
    Escape: () => emit('seleziona', null),
  }
  const azione = azioni[e.key]
  if (azione) {
    e.preventDefault()
    azione()
  }
}

// ---------- Size ----------
let osservatore: ResizeObserver | undefined
onMounted(() => {
  const el = contenitore.value!
  const misura = () => {
    const box = el.getBoundingClientRect()
    if (!box.width || !box.height) return
    const [cx, cy] = pronta.value ? (centro() as [number, number]) : [LATO / 2, LATO / 2]
    const scalaPrima = scala.value
    misure.w = box.width
    misure.h = box.height
    if (!pronta.value) {
      pronta.value = true
      imposta(LATO / 2, LATO / 2, larghezzaIntera())
    } else {
      imposta(cx, cy, misure.w / scalaPrima)
    }
  }
  misura()
  terreno.value = terrenoMappa()
  osservatore = new ResizeObserver(misura)
  osservatore.observe(el)
  // Wheel needs a non-passive listener to stop the page from scrolling
  el.addEventListener('wheel', rotella, { passive: false })
})
onBeforeUnmount(() => {
  osservatore?.disconnect()
  contenitore.value?.removeEventListener('wheel', rotella)
  cancelAnimationFrame(animazione)
})

const f = (n: number) => Math.round(n * 10) / 10
</script>

<template>
  <div
    ref="contenitore"
    class="mappa overflow-hidden select-none"
    :class="[
      `z${gradino}`,
      { 'no-confini': !confini, 'no-insediamenti': !insediamenti, 'no-eventi': !eventi, 'evidenzia-stimati': stimati },
    ]"
    :style="{ '--k': 1 / scala }"
  >
    <svg
      ref="svg"
      class="size-full touch-none outline-none"
      :viewBox="viewBox"
      preserveAspectRatio="xMidYMid meet"
      role="application"
      aria-roledescription="mappa"
      aria-label="Mappa dell’Anello di Fulcron. Trascina per spostarti, rotella o tasti più e meno per ingrandire, frecce per muoverti."
      tabindex="0"
      @pointerdown="giu"
      @pointermove="sposta"
      @pointerup="su"
      @pointercancel="su"
      @dblclick.prevent="doppio"
      @keydown="tasto"
    >
      <defs>
        <pattern id="m-carta" patternUnits="userSpaceOnUse" width="384" height="384">
          <image href="/mappa/carta.webp" width="384" height="384" />
        </pattern>
        <radialGradient id="m-mare" cx="0.5" cy="0.5" r="0.55">
          <stop offset="0" stop-color="#8fb4ba" />
          <stop offset="0.75" stop-color="#a3c3c4" />
          <stop offset="1" stop-color="#b8d1cc" />
        </radialGradient>
        <linearGradient id="m-gelo" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="#f7fafc" stop-opacity="0.95" />
          <stop offset="0.55" stop-color="#eef4f7" stop-opacity="0.55" />
          <stop offset="1" stop-color="#eef4f7" stop-opacity="0" />
        </linearGradient>
        <linearGradient id="m-ovest" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stop-color="#8f8a80" stop-opacity="0.75" />
          <stop offset="0.5" stop-color="#a39d92" stop-opacity="0.35" />
          <stop offset="1" stop-color="#a39d92" stop-opacity="0" />
        </linearGradient>
        <!-- One soft patch of colour per kind of land -->
        <radialGradient v-for="(colore, nome) in MAPPA_COLORI" :id="`m-b-${nome}`" :key="nome">
          <stop offset="0" :stop-color="colore" />
          <stop offset="0.55" :stop-color="colore" stop-opacity="0.7" />
          <stop offset="1" :stop-color="colore" stop-opacity="0" />
        </radialGradient>
        <!-- The traced shapes, drawn several times below -->
        <path id="m-forma-mare" :d="MAPPA_MARE" />
        <g id="m-forma-isole">
          <path v-for="(d, i) in MAPPA_ISOLE" :key="i" :d="d" />
        </g>
        <clipPath id="m-foglio"><rect x="5" y="5" :width="LATO - 10" :height="LATO - 10" /></clipPath>
        <filter id="m-sfuma" x="-5%" y="-5%" width="110%" height="110%">
          <feGaussianBlur stdDeviation="22" />
        </filter>
        <clipPath id="m-acqua"><use href="#m-forma-mare" /></clipPath>

        <!-- Trees: three crowns for broadleaves, two for conifers; colours come from each tree -->
        <g id="m-latifoglia-0">
          <path d="M0 0V-.3" stroke="#4b3a28" stroke-width=".12" />
          <circle cy="-.62" r=".4" style="fill: var(--chioma)" stroke="#33402a" stroke-width=".08" />
          <path d="M.12 -.95A.4 .4 0 0 1 .2 -.27A.42 .42 0 0 0 .12 -.95Z" style="fill: var(--ombra)" />
        </g>
        <g id="m-latifoglia-1">
          <path d="M0 0V-.28" stroke="#4b3a28" stroke-width=".12" />
          <path
            d="M-.42 -.42A.26 .26 0 0 1 -.3 -.8A.3 .3 0 0 1 .18 -.92A.28 .28 0 0 1 .44 -.5A.24 .24 0 0 1 .2 -.26H-.22A.22 .22 0 0 1 -.42 -.42Z"
            style="fill: var(--chioma)"
            stroke="#33402a"
            stroke-width=".08"
          />
          <path d="M.18 -.92A.28 .28 0 0 1 .44 -.5A.24 .24 0 0 1 .2 -.26Q.3 -.6 .18 -.92Z" style="fill: var(--ombra)" />
        </g>
        <g id="m-latifoglia-2">
          <path d="M0 0V-.25" stroke="#4b3a28" stroke-width=".12" />
          <ellipse cy="-.7" rx=".3" ry=".48" style="fill: var(--chioma)" stroke="#33402a" stroke-width=".08" />
          <path d="M.08 -1.17A.3 .48 0 0 1 .1 -.24Q.24 -.7 .08 -1.17Z" style="fill: var(--ombra)" />
        </g>
        <g id="m-conifera-0">
          <path d="M0 0V-.18" stroke="#4b3a28" stroke-width=".12" />
          <path d="M0 -1.2L.3 -.18H-.3Z" style="fill: var(--chioma)" stroke="#33402a" stroke-width=".08" />
          <path d="M0 -1.2L.3 -.18H.05Z" style="fill: var(--ombra)" />
        </g>
        <g id="m-conifera-1">
          <path d="M0 0V-.16" stroke="#4b3a28" stroke-width=".12" />
          <path
            d="M0 -1.15L.24 -.78H.12L.38 -.42H.22L.44 -.16H-.44L-.22 -.42H-.38L-.12 -.78H-.24Z"
            style="fill: var(--chioma)"
            stroke="#33402a"
            stroke-width=".08"
          />
          <path d="M0 -1.15L.24 -.78H.12L.38 -.42H.22L.44 -.16H.06Z" style="fill: var(--ombra)" />
        </g>
        <path id="m-ciuffo" d="M-5 0H5M-3 0L-4 -4M0 0V-5.5M3 0L4 -4" />
        <path id="m-duna" d="M-9 0Q-2 -6 9 0M-2 -3.2Q3 -3.6 9 0" />

        <!-- Place symbols, in screen pixels -->
        <path id="m-capitale" d="M-6 5V-2H-4.6V-5H-2.6V-2H-1V-6.5H1V-2H2.6V-5H4.6V-2H6V5Z" />
        <path id="m-fortezza" d="M-3.6 5V-1.5H-4.8V-5.5H-2.8V-3.8H-1V-5.5H1V-3.8H2.8V-5.5H4.8V-1.5H3.6V5Z" />
      </defs>

      <!-- Land -->
      <rect x="-2000" y="-2000" :width="LATO + 4000" :height="LATO + 4000" class="m-fuori" />
      <g clip-path="url(#m-foglio)">
        <rect :width="LATO" :height="LATO" fill="#ece2c8" />
        <rect :width="LATO" :height="LATO" fill="url(#m-carta)" />
        <!-- The colours of the land: snow to the north, sand to the east, marsh to the south, stone to the west -->
        <ellipse
          v-for="(b, i) in MAPPA_BIOMI"
          :key="`bio${i}`"
          :cx="b.c[0]"
          :cy="b.c[1]"
          :rx="b.r[0]"
          :ry="b.r[1]"
          :fill="`url(#m-b-${b.colore})`"
          class="m-bioma"
          :style="{ '--forza': b.forza }"
        />
        <rect :width="LATO" height="250" fill="url(#m-gelo)" class="m-bioma" />
        <rect width="170" :height="LATO" fill="url(#m-ovest)" class="m-bioma" />
        <path v-if="terreno" :d="terreno.crepe" class="m-crepe" />

        <!-- Forests under everything else -->
        <g v-if="terreno">
          <path v-for="(b, i) in terreno.boschi" :key="`b${i}`" :d="b.d" :class="`m-bosco m-bosco-${b.tipo}`" />
        </g>

        <!-- Sea, with ripples along the coasts -->
        <use href="#m-forma-mare" fill="url(#m-mare)" />
        <g clip-path="url(#m-acqua)" class="m-onde">
          <use href="#m-forma-mare" stroke-width="30" />
          <use href="#m-forma-mare" stroke-width="27" class="m-onde-mare" />
          <use href="#m-forma-mare" stroke-width="15" />
          <use href="#m-forma-mare" stroke-width="12.5" class="m-onde-mare" />
          <use href="#m-forma-isole" stroke-width="12" />
          <use href="#m-forma-isole" stroke-width="10" class="m-onde-mare" />
        </g>
        <!-- Each sea its own shade, blurred so the seas fade into one another -->
        <g clip-path="url(#m-acqua)" filter="url(#m-sfuma)">
          <path
            v-for="(d, id) in MAPPA_MARI"
            :key="`t${id}`"
            :d="d"
            :fill="MAPPA_TINTE_MARI[id]?.[0] ?? 'none'"
            :fill-opacity="MAPPA_TINTE_MARI[id]?.[1] ?? 0"
            class="m-tinta"
          />
        </g>
        <!-- The seas: they light up under the pointer -->
        <g class="m-mari">
          <path
            v-for="(d, id) in MAPPA_MARI"
            :key="id"
            :d="d"
            :data-luogo="id"
            :class="{ attivo: selezionato === id }"
          />
        </g>
        <path :d="MAPPA_CONFINI_MARI" class="m-confine-mare m-strato-confini" />
        <use href="#m-forma-mare" class="m-costa" />
        <use href="#m-forma-isole" class="m-isola" />
        <path v-for="(d, i) in MAPPA_LAGHI" :key="`l${i}`" :d="d" class="m-lago" />

        <!-- Rivers -->
        <path v-for="(d, i) in MAPPA_FIUMI" :key="`f${i}`" :d="d" class="m-fiume" />

        <!-- Marsh, dunes, trees, mountains -->
        <g v-if="terreno">
          <use
            v-for="(c, i) in terreno.ciuffi"
            :key="`c${i}`"
            href="#m-ciuffo"
            class="m-ciuffo"
            :transform="`translate(${f(c.x)} ${f(c.y)}) scale(${f(c.s)})`"
          />
          <use
            v-for="(c, i) in terreno.dune"
            :key="`d${i}`"
            href="#m-duna"
            class="m-duna"
            :transform="`translate(${f(c.x)} ${f(c.y)}) scale(${f(c.s)})`"
          />
          <use
            v-for="(a, i) in terreno.alberi"
            :key="`a${i}`"
            :href="`#m-${a.tipo === 'conifere' ? 'conifera' : 'latifoglia'}-${a.v}`"
            :transform="`translate(${f(a.x)} ${f(a.y)}) scale(${f(a.s)})`"
            :style="{ '--chioma': a.chioma, '--ombra': a.ombra }"
          />
          <!-- A band of colour under each range, then every mountain drawn on its own -->
          <path
            v-for="(b, i) in terreno.basi"
            :key="`bs${i}`"
            :d="b.d"
            class="m-base"
            :style="{ strokeWidth: b.largo * 1.5 }"
          />
          <g v-for="(m, i) in terreno.montagne" :key="`m${i}`">
            <path :d="m.corpo" class="m-roccia" />
            <path :d="m.ombra" class="m-ombra" />
            <path v-if="m.neve" :d="m.neve" class="m-neve" />
            <path :d="m.linee" class="m-tratto" />
          </g>
        </g>

        <!-- Borders and the Wall -->
        <g class="m-strato-confini">
          <path v-for="(d, i) in MAPPA_CONFINI_REGNI" :key="`r${i}`" :d="d" class="m-confine-regno" />
          <path v-for="(d, i) in MAPPA_CONFINI_MACRO" :key="`x${i}`" :d="d" class="m-confine-macro" />
        </g>
        <path :d="MAPPA_MURAGLIA" class="m-muraglia" />
        <path :d="MAPPA_MURAGLIA" class="m-muraglia-merli" />
      </g>

      <!-- Frame and compass rose -->
      <rect x="5" y="5" :width="LATO - 10" :height="LATO - 10" class="m-cornice" />
      <rect x="13" y="13" :width="LATO - 26" :height="LATO - 26" class="m-cornice m-cornice-sottile" />
      <g class="m-rosa" transform="translate(1192 100)">
        <circle r="44" class="m-rosa-cerchio" />
        <circle r="36" class="m-rosa-cerchio" />
        <path d="M0 -58L7 -7L0 0ZM0 58L-7 7L0 0ZM58 0L7 7L0 0ZM-58 0L-7 -7L0 0Z" class="m-rosa-scura" />
        <path d="M0 -58L-7 -7L0 0ZM0 58L7 7L0 0ZM58 0L7 -7L0 0ZM-58 0L-7 7L0 0Z" class="m-rosa-chiara" />
        <path
          d="M28 -28L4 -4L0 0ZM-28 28L-4 4L0 0ZM28 28L4 4L0 0ZM-28 -28L-4 -4L0 0Z"
          class="m-rosa-scura"
          transform="scale(.8)"
        />
        <text y="-64" class="m-rosa-n">N</text>
      </g>

      <!-- Painted names -->
      <g class="m-nomi">
        <text
          v-for="n in nomi"
          :key="n.id"
          :data-luogo="n.id"
          :x="n.x"
          :y="n.y"
          :transform="n.ruota ? `rotate(${n.ruota} ${n.x} ${n.y})` : undefined"
          :class="[n.classe, `da${n.da}`, { attivo: selezionato === n.id, stimato: n.stimato }]"
          :style="{ fontSize: `${n.fs}px` }"
        >
          <template v-if="n.righe.length === 1">{{ n.righe[0] }}</template>
          <tspan
            v-for="(riga, i) in n.righe"
            v-else
            :key="i"
            :x="n.x"
            :dy="i === 0 ? `${-(n.righe.length - 1) * 0.55}em` : '1.1em'"
          >
            {{ riga }}
          </tspan>
        </text>
      </g>

      <!-- Places: symbol and name at a fixed size on screen -->
      <g class="m-luoghi">
        <g
          v-for="l in marcatori"
          :key="l.id"
          :data-luogo="l.id"
          class="m-luogo"
          :class="[`t-${l.tipo}`, `liv${Math.min(l.livello, 3)}`, { attivo: selezionato === l.id, stimato: l.stimato }]"
          :style="{ '--x': `${l.x}px`, '--y': `${l.y}px` }"
        >
          <circle r="13" class="m-tocco" />
          <circle v-if="l.stimato" r="9" class="m-anello-stimato" />
          <circle r="11" class="m-selezione" />
          <use v-if="l.tipo === 'capitale'" href="#m-capitale" class="m-simbolo" />
          <use v-else-if="l.tipo === 'fortezza'" href="#m-fortezza" class="m-simbolo" />
          <rect
            v-else-if="l.tipo === 'luogo'"
            x="-3.6"
            y="-3.6"
            width="7.2"
            height="7.2"
            transform="rotate(45)"
            class="m-simbolo m-simbolo-luogo"
          />
          <path
            v-else-if="l.tipo === 'evento'"
            d="M-5 -5L5 5M5 -5L-5 5M-5 -1.5L-1.5 -5M5 -1.5L1.5 -5"
            class="m-simbolo-evento"
          />
          <g v-else-if="l.tipo === 'citta'">
            <circle r="4.2" class="m-simbolo-citta" />
            <circle r="1.7" class="m-simbolo" />
          </g>
          <circle v-else r="2.6" class="m-simbolo m-simbolo-borgo" />
          <text v-if="l.lato === 'sinistra'" x="-9" y="4.5" class="m-etichetta" text-anchor="end">{{ l.nome }}</text>
          <text v-else x="9" y="4.5" class="m-etichetta">{{ l.nome }}</text>
        </g>
      </g>
    </svg>
  </div>
</template>

<style scoped>
.mappa {
  background: #12232b;
  cursor: grab;
}
.mappa:active {
  cursor: grabbing;
}
svg:focus-visible {
  outline: 3px solid var(--color-gold-soft);
  outline-offset: -3px;
}

/* ---------- Terrain ---------- */
.m-fuori {
  fill: #12232b;
}
.mappa {
  /* Strength of the land colours: 1 as drawn, lower for a paler map */
  --intensita: 1;
}
.m-bioma {
  opacity: calc(var(--forza, 1) * var(--intensita));
  pointer-events: none;
}
.m-crepe {
  fill: none;
  stroke: #8fa6b4;
  stroke-width: 0.8;
  stroke-linecap: round;
  stroke-linejoin: round;
  opacity: 0.7;
}
.m-tinta {
  pointer-events: none;
}
.m-base {
  fill: none;
  stroke: #b39a72;
  stroke-opacity: 0.14;
  stroke-linecap: round;
  stroke-linejoin: round;
  pointer-events: none;
}
.m-roccia {
  fill: #eee2c5;
}
.m-ombra {
  fill: #ae9670;
}
.m-neve {
  fill: #f9fbfc;
}
.m-tratto {
  fill: none;
  stroke: #3e3022;
  stroke-width: 0.85;
  stroke-linecap: round;
  stroke-linejoin: round;
}
.m-bosco {
  fill: #8ea267;
  opacity: 0.32;
}
.m-bosco-conifere {
  fill: #6d8a6b;
}
.m-bosco-cerulea {
  fill: #7fa9b5;
}
.m-onde use {
  fill: none;
  stroke: #d7e6e1;
  stroke-opacity: 0.75;
  stroke-linejoin: round;
}
.m-onde .m-onde-mare {
  stroke: #a6c4c4;
  stroke-opacity: 1;
}
.m-mari path {
  fill: #fff;
  fill-opacity: 0;
  transition: fill-opacity 0.2s;
  cursor: pointer;
}
.m-mari path:hover {
  fill-opacity: 0.12;
}
.m-mari path.attivo {
  fill: #f6e7b8;
  fill-opacity: 0.22;
}
.m-confine-mare {
  fill: none;
  stroke: #4b7480;
  stroke-opacity: 0.45;
  stroke-width: 0.9;
  stroke-dasharray: 1 4;
  stroke-linecap: round;
  pointer-events: none;
}
.m-costa {
  fill: none;
  stroke: #3d4f55;
  stroke-width: 1.6;
  stroke-linejoin: round;
  pointer-events: none;
}
.m-isola {
  fill: #e9dfc2;
  stroke: #3d4f55;
  stroke-width: 1.1;
  stroke-linejoin: round;
}
.m-lago {
  fill: #a3c3c4;
  stroke: #3d4f55;
  stroke-width: 1;
}
.m-fiume {
  fill: none;
  stroke: #5f8f9c;
  stroke-width: 1.6;
  stroke-linecap: round;
}
.m-ciuffo {
  fill: none;
  stroke: #56633f;
  stroke-width: 0.9;
  stroke-linecap: round;
  opacity: 0.75;
}
.m-duna {
  fill: none;
  stroke: #a07b3c;
  stroke-width: 0.9;
  stroke-linecap: round;
  opacity: 0.7;
}
.m-confine-macro {
  fill: none;
  stroke: #9a3a2a;
  stroke-opacity: 0.6;
  stroke-width: 2.4;
  stroke-dasharray: 0.1 6;
  stroke-linecap: round;
}
.m-confine-regno {
  fill: none;
  stroke: #5a4a36;
  stroke-opacity: 0.5;
  stroke-width: 0.9;
  stroke-dasharray: 5 3;
}
.no-confini .m-strato-confini {
  display: none;
}
.m-muraglia {
  fill: none;
  stroke: #3e3022;
  stroke-width: 4.5;
  stroke-linecap: round;
}
.m-muraglia-merli {
  fill: none;
  stroke: #cdbd98;
  stroke-width: 2;
  stroke-dasharray: 3 3;
}
.m-cornice {
  fill: none;
  stroke: #3e3022;
  stroke-width: 3;
}
.m-cornice-sottile {
  stroke-width: 1;
}
.m-rosa-cerchio {
  fill: none;
  stroke: #3e3022;
  stroke-width: 0.8;
}
.m-rosa-scura {
  fill: #3e3022;
}
.m-rosa-chiara {
  fill: #efe5cc;
  stroke: #3e3022;
  stroke-width: 0.8;
}
.m-rosa-n {
  font-family: var(--font-display);
  font-size: 16px;
  text-anchor: middle;
  fill: #3e3022;
}

/* ---------- Painted names ---------- */
.m-nomi text {
  text-anchor: middle;
  dominant-baseline: middle;
  paint-order: stroke;
  stroke: #efe5cc;
  stroke-width: 0.22em;
  stroke-linejoin: round;
  cursor: pointer;
  transition: fill 0.2s;
}
.m-nomi text:hover,
.m-nomi text.attivo {
  fill: #8a5a12;
}
.n-macro {
  font-family: var(--font-display);
  letter-spacing: 0.35em;
  fill: #4a3b2c;
  fill-opacity: 0.6;
  stroke-opacity: 0.5;
}
.n-regione {
  font-family: var(--font-display);
  letter-spacing: 0.2em;
  fill: #8a3527;
}
.n-regno {
  font-family: var(--font-display);
  letter-spacing: 0.14em;
  fill: #3e3022;
}
.n-mare-interno {
  letter-spacing: 0.5em;
  fill-opacity: 0.85;
}
.n-mare {
  font-family: var(--font-heading);
  font-style: italic;
  letter-spacing: 0.16em;
  fill: #2f5966;
  stroke: #a9c6c6;
}
.n-isola {
  font-family: var(--font-heading);
  letter-spacing: 0.06em;
  fill: #2c2a22;
}
.n-foresta {
  font-family: var(--font-heading);
  font-style: italic;
  fill: #34502c;
}
.n-monti {
  font-family: var(--font-heading);
  font-style: italic;
  fill: #5a4126;
}
.n-acqua {
  font-family: var(--font-heading);
  font-style: italic;
  fill: #2f5966;
}
.m-nomi text.stimato {
  font-style: italic;
}
/* Names appear from their zoom step: .daN is shown from .zN up */
.z3 .n-vasto,
.z4 .n-vasto {
  display: none;
}
.z0 .da1,
.z0 .da2,
.z0 .da3,
.z0 .da4,
.z1 .da2,
.z1 .da3,
.z1 .da4,
.z2 .da3,
.z2 .da4,
.z3 .da4 {
  display: none;
}

/* ---------- Places ---------- */
.m-luogo {
  transform: translate(var(--x), var(--y)) scale(var(--k));
  cursor: pointer;
}
.m-tocco {
  fill: transparent;
}
.m-simbolo {
  fill: #2b2118;
  stroke: #efe5cc;
  stroke-width: 1.2;
  paint-order: stroke;
}
.m-simbolo-luogo {
  fill: #7a3326;
}
.m-simbolo-citta {
  fill: #efe5cc;
  stroke: #2b2118;
  stroke-width: 1.6;
}
.m-simbolo-evento {
  fill: none;
  stroke: #8a2b1e;
  stroke-width: 2;
  stroke-linecap: round;
}
.m-etichetta {
  font-family: var(--font-heading);
  font-size: 12.5px;
  fill: #241a12;
  paint-order: stroke;
  stroke: #efe5cc;
  stroke-width: 3.4px;
  stroke-linejoin: round;
}
.t-capitale .m-etichetta {
  font-family: var(--font-display);
  font-size: 13.5px;
}
.t-evento .m-etichetta {
  fill: #7a2418;
  font-style: italic;
}
.liv1 .m-etichetta {
  font-size: 14px;
}
.m-selezione {
  fill: none;
  stroke: #b8913f;
  stroke-width: 2.5;
  opacity: 0;
}
.m-luogo.attivo .m-selezione {
  opacity: 1;
  animation: impulso 1.6s ease-in-out infinite;
}
.m-luogo.attivo .m-etichetta,
.m-luogo:hover .m-etichetta {
  fill: #7d4f0c;
}
@keyframes impulso {
  50% {
    stroke-width: 5;
    stroke-opacity: 0.5;
  }
}
@media (prefers-reduced-motion: reduce) {
  .m-luogo.attivo .m-selezione {
    animation: none;
  }
}
.m-anello-stimato {
  fill: none;
  stroke: #8a3527;
  stroke-width: 1.4;
  stroke-dasharray: 2.5 2.5;
  display: none;
}
.evidenzia-stimati .m-anello-stimato {
  display: inline;
}
/* Smaller places appear while zooming in: level 2 from step 1, level 3 from step 3 */
.z0 .liv2,
.z0 .liv3,
.z1 .liv3,
.z2 .liv3 {
  display: none;
}
/* …unless selected */
.m-luogo.attivo {
  display: inline !important;
}
.no-insediamenti .m-luogo:not(.t-evento) {
  display: none;
}
.no-eventi .t-evento {
  display: none;
}
</style>
