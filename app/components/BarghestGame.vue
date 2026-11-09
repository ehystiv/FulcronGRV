<script setup lang="ts">
// Easter egg of the 404 page, in the spirit of Chrome's offline dinosaur: Illyrio runs through the desert with the
// Barghest at his heels. Every obstacle he hits brings the beast closer; the third time it catches him.
// Drawn on a small canvas scaled up with sharp pixels; the loop only runs while a game is on.

// Width of the desert in game pixels: narrower on phones, so each pixel stays big enough to see
const LARGO = 320
const STRETTO = 240
const ALTEZZA = 100
const SUOLO = 88 // y of the ground line
const X_ILLYRIO = 76
const GRAVITA = 950
const SALTO = 290
const VELOCITA_INIZIO = 115
const VELOCITA_MAX = 270
const ACCELERAZIONE = 2.6 // px/s gained every second
const COLPI_MAX = 3
const INVULNERABILE = 1.1 // seconds of blinking after a hit
const RECUPERO = 20 // seconds without hits after which the Barghest loses ground
const BARGHEST_X = [-14, 6, 26] // left edge of the Barghest after 0, 1 and 2 hits
const CHIAVE_RECORD = 'fulcron-barghest-record'

type Stato = 'attesa' | 'corsa' | 'preso' | 'fine'
type Sprite = { img: HTMLCanvasElement; w: number; h: number }
interface Ostacolo {
  tipo: keyof typeof OSTACOLI | 'avvoltoio'
  x: number
  y: number // top edge
  w: number
  h: number
}

const canvas = ref<HTMLCanvasElement>()
const larghezza = ref(LARGO)
const stato = ref<Stato>('attesa')
const punti = ref(0)
const record = ref(0)
const colpi = ref(0)
const annuncio = ref('')

const testo = computed(() => {
  if (stato.value === 'attesa') return 'Anche Illyrio si è perso, e il Barghest ne ha fiutato le tracce.'
  if (stato.value === 'fine') return 'Il Barghest ha raggiunto Illyrio!'
  return ''
})
const comandi = computed(() =>
  stato.value === 'attesa'
    ? 'Premi Spazio o tocca il deserto per aiutarlo a scappare'
    : stato.value === 'fine'
      ? 'Premi Spazio o tocca per riprovare'
      : '',
)
const cifre = (n: number) => String(Math.floor(n)).padStart(5, '0')

let ctx: CanvasRenderingContext2D | null = null
let sprites: Record<string, Sprite> = {}
let raf = 0
let ultimo = 0
let fineDa = 0 // when the game ended, so a key held from the last jump does not restart at once

// Game state, outside Vue reactivity: it changes every frame
let velocita = VELOCITA_INIZIO
let scala = 1 // speeds shrink with the desert, so the time to react stays the same
let tempo = 0
let scorrimento = 0
let y = 0 // height of Illyrio above the ground
let vy = 0
let chino = false
let giuPremuto = false
let invulnerabile = 0
let senzaColpi = 0
let ostacoli: Ostacolo[] = []
let prossimo = 0 // distance before the next obstacle
let bx = BARGHEST_X[0]!
let by = 0
let bvy = 0
let presa = 0 // progress of the final lunge

function disegnaSprite(righe: string[], specchio = false): Sprite {
  const w = Math.max(...righe.map((r) => r.length))
  const h = righe.length
  const img = document.createElement('canvas')
  img.width = w
  img.height = h
  const c = img.getContext('2d')!
  righe.forEach((riga, j) => {
    for (let i = 0; i < riga.length; i++) {
      const colore = BARGHEST_COLORI[riga[i]!]
      if (!colore) continue
      c.fillStyle = colore
      c.fillRect(specchio ? w - 1 - i : i, j, 1, 1)
    }
  })
  return { img, w, h }
}

function preparaSprite() {
  sprites = {
    fermo: disegnaSprite(ILLYRIO_FERMO),
    corsa0: disegnaSprite(ILLYRIO_CORSA[0]!),
    corsa1: disegnaSprite(ILLYRIO_CORSA[1]!),
    chino0: disegnaSprite(ILLYRIO_CHINO[0]!),
    chino1: disegnaSprite(ILLYRIO_CHINO[1]!),
    barghest0: disegnaSprite(BARGHEST_CORSA[0]!),
    barghest1: disegnaSprite(BARGHEST_CORSA[1]!),
    avvoltoio0: disegnaSprite(AVVOLTOIO[0]!, true),
    avvoltoio1: disegnaSprite(AVVOLTOIO[1]!, true),
    sasso: disegnaSprite(OSTACOLI.sasso),
    masso: disegnaSprite(OSTACOLI.masso),
    cactus: disegnaSprite(OSTACOLI.cactus),
    teschio: disegnaSprite(OSTACOLI.teschio),
  }
}

