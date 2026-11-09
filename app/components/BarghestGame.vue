<script setup lang="ts">
// Easter egg of the 404 page, in the spirit of Chrome's offline dinosaur: Illyrio runs through the desert with the
// Barghest at his heels. Every obstacle he hits brings the beast closer; the third time it catches him.
// Whoever reaches the current year + 1000 steps gets help: a warrior comes in, answers "Ho capito, Magistro Illyrio!"
// and slays the Barghest.
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

type Stato = 'attesa' | 'corsa' | 'preso' | 'fine' | 'finale' | 'vittoria'
type Sprite = { img: HTMLCanvasElement; w: number; h: number }
interface Brace {
  x: number
  y: number
  vx: number
  vy: number
  vita: number
  colore: string
}
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
const riquadro = ref<HTMLElement>()
// Once a game starts the desert widens to the whole page (edge to edge on phones) and stays wide
const aperto = ref(false)
const traguardo = ref(3026) // steps that end the run in victory: the current year + 1000, set when a game starts
// The warrior's line, shown in a speech bubble above him
const fumetto = ref(false)
const fumettoX = ref(0)
const BATTUTA = 'Ho capito, Magistro Illyrio!'

const testo = computed(() => {
  if (stato.value === 'attesa') return 'Anche Illyrio si è perso, e il Barghest ne ha fiutato le tracce.'
  if (stato.value === 'fine') return 'Il Barghest ha raggiunto Illyrio!'
  if (stato.value === 'vittoria') return 'Il Barghest è stato sconfitto!'
  return ''
})
const comandi = computed(() =>
  stato.value === 'attesa'
    ? 'Premi Spazio o tocca il deserto per aiutarlo a scappare'
    : stato.value === 'fine'
      ? 'Premi Spazio o tocca per riprovare'
      : stato.value === 'vittoria'
        ? 'Premi Spazio o tocca per giocare ancora'
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
let vasoCambiato = { indice: -1, tempo: 0 } // the jar that just emptied or filled, which blinks for a moment
// The ending
let fin = 0 // seconds since the goal was reached
let lampo = 0 // white flash that freezes the run
let wx = 0 // left edge of the warrior's body
let wy = 0
let barghestVivo = true
let braci: Brace[] = [] // what is left of the Barghest

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
    guerriero: disegnaSprite(GUERRIERO_FERMO, true),
    guerriero0: disegnaSprite(GUERRIERO_CORSA[0]!, true),
    guerriero1: disegnaSprite(GUERRIERO_CORSA[1]!, true),
    guerrieroColpo: disegnaSprite(GUERRIERO_COLPO, true),
    vasoPieno: disegnaSprite(VASO_PIENO),
    vasoVuoto: disegnaSprite(VASO_VUOTO),
  }
}

