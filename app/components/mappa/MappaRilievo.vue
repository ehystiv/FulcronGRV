<script setup lang="ts">
// 3D view of the Ring, like a relief model on a table: the drawn map (public/mappa/rilievo.webp, made by
// `npm run mappa:anteprima`) laid over the heights of utils/mappaRilievo.ts. Drag to move, two fingers or the right
// button to turn and tilt, wheel or pinch to come closer. The main names float over the model and open the same
// card as the flat map. This component (and three.js with it) is only downloaded when someone opens the 3D view.
import {
  ACESFilmicToneMapping,
  BufferAttribute,
  BufferGeometry,
  Color,
  DirectionalLight,
  HemisphereLight,
  Mesh,
  MeshStandardMaterial,
  DoubleSide,
  PCFShadowMap,
  PerspectiveCamera,
  PlaneGeometry,
  Raycaster,
  SRGBColorSpace,
  Scene,
  TextureLoader,
  Vector2,
  Vector3,
  WebGLRenderer,
  type Texture,
} from 'three'
import { MapControls } from 'three/examples/jsm/controls/MapControls.js'
import type { LuogoMappa, Riquadro } from './MappaAnello.vue'

const props = withDefaults(
  defineProps<{
    luoghi: LuogoMappa[]
    selezionato?: string | null
    insediamenti?: boolean
    riquadro?: Riquadro
  }>(),
  { selezionato: null, insediamenti: true, riquadro: () => ({ top: 0, right: 0, bottom: 0, left: 0 }) },
)
const emit = defineEmits<{ seleziona: [id: string | null] }>()

const LATO = MAPPA_LATO
const META = LATO / 2
const MARCATORI = new Set(['capitale', 'citta', 'borgo', 'fortezza', 'luogo', 'evento'])

const contenitore = ref<HTMLDivElement>()
const stato = ref<'carica' | 'pronta' | 'errore'>('carica')

// Names over the model: the four lands and the sea, the main regions and places, and the selected one.
// When two would overlap, the one earlier in this order wins: selected, lands, regions, capitals, the rest
const PRIORITA: Record<string, number> = { macro: 1, regione: 2, deserto: 2, capitale: 3, citta: 4, fortezza: 4 }
const etichette = computed(() =>
  props.luoghi
    .filter(
      (l) =>
        l.id === props.selezionato ||
        (l.livello <= 1 && (props.insediamenti || !MARCATORI.has(l.tipo)) && l.tipo !== 'evento'),
    )
    // The Mare Interno is named in the middle of the sea, not by its northern shore as on the flat map
    .map((l) => (l.id === 'mare-interno' ? { ...l, x: 640, y: 720 } : l))
    .sort(
      (a, b) =>
        Number(b.id === props.selezionato) - Number(a.id === props.selezionato) ||
        (PRIORITA[a.tipo] ?? 5) - (PRIORITA[b.tipo] ?? 5),
    ),
)
const elementi = new Map<string, HTMLElement>()
function registra(id: string, el: unknown) {
  if (el instanceof HTMLElement) elementi.set(id, el)
  else elementi.delete(id)
}

let renderer: WebGLRenderer | undefined
let scena: Scene | undefined
let camera: PerspectiveCamera | undefined
let controlli: MapControls | undefined
let terreno: Mesh | undefined
let rilievo: Rilievo | undefined
let osservatore: ResizeObserver | undefined
let animazione = 0
const daLiberare: { dispose(): void }[] = []

/** Height of the model at a map point (bilinear on the grid) */
function quota(x: number, y: number) {
  if (!rilievo) return 0
  const n = rilievo.lato - 1
  const gx = Math.min(Math.max((x / LATO) * n, 0), n)
  const gy = Math.min(Math.max((y / LATO) * n, 0), n)
  const x0 = Math.floor(gx)
  const y0 = Math.floor(gy)
  const x1 = Math.min(x0 + 1, n)
  const y1 = Math.min(y0 + 1, n)
  const q = (ix: number, iy: number) => rilievo!.quote[iy * rilievo!.lato + ix]!
  const a = q(x0, y0) + (q(x1, y0) - q(x0, y0)) * (gx - x0)
  const b = q(x0, y1) + (q(x1, y1) - q(x0, y1)) * (gx - x0)
  return Math.max(a + (b - a) * (gy - y0), 0)
}
/** Map point → 3D point: x to the east, y up, z to the south, the centre of the Ring at the origin */
const nelloSpazio = (x: number, y: number, su = 0) => new Vector3(x - META, quota(x, y) + su, y - META)