function spriteIllyrio(): Sprite {
  if (stato.value === 'attesa') return sprites.fermo!
  const passo = stato.value === 'corsa' ? Math.floor(tempo * 10) % 2 : 0
  if (chino && y === 0) return sprites[`chino${passo}`]!
  return sprites[y > 0 ? 'corsa0' : `corsa${passo}`]!
}

// Collision box of Illyrio, a little smaller than the sprite so near misses count as misses
function corpoIllyrio() {
  const s = spriteIllyrio()
  const alto = SUOLO - y - s.h
  return chino && y === 0
    ? { x: X_ILLYRIO + 4, y: alto + 2, w: s.w - 8, h: s.h - 3 }
    : { x: X_ILLYRIO + 6, y: alto + 2, w: 9, h: s.h - 3 }
}

function nuovoOstacolo(): Ostacolo {
  const voli = punti.value > 250 && Math.random() < 0.28
  if (voli) {
    const s = sprites.avvoltoio0!
    // Low: jump over it. Middle: duck under it. High: just keep running
    const quota = [SUOLO - 8, SUOLO - 19, SUOLO - 33][Math.floor(Math.random() * 3)]!
    return { tipo: 'avvoltoio', x: larghezza.value + 4, y: quota - s.h, w: s.w, h: s.h }
  }
  const tipi = punti.value > 120 ? (['sasso', 'masso', 'cactus', 'teschio'] as const) : (['sasso', 'teschio'] as const)
  const tipo = tipi[Math.floor(Math.random() * tipi.length)]!
  const s = sprites[tipo]!
  return { tipo, x: larghezza.value + 4, y: SUOLO - s.h, w: s.w, h: s.h }
}

function urta(o: Ostacolo) {
  const a = corpoIllyrio()
  const margine = o.tipo === 'avvoltoio' ? 2 : 1
  return (
    a.x < o.x + o.w - margine && a.x + a.w > o.x + margine && a.y < o.y + o.h - margine && a.y + a.h > o.y + margine
  )
}

function inizia() {
  velocita = VELOCITA_INIZIO * scala
  tempo = 0
  y = 0
  vy = 0
  chino = giuPremuto
  invulnerabile = 0
  senzaColpi = 0
  ostacoli = []
  prossimo = 140
  bx = -40
  by = 0
  bvy = 0
  presa = 0
  punti.value = 0
  colpi.value = 0
  annuncio.value = ''
  stato.value = 'corsa'
  avvia()
}

function salta() {
  if (stato.value === 'attesa') return inizia()
  if (stato.value === 'fine') {
    if (performance.now() - fineDa > 600) inizia()
    return
  }
  if (stato.value === 'corsa' && y === 0) {
    vy = SALTO
    chino = false
  }
}

function abbassa(giu: boolean) {
  giuPremuto = giu
  if (stato.value !== 'corsa') return
  chino = giu
  if (giu && y > 0) vy = Math.min(vy, -SALTO) // drop fast from a jump
}

function aggiorna(dt: number) {
  tempo += dt
  if (stato.value === 'corsa') {
    velocita = Math.min(VELOCITA_MAX * scala, velocita + ACCELERAZIONE * scala * dt)
    punti.value += (dt * velocita) / 9
    scorrimento += velocita * dt

    // Illyrio
    if (y > 0 || vy > 0) {
      vy -= GRAVITA * dt
      y = Math.max(0, y + vy * dt)
      if (y === 0) {
        vy = 0
        chino = giuPremuto
      }
    }
    invulnerabile = Math.max(0, invulnerabile - dt)

    // Obstacles
    prossimo -= velocita * dt
    if (prossimo <= 0) {
      ostacoli.push(nuovoOstacolo())
      // Gaps grow with speed so every one stays passable
      prossimo = velocita * (0.75 + Math.random() * 0.9) + 40
    }
    for (const o of ostacoli) o.x -= velocita * dt * (o.tipo === 'avvoltoio' ? 1.12 : 1)
    ostacoli = ostacoli.filter((o) => o.x + o.w > -50)

    if (invulnerabile === 0) {
      const colpito = ostacoli.find(urta)
      if (colpito) {
        colpi.value++
        senzaColpi = 0
        invulnerabile = INVULNERABILE
        if (colpi.value >= COLPI_MAX) {
          stato.value = 'preso'
          presa = 0
        }
      }
    }

    // A long clean run puts some ground between Illyrio and the beast again
    senzaColpi += dt
    if (colpi.value > 0 && senzaColpi > RECUPERO) {
      colpi.value--
      senzaColpi = 0
    }
  } else if (stato.value === 'preso') {
    presa = Math.min(1, presa + dt * 2.2)
    if (y > 0) {
      vy -= GRAVITA * dt
      y = Math.max(0, y + vy * dt)
    }
    if (presa === 1) termina()
  }

  // The Barghest closes in, and leaps over what lies in its way
  const meta = stato.value === 'preso' ? X_ILLYRIO - 18 : BARGHEST_X[Math.min(colpi.value, 2)]!
  bx += (meta - bx) * Math.min(1, dt * (stato.value === 'preso' ? 9 : 2.5))
  if (
    stato.value === 'corsa' &&
    by === 0 &&
    ostacoli.some((o) => o.tipo !== 'avvoltoio' && o.x > bx + 18 && o.x < bx + 34)
  )
    bvy = SALTO * 0.9
  if (by > 0 || bvy > 0) {
    bvy -= GRAVITA * dt
    by = Math.max(0, by + bvy * dt)
    if (by === 0) bvy = 0
  }
}