function spriteIllyrio(): Sprite {
  if (stato.value === 'attesa') return sprites.fermo!
  if ((stato.value === 'finale' || stato.value === 'vittoria') && y === 0) return sprites.fermo!
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

function apri() {
  if (aperto.value) return
  aperto.value = true
  // Bring the whole desert into view once it has finished widening
  const fermo = matchMedia('(prefers-reduced-motion: reduce)').matches
  setTimeout(
    () => riquadro.value?.scrollIntoView({ block: 'center', behavior: fermo ? 'auto' : 'smooth' }),
    fermo ? 0 : 450,
  )
}

function inizia() {
  apri()
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
  vasoCambiato = { indice: -1, tempo: 0 }
  barghestVivo = true
  braci = []
  fumetto.value = false
  traguardo.value = new Date().getFullYear() + 1000
  punti.value = 0
  colpi.value = 0
  annuncio.value = ''
  stato.value = 'corsa'
  avvia()
}

function salta() {
  if (stato.value === 'attesa') return inizia()
  if (stato.value === 'fine' || stato.value === 'vittoria') {
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
  vasoCambiato.tempo = Math.max(0, vasoCambiato.tempo - dt)
  if (stato.value === 'corsa') {
    velocita = Math.min(VELOCITA_MAX * scala, velocita + ACCELERAZIONE * scala * dt)
    punti.value += (dt * velocita) / 9
    scorrimento += velocita * dt
    if (punti.value >= traguardo.value) return avviaFinale()

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
        vasoCambiato = { indice: COLPI_MAX - colpi.value, tempo: 1 }
        const restano = COLPI_MAX - colpi.value
        if (restano > 0)
          annuncio.value = `Colpito! ${restano === 1 ? 'Resta una pozione' : `Restano ${restano} pozioni`}.`
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
      vasoCambiato = { indice: COLPI_MAX - colpi.value - 1, tempo: 1 }
      annuncio.value = 'Il Barghest perde terreno: una pozione torna piena.'
    }
  } else if (stato.value === 'finale') {
    aggiornaFinale(dt)
    return
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

function avviaFinale() {
  punti.value = traguardo.value
  stato.value = 'finale'
  fin = 0
  lampo = 0.25
  ostacoli = [] // swept away by the flash
  invulnerabile = 0
  chino = false
  wx = larghezza.value + 8
  wy = 0
  annuncio.value = `Un guerriero accorre in aiuto di Illyrio: «${BATTUTA}»`
}

// The ending, as a timeline: the run slows to a halt, the warrior runs in and speaks, leaps over Illyrio and strikes
function aggiornaFinale(dt: number) {
  fin += dt
  lampo = Math.max(0, lampo - dt)
  velocita *= Math.max(0, 1 - dt * 4)
  scorrimento += velocita * dt
  if (y > 0 || vy > 0) {
    vy -= GRAVITA * dt
    y = Math.max(0, y + vy * dt)
    if (y === 0) vy = 0
  }
  if (by > 0 || bvy > 0) {
    bvy -= GRAVITA * dt
    by = Math.max(0, by + bvy * dt)
    if (by === 0) bvy = 0
  }

  // The Barghest steps out into the open, growling, so the fight happens in plain sight
  if (fin < 3.6) bx += (Math.max(bx, 10) - bx) * Math.min(1, dt * 3)
  const posa = X_ILLYRIO + 34 // where he stops, just ahead of Illyrio
  const bersaglio = bx + 34 // close enough for the blade to reach the Barghest's head
  if (fin < 0.4) wx = larghezza.value + 8
  else if (fin < 1.4) wx = posa + (larghezza.value + 8 - posa) * (1 - (fin - 0.4))
  else if (fin < 3.6) wx = posa
  else if (fin < 4.1) {
    const p = (fin - 3.6) / 0.5
    wx = posa + (bersaglio - posa) * p
    wy = Math.sin(Math.PI * p) * 32
  } else {
    wx = bersaglio
    wy = 0
  }
  fumetto.value = fin >= 1.5 && fin < 3.5
  fumettoX.value = wx + 9

  // Struck at 4.1 s, the Barghest flickers and then bursts into embers
  if (barghestVivo && fin >= 4.5) {
    barghestVivo = false
    const top = SUOLO - by - 17
    const colori = ['#16121b', '#3a3142', '#ff3b2f', '#ff7a2f', '#ffb347']
    for (let i = 0; i < 70; i++) {
      braci.push({
        x: bx + 4 + Math.random() * 26,
        y: top + Math.random() * 17,
        vx: (Math.random() - 0.5) * 50,
        vy: -15 - Math.random() * 45,
        vita: 0.7 + Math.random() * 0.9,
        colore: colori[i % colori.length]!,
      })
    }
  }
  for (const b of braci) {
    b.x += b.vx * dt
    b.y += b.vy * dt
    b.vx *= 1 - dt
    b.vita -= dt
  }
  braci = braci.filter((b) => b.vita > 0)

  if (fin >= 6.2) vince()
}

function salvaRecord() {
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
  return { fatti, nuovo }
}

function ferma(nuovoStato: Stato) {
  stato.value = nuovoStato
  vasoCambiato.tempo = 0
  fineDa = performance.now()
  cancelAnimationFrame(raf)
  raf = 0
}

function termina() {
  ferma('fine')
  const { fatti, nuovo } = salvaRecord()
  annuncio.value = `Il Barghest ti ha preso dopo ${fatti} passi.${nuovo ? ' Nuovo record!' : ''}`
  disegna()
}

function vince() {
  ferma('vittoria')
  fumetto.value = false
  const { fatti, nuovo } = salvaRecord()
  annuncio.value = `Il Barghest è stato sconfitto dopo ${fatti} passi!${nuovo ? ' Nuovo record!' : ''}`
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

  // The Barghest, with a trail of embers. Once the run stops it stands still; struck, it flickers
  const colpito = stato.value === 'finale' && fin >= 4.1 && Math.floor(fin * 16) % 2 === 0
  if (stato.value !== 'attesa' && barghestVivo && !colpito) {
    const passo = stato.value === 'finale' && velocita < 20 ? 0 : Math.floor(tempo * 9) % 2
    const s = sprites[`barghest${passo}`]!
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

  // The warrior, mirrored to face the Barghest
  if ((stato.value === 'finale' || stato.value === 'vittoria') && fin >= 0.4) {
    let nome = 'guerriero'
    if (fin < 1.4) nome = `guerriero${Math.floor(tempo * 10) % 2}`
    else if (fin >= 3.6 && fin < 4.1) nome = 'guerriero0'
    else if (fin >= 4.1 && fin < 4.9) nome = 'guerrieroColpo'
    const s = sprites[nome]!
    // The drawn sword sticks out on the left: keep his body where it was
    const sx = nome === 'guerrieroColpo' ? wx - (s.w - 18) : wx
    c.drawImage(s.img, Math.round(sx), Math.round(SUOLO - wy - s.h))
    // The slash
    if (fin >= 4.1 && fin < 4.3) {
      c.fillStyle = '#ffffff'
      for (let k = 0; k <= 12; k++) {
        c.fillRect(Math.round(wx - 10 - Math.sin((k / 12) * Math.PI) * 7), Math.round(SUOLO - 26 + k * 1.7), 2, 1)
      }
    }
  }
  for (const b of braci) {
    c.globalAlpha = Math.min(1, b.vita * 1.5)
    c.fillStyle = b.colore
    c.fillRect(Math.round(b.x), Math.round(b.y), 1, 1)
  }
  c.globalAlpha = 1

  // Life meter: one jar of healing draught for each hit Illyrio can still take
  if (stato.value !== 'attesa') {
    const vite = COLPI_MAX - colpi.value
    for (let i = 0; i < COLPI_MAX; i++) {
      let pieno = i < vite
      // The jar that just changed flickers between its old and new state
      if (i === vasoCambiato.indice && vasoCambiato.tempo > 0 && Math.floor(vasoCambiato.tempo * 10) % 2 === 0) {
        pieno = !pieno
      }
      c.drawImage(sprites[pieno ? 'vasoPieno' : 'vasoVuoto']!.img, 6 + i * 12, 5)
    }
  }

  // The flash that stops the run
  if (lampo > 0) {
    c.globalAlpha = Math.min(1, lampo * 4)
    c.fillStyle = '#fffaf0'
    c.fillRect(0, 0, LARGHEZZA, ALTEZZA)
    c.globalAlpha = 1
  }
}

function ciclo(ora: number) {
  // Long pauses (a hidden tab) do not turn into one giant step. The first timestamp can come before the
  // performance.now() read at the start, since it marks the start of the frame: never step back in time
  const dt = Math.max(0, Math.min(0.05, (ora - ultimo) / 1000))
  ultimo = Math.max(ultimo, ora)
  aggiorna(dt)
  disegna()
  if (stato.value === 'corsa' || stato.value === 'preso' || stato.value === 'finale') raf = requestAnimationFrame(ciclo)
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
  <div
    ref="riquadro"
    class="mx-auto mt-12 w-full transition-[max-width,width] duration-500 ease-out motion-reduce:transition-none"
    :class="aperto ? 'max-w-site max-sm:mx-[calc(50%-50vw)] max-sm:w-screen max-sm:max-w-none' : 'max-w-[40rem]'"
    data-barghest
  >
    <div
      class="relative cursor-pointer overflow-hidden border border-line bg-[#f6e9cc] shadow-card select-none"
      :class="aperto ? 'rounded-card max-sm:rounded-none max-sm:border-x-0' : 'rounded-card'"
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
      <p
        v-if="fumetto"
        class="absolute -translate-x-1/2 rounded-md border-2 border-[#3b2e25] bg-[#fffdf8] px-2 py-1 text-[clamp(0.72rem,1.8vw,0.95rem)] font-semibold whitespace-nowrap text-[#3b2e25]"
        :style="{ left: `${(fumettoX / larghezza) * 100}%`, bottom: `${((ALTEZZA - (SUOLO - 28)) / ALTEZZA) * 100}%` }"
        aria-hidden="true"
      >
        {{ BATTUTA }}
        <span
          class="absolute -bottom-[7px] left-1/2 size-3 -translate-x-1/2 rotate-45 border-r-2 border-b-2 border-[#3b2e25] bg-[#fffdf8]"
        />
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