// ---------- Drawing ----------
let richiesta = 0
function disegna() {
  if (richiesta) return
  richiesta = requestAnimationFrame(() => {
    richiesta = 0
    if (!renderer || !scena || !camera) return
    renderer.render(scena, camera)
    aggiornaEtichette()
  })
}

const v = new Vector3()
function aggiornaEtichette() {
  if (!camera || !contenitore.value) return
  const w = contenitore.value.clientWidth
  const h = contenitore.value.clientHeight
  const occupati: [number, number, number, number][] = []
  for (const l of etichette.value) {
    const el = elementi.get(l.id)
    if (!el) continue
    v.copy(nelloSpazio(l.x, l.y, MARCATORI.has(l.tipo) ? 2 : 10)).project(camera)
    const sx = ((v.x + 1) / 2) * w
    const sy = ((1 - v.y) / 2) * h
    // The box the name takes on screen: names of places start at the point, the others are centred on it
    const lw = el.offsetWidth
    const lh = el.offsetHeight
    const x0 = MARCATORI.has(l.tipo) ? sx - 4 : sx - lw / 2
    const box: [number, number, number, number] = [x0 - 3, sy - lh / 2 - 2, x0 + lw + 3, sy + lh / 2 + 2]
    const fuori = v.z > 1 || v.x < -1.1 || v.x > 1.1 || v.y < -1.1 || v.y > 1.1
    const coperto = occupati.some((o) => box[0] < o[2] && box[2] > o[0] && box[1] < o[3] && box[3] > o[1])
    el.style.visibility = fuori || coperto ? 'hidden' : 'visible'
    if (fuori || coperto) continue
    occupati.push(box)
    el.style.transform = `translate(${sx}px, ${sy}px)`
  }
}
watch(etichette, () => nextTick(disegna))

// ---------- Panels: keep the centre of the view in the free part of the screen ----------
function dimensiona() {
  if (!renderer || !camera || !contenitore.value) return
  const w = contenitore.value.clientWidth
  const h = contenitore.value.clientHeight
  if (!w || !h) return
  renderer.setSize(w, h, false)
  camera.aspect = w / h
  const r = props.riquadro
  camera.setViewOffset(w, h, (r.right - r.left) / 2, (r.bottom - r.top) / 2, w, h)
  camera.updateProjectionMatrix()
  disegna()
}
watch(() => props.riquadro, dimensiona, { deep: true })

// ---------- Flights ----------
const VISTA_INIZIALE = { bersaglio: new Vector3(0, 0, 70), posizione: new Vector3(0, 1180, 1330) }
function vola(bersaglio: Vector3, posizione: Vector3, durata = 800) {
  if (!camera || !controlli) return
  cancelAnimationFrame(animazione)
  const t0 = bersaglio.clone()
  const p0 = posizione.clone()
  const t1 = controlli.target.clone()
  const p1 = camera.position.clone()
  if (durata === 0 || matchMedia('(prefers-reduced-motion: reduce)').matches) {
    controlli.target.copy(t0)
    camera.position.copy(p0)
    controlli.update()
    return disegna()
  }
  const inizio = performance.now()
  const passo = (t: number) => {
    const k = Math.min((t - inizio) / durata, 1)
    const e = k < 0.5 ? 4 * k * k * k : 1 - (-2 * k + 2) ** 3 / 2
    controlli!.target.lerpVectors(t1, t0, e)
    camera!.position.lerpVectors(p1, p0, e)
    controlli!.update()
    disegna()
    if (k < 1) animazione = requestAnimationFrame(passo)
  }
  animazione = requestAnimationFrame(passo)
}
/** The starting view, farther back on tall narrow screens (phones held upright) so the whole Ring fits */
function vistaIntera() {
  const el = contenitore.value
  const forma = el && el.clientHeight ? el.clientWidth / el.clientHeight : 1.6
  const lontano = Math.max(1, 1.45 / forma)
  const verso = VISTA_INIZIALE.posizione.clone().sub(VISTA_INIZIALE.bersaglio).multiplyScalar(lontano)
  return { bersaglio: VISTA_INIZIALE.bersaglio.clone(), posizione: VISTA_INIZIALE.bersaglio.clone().add(verso) }
}
function adatta(durata = 800) {
  const { bersaglio, posizione } = vistaIntera()
  vola(bersaglio, posizione, durata)
}
function zoom(fattore: number) {
  if (!camera || !controlli) return
  const verso = camera.position.clone().sub(controlli.target).divideScalar(fattore)
  vola(controlli.target.clone(), controlli.target.clone().add(verso), 350)
}
/** Flies to a place keeping the current direction of view, closer for small places */
function vaiA(id: string, durata = 800) {
  const l = props.luoghi.find((q) => q.id === id)
  if (!l || !camera || !controlli) return
  const distanze: Record<string, number> = { macro: 1250, regione: 760, deserto: 760, mare: 620, regno: 560 }
  const distanza = distanze[l.tipo] ?? (l.livello >= 3 ? 320 : 480)
  const bersaglio = nelloSpazio(l.x, l.y)
  const verso = camera.position.clone().sub(controlli.target).normalize()
  vola(bersaglio, bersaglio.clone().add(verso.multiplyScalar(distanza)), durata)
}
defineExpose({ vaiA, adatta, zoom, mostra: () => {} })