function termina() {
  stato.value = 'fine'
  fineDa = performance.now()
  cancelAnimationFrame(raf)
  raf = 0
  const fatti = Math.floor(punti.value)
  const nuovo = fatti > record.value
  if (nuovo) {
    record.value = fatti
    try {
      localStorage.setItem(CHIAVE_RECORD, String(fatti))
    } catch {
      // Storage blocked: the record lasts until the page is closed
    }
  }
  annuncio.value = `Il Barghest ti ha preso dopo ${fatti} passi.${nuovo ? ' Nuovo record!' : ''}`
  disegna()
}

function disegna() {
  if (!ctx) return
  const c = ctx
  const LARGHEZZA = larghezza.value
  // Sky and sun
  c.fillStyle = '#f6e9cc'
  c.fillRect(0, 0, LARGHEZZA, ALTEZZA)
  c.fillStyle = '#f2d89a'
  c.fillRect(250, 14, 14, 14)
  c.fillRect(248, 16, 18, 10)
  c.fillRect(252, 12, 10, 18)

  // Far dunes, scrolling slower than the ground
  c.fillStyle = '#ead2a2'
  const lontano = scorrimento * 0.15
  for (let x = 0; x < LARGHEZZA; x++) {
    const h = 10 + Math.sin((x + lontano) / 37) * 5 + Math.sin((x + lontano) / 13) * 2
    c.fillRect(x, SUOLO - h - 4, 1, h + 4)
  }
  c.fillStyle = '#e1c08a'
  const vicino = scorrimento * 0.4
  for (let x = 0; x < LARGHEZZA; x++) {
    const h = 5 + Math.sin((x + vicino) / 23) * 3
    c.fillRect(x, SUOLO - h, 1, h)
  }

  // Ground with pebbles
  c.fillStyle = '#d6b178'
  c.fillRect(0, SUOLO, LARGHEZZA, ALTEZZA - SUOLO)
  c.fillStyle = '#9c7a43'
  c.fillRect(0, SUOLO, LARGHEZZA, 1)
  c.fillStyle = '#b8935a'
  for (let i = 0; i < 18; i++) {
    const x = (((i * 53 - scorrimento) % (LARGHEZZA + 20)) + LARGHEZZA + 20) % (LARGHEZZA + 20)
    c.fillRect(Math.floor(x) - 10, SUOLO + 3 + ((i * 7) % 8), (i % 3) + 1, 1)
  }

  // Obstacles
  for (const o of ostacoli) {
    const s = o.tipo === 'avvoltoio' ? sprites[`avvoltoio${Math.floor(tempo * 6) % 2}`]! : sprites[o.tipo]!
    c.drawImage(s.img, Math.round(o.x), Math.round(o.y))
  }

  // Illyrio, blinking while he recovers from a hit
  const lampeggia = invulnerabile > 0 && stato.value === 'corsa' && Math.floor(invulnerabile * 12) % 2 === 0
  if (!lampeggia) {
    const s = spriteIllyrio()
    c.drawImage(s.img, X_ILLYRIO, Math.round(SUOLO - y - s.h))
  }

  // The Barghest, with a trail of embers
  if (stato.value !== 'attesa') {
    const s = sprites[`barghest${Math.floor(tempo * 9) % 2}`]!
    const top = Math.round(SUOLO - by - s.h)
    c.drawImage(s.img, Math.round(bx), top)
    c.fillStyle = '#ff7a2f'
    for (let i = 0; i < 4; i++) {
      const fase = (tempo * 3 + i * 0.37) % 1
      c.globalAlpha = 1 - fase
      c.fillRect(Math.round(bx + 4 - fase * 22), Math.round(top + 4 + i * 2 - fase * 6), 1, 1)
    }
    c.globalAlpha = 1
  }
}