// ---------- Tapping the model: the nearest place, or nothing ----------
let giu: { x: number; y: number } | null = null
const raggio = new Raycaster()
function premuto(e: PointerEvent) {
  giu = { x: e.clientX, y: e.clientY }
}
function rilasciato(e: PointerEvent) {
  if (!giu || Math.hypot(e.clientX - giu.x, e.clientY - giu.y) > 6) return (giu = null)
  giu = null
  if (!camera || !terreno || !contenitore.value) return
  const box = contenitore.value.getBoundingClientRect()
  raggio.setFromCamera(
    new Vector2(((e.clientX - box.left) / box.width) * 2 - 1, -((e.clientY - box.top) / box.height) * 2 + 1),
    camera,
  )
  const colpo = raggio.intersectObject(terreno)[0]
  if (!colpo) return emit('seleziona', null)
  const x = colpo.point.x + META
  const y = colpo.point.z + META
  // The nearest place within reach, if any (reach grows when the camera is far)
  const portata = Math.max(12, camera.position.distanceTo(colpo.point) / 40)
  let migliore: LuogoMappa | null = null
  let d = portata
  for (const l of props.luoghi) {
    if (!MARCATORI.has(l.tipo)) continue
    const dl = Math.hypot(l.x - x, l.y - y)
    if (dl < d) [d, migliore] = [dl, l]
  }
  emit('seleziona', migliore?.id ?? null)
}

// ---------- Building the model ----------
function costruisci() {
  const el = contenitore.value!
  try {
    renderer = new WebGLRenderer({ antialias: true })
  } catch {
    stato.value = 'errore'
    return
  }
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2))
  renderer.outputColorSpace = SRGBColorSpace
  renderer.toneMapping = ACESFilmicToneMapping
  renderer.toneMappingExposure = 1.05
  renderer.shadowMap.enabled = true
  renderer.shadowMap.type = PCFShadowMap
  renderer.domElement.className = 'absolute inset-0 size-full touch-none outline-none'
  renderer.domElement.setAttribute('role', 'img')
  renderer.domElement.setAttribute('aria-label', 'L’Anello di Fulcron in rilievo')
  el.prepend(renderer.domElement)

  scena = new Scene()
  scena.background = new Color('#12232b')

  // The land: one vertex per point of the height grid
  rilievo = rilievoMappa()
  const n = rilievo.lato
  const posizioni = new Float32Array(n * n * 3)
  const uv = new Float32Array(n * n * 2)
  for (let iy = 0; iy < n; iy++) {
    for (let ix = 0; ix < n; ix++) {
      const i = iy * n + ix
      posizioni.set([(ix / (n - 1)) * LATO - META, rilievo.quote[i]!, (iy / (n - 1)) * LATO - META], i * 3)
      uv.set([ix / (n - 1), 1 - iy / (n - 1)], i * 2)
    }
  }
  const indici = new Uint32Array((n - 1) * (n - 1) * 6)
  let k = 0
  for (let iy = 0; iy < n - 1; iy++) {
    for (let ix = 0; ix < n - 1; ix++) {
      const a = iy * n + ix
      indici.set([a, a + n, a + 1, a + 1, a + n, a + n + 1], k)
      k += 6
    }
  }
  const forma = new BufferGeometry()
  forma.setAttribute('position', new BufferAttribute(posizioni, 3))
  forma.setAttribute('uv', new BufferAttribute(uv, 2))
  forma.setIndex(new BufferAttribute(indici, 1))
  forma.computeVertexNormals()
  const pelle = new MeshStandardMaterial({ color: '#e6dbbf', roughness: 0.95, metalness: 0 })
  terreno = new Mesh(forma, pelle)
  terreno.castShadow = true
  terreno.receiveShadow = true
  scena.add(terreno)
  daLiberare.push(forma, pelle)

  // The sides of the model, down to the table, so it reads as a block
  const BASE = -34
  const lati: number[] = []
  const bordo = (ix: number, iy: number) => [
    (ix / (n - 1)) * LATO - META,
    rilievo!.quote[iy * n + ix]!,
    (iy / (n - 1)) * LATO - META,
  ]
  const giro: [number, number][] = []
  for (let i = 0; i < n; i++) giro.push([i, 0])
  for (let i = 1; i < n; i++) giro.push([n - 1, i])
  for (let i = n - 2; i >= 0; i--) giro.push([i, n - 1])
  for (let i = n - 2; i >= 0; i--) giro.push([0, i])
  for (let i = 0; i < giro.length - 1; i++) {
    const [ax, ay, az] = bordo(...giro[i]!)
    const [bx, by, bz] = bordo(...giro[i + 1]!)
    lati.push(ax!, ay!, az!, ax!, BASE, az!, bx!, by!, bz!, bx!, by!, bz!, ax!, BASE, az!, bx!, BASE, bz!)
  }
  const formaLati = new BufferGeometry()
  formaLati.setAttribute('position', new BufferAttribute(new Float32Array(lati), 3))
  formaLati.computeVertexNormals()
  const legno = new MeshStandardMaterial({ color: '#5b4632', roughness: 0.9, side: DoubleSide })
  scena.add(new Mesh(formaLati, legno))
  daLiberare.push(formaLati, legno)

  // The surface of the sea, a little transparent, so the sea floor shows through
  const acqua = new PlaneGeometry(LATO, LATO)
  acqua.rotateX(-Math.PI / 2)
  const vetro = new MeshStandardMaterial({ color: '#7fa9b4', transparent: true, opacity: 0.38, roughness: 0.25 })
  const mare = new Mesh(acqua, vetro)
  mare.position.y = 0.4
  mare.receiveShadow = true
  scena.add(mare)
  daLiberare.push(acqua, vetro)

  // Light from the north-west, as on old relief maps
  scena.add(new HemisphereLight('#fff7e8', '#6b5a45', 1.4))
  const sole = new DirectionalLight('#fff1d6', 2.4)
  sole.position.set(-620, 760, -420)
  sole.castShadow = true
  sole.shadow.mapSize.set(2048, 2048)
  Object.assign(sole.shadow.camera, { left: -760, right: 760, top: 760, bottom: -760, near: 10, far: 2600 })
  sole.shadow.bias = -0.0006
  sole.shadow.normalBias = 1.2
  scena.add(sole)

  new TextureLoader().load('/mappa/rilievo.webp', (t: Texture) => {
    t.colorSpace = SRGBColorSpace
    t.anisotropy = renderer!.capabilities.getMaxAnisotropy()
    pelle.map = t
    pelle.color.set('#ffffff')
    pelle.needsUpdate = true
    daLiberare.push(t)
    disegna()
  })

  camera = new PerspectiveCamera(38, 1, 5, 7000)
  camera.position.copy(VISTA_INIZIALE.posizione)
  controlli = new MapControls(camera, renderer.domElement)
  controlli.target.copy(VISTA_INIZIALE.bersaglio)
  controlli.maxPolarAngle = 1.22
  controlli.minDistance = 120
  controlli.maxDistance = 3600
  controlli.zoomToCursor = true
  controlli.addEventListener('change', () => {
    // Stay over the model
    const t = controlli!.target
    const fuori = new Vector3(
      Math.min(Math.max(t.x, -META), META) - t.x,
      -t.y,
      Math.min(Math.max(t.z, -META), META) - t.z,
    )
    if (fuori.lengthSq() > 0.01) {
      t.add(fuori)
      camera!.position.add(fuori)
    }
    disegna()
  })
  controlli.update()
  renderer.domElement.addEventListener('pointerdown', premuto)
  renderer.domElement.addEventListener('pointerup', rilasciato)

  dimensiona()
  osservatore = new ResizeObserver(dimensiona)
  osservatore.observe(el)
  stato.value = 'pronta'
  adatta(0)
  if (props.selezionato) vaiA(props.selezionato, 0)
}