function ciclo(ora: number) {
  // Long pauses (a hidden tab) do not turn into one giant step
  const dt = Math.min(0.05, (ora - ultimo) / 1000)
  ultimo = ora
  aggiorna(dt)
  disegna()
  if (stato.value === 'corsa' || stato.value === 'preso') raf = requestAnimationFrame(ciclo)
}

function avvia() {
  if (raf) return
  ultimo = performance.now()
  raf = requestAnimationFrame(ciclo)
}

const TASTI_SALTO = new Set(['Space', 'ArrowUp', 'KeyW'])
const TASTI_GIU = new Set(['ArrowDown', 'KeyS'])

// Keys belong to the game unless the focus is on a link, a button or a field of the page
function perIlGioco(e: KeyboardEvent) {
  const el = e.target as HTMLElement | null
  if (el?.closest('[data-barghest]')) return true
  return !el?.closest('a, button, input, textarea, select, [contenteditable]')
}

function giuTasto(e: KeyboardEvent) {
  if (e.altKey || e.ctrlKey || e.metaKey || !perIlGioco(e)) return
  if (TASTI_SALTO.has(e.code)) {
    e.preventDefault()
    if (!e.repeat || stato.value === 'corsa') salta()
  } else if (TASTI_GIU.has(e.code) && (stato.value === 'corsa' || e.target === canvas.value?.parentElement)) {
    e.preventDefault()
    abbassa(true)
  }
}

function suTasto(e: KeyboardEvent) {
  if (TASTI_GIU.has(e.code)) abbassa(false)
}

onMounted(async () => {
  if (canvas.value!.parentElement!.clientWidth < 520) {
    larghezza.value = STRETTO
    scala = STRETTO / LARGO
  }
  await nextTick()
  ctx = canvas.value!.getContext('2d')
  preparaSprite()
  try {
    record.value = Number(localStorage.getItem(CHIAVE_RECORD)) || 0
  } catch {
    record.value = 0
  }
  disegna()
  window.addEventListener('keydown', giuTasto)
  window.addEventListener('keyup', suTasto)
})

onBeforeUnmount(() => {
  cancelAnimationFrame(raf)
  window.removeEventListener('keydown', giuTasto)
  window.removeEventListener('keyup', suTasto)
})
</script>

<template>
  <div class="mx-auto mt-12 w-full max-w-[40rem]" data-barghest>
    <div
      class="relative cursor-pointer overflow-hidden rounded-card border border-line bg-[#f6e9cc] shadow-card select-none"
      tabindex="0"
      role="application"
      aria-roledescription="minigioco"
      aria-label="Illyrio in fuga dal Barghest. Spazio o freccia su per saltare, freccia giù per abbassarsi."
      @pointerdown.prevent="salta"
    >
      <canvas
        ref="canvas"
        :width="larghezza"
        :height="ALTEZZA"
        class="block w-full touch-manipulation [image-rendering:pixelated]"
        :style="{ aspectRatio: `${larghezza} / ${ALTEZZA}` }"
        aria-hidden="true"
      />
      <p
        class="absolute top-2 right-3 font-mono text-[0.8rem] font-semibold tracking-wider text-[#6b5432] tabular-nums"
        aria-hidden="true"
      >
        <span v-if="record" class="mr-3 opacity-70">REC {{ cifre(record) }}</span
        >{{ cifre(punti) }}
      </p>
      <div
        v-if="testo"
        class="absolute inset-x-0 top-0 flex h-[72%] flex-col items-center justify-center px-4 pt-4 text-center"
      >
        <p class="font-heading text-[clamp(0.95rem,2.6vw,1.15rem)] text-[#4a3a22]">{{ testo }}</p>
        <p class="mt-1 text-[0.8rem] text-[#6b5432]">{{ comandi }}</p>
      </div>
    </div>
    <div class="mt-3 hidden justify-center gap-3 pointer-coarse:flex" :class="{ invisible: stato !== 'corsa' }">
      <button
        type="button"
        class="min-h-11 rounded-full border border-ink/70 px-5 text-[0.9rem] font-semibold text-ink"
        @pointerdown.prevent="salta"
      >
        Salta
      </button>
      <button
        type="button"
        class="min-h-11 rounded-full border border-ink/70 px-5 text-[0.9rem] font-semibold text-ink"
        @pointerdown.prevent="abbassa(true)"
        @pointerup="abbassa(false)"
        @pointercancel="abbassa(false)"
        @pointerleave="abbassa(false)"
      >
        Abbassati
      </button>
    </div>
    <p class="sr-only" aria-live="polite">{{ annuncio }}</p>
  </div>
</template>