onMounted(() => {
  // Let the "loading" message show before the heights are worked out
  setTimeout(costruisci, 30)
})
onBeforeUnmount(() => {
  cancelAnimationFrame(animazione)
  cancelAnimationFrame(richiesta)
  osservatore?.disconnect()
  controlli?.dispose()
  for (const d of daLiberare) d.dispose()
  renderer?.dispose()
  renderer?.domElement.remove()
})
</script>

<template>
  <div ref="contenitore" class="rilievo overflow-hidden select-none" @keydown.esc="emit('seleziona', null)">
    <div class="pointer-events-none absolute inset-0" aria-label="Luoghi principali" role="group">
      <button
        v-for="l in etichette"
        :key="l.id"
        :ref="(el) => registra(l.id, el)"
        type="button"
        class="r-etichetta pointer-events-auto"
        :class="[`r-${l.tipo}`, { attivo: l.id === selezionato }]"
        @click="emit('seleziona', l.id)"
      >
        <span v-if="MARCATORI.has(l.tipo)" class="r-punto" aria-hidden="true" />
        {{ l.nome }}
      </button>
    </div>
    <p
      v-if="stato === 'carica'"
      class="absolute inset-0 grid place-items-center font-heading text-lg text-on-dark"
      role="status"
    >
      Preparo il rilievo…
    </p>
    <div
      v-else-if="stato === 'errore'"
      class="absolute inset-0 grid place-items-center p-6 text-center text-on-dark"
      role="alert"
    >
      <p class="max-w-sm">
        Questo dispositivo non riesce a mostrare la vista in 3D. La mappa piatta funziona comunque: torna alla vista 2D.
      </p>
    </div>
  </div>
</template>

<style scoped>
.rilievo {
  background: #12232b;
}
.r-etichetta {
  position: absolute;
  top: 0;
  left: 0;
  margin: -0.5em 0 0 -4px;
  display: flex;
  align-items: center;
  gap: 5px;
  white-space: nowrap;
  font-family: var(--font-heading);
  font-size: 13.5px;
  line-height: 1;
  color: #241a12;
  text-shadow:
    0 0 3px #efe5cc,
    0 0 3px #efe5cc,
    0 0 6px #efe5cc;
  cursor: pointer;
  will-change: transform;
}
.r-etichetta:hover,
.r-etichetta.attivo {
  color: #7d4f0c;
}
.r-etichetta:focus-visible {
  outline: 2px solid var(--color-gold);
  outline-offset: 2px;
}
.r-punto {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #efe5cc;
  border: 2px solid #2b2118;
  flex: none;
}
.attivo .r-punto {
  background: var(--color-gold);
  box-shadow: 0 0 0 4px rgb(184 145 63 / 0.4);
}
.r-capitale {
  font-family: var(--font-display);
}
/* Names of lands, regions and seas: centred on their point, no dot */
.r-macro,
.r-regione,
.r-deserto,
.r-mare,
.r-regno,
.r-foresta,
.r-monti {
  margin: -0.5em 0 0 0;
  transform-origin: 0 0;
  translate: -50% 0;
  font-family: var(--font-display);
  letter-spacing: 0.18em;
  color: #8a3527;
}
.r-macro {
  font-size: clamp(17px, 2vw, 26px);
  letter-spacing: 0.35em;
  color: #4a3b2c;
  opacity: 0.85;
}
.r-mare {
  color: #2f5966;
  font-style: italic;
}
</style>
