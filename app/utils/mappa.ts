import coste from '~/assets/mappa/coste.json'

// Terrain of the interactive map of the Ring (/wiki/mappa), in map units: the map is 1280 × 1280, like the
// painted map it was traced from (public/mappa-fulcron.jpg).
// - Sea, islands and lakes come from the painted map (assets/mappa/coste.json, traced once from its colours).
// - Mountains, forests, rivers and borders are drawn by hand here, following the painted map and the wiki.
// Mountains and trees are scattered along these shapes with a fixed seed, so the map is the same at every build.

export const MAPPA_LATO = 1280

type Punto = [number, number]

/** Mountain ranges: the line of the crest, how far the peaks spread from it, and their size. */
const CATENE: { linea: Punto[]; largo: number; passo: number; min: number; max: number }[] = [
  // Terre del Nord, above Casaroccia
  {
    linea: [
      [175, 10],
      [230, 32],
      [290, 56],
      [340, 78],
      [382, 98],
    ],
    largo: 20,
    passo: 12,
    min: 13,
    max: 21,
  },
  // Monti di Vlaren, north of Ilshaka
  {
    linea: [
      [690, 24],
      [760, 30],
      [830, 46],
      [900, 56],
      [970, 50],
      [1040, 42],
    ],
    largo: 26,
    passo: 11,
    min: 16,
    max: 26,
  },
  {
    linea: [
      [760, 84],
      [840, 96],
      [920, 102],
      [1000, 88],
    ],
    largo: 14,
    passo: 13,
    min: 13,
    max: 20,
  },
  {
    linea: [
      [700, 108],
      [760, 128],
      [820, 152],
      [868, 180],
      [890, 200],
    ],
    largo: 16,
    passo: 11,
    min: 12,
    max: 19,
  },
  // Behind the Rocca Fantasma, the north-eastern barrier
  {
    linea: [
      [1052, 30],
      [1066, 90],
      [1082, 150],
      [1106, 215],
      [1136, 280],
      [1160, 340],
      [1180, 400],
      [1196, 445],
    ],
    largo: 22,
    passo: 11,
    min: 14,
    max: 23,
  },
  // Monti Lerrnerum
  {
    linea: [
      [1086, 610],
      [1090, 660],
      [1086, 720],
      [1072, 780],
      [1060, 840],
      [1040, 900],
      [1020, 948],
      [998, 975],
    ],
    largo: 30,
    passo: 10,
    min: 16,
    max: 26,
  },
  {
    linea: [
      [1132, 985],
      [1166, 993],
      [1200, 1000],
      [1236, 1006],
    ],
    largo: 12,
    passo: 12,
    min: 11,
    max: 17,
  },
  // South-east, towards the Foresta di Sathros
  {
    linea: [
      [806, 1138],
      [852, 1152],
      [902, 1174],
      [950, 1196],
      [990, 1220],
      [1030, 1246],
      [1062, 1270],
    ],
    largo: 18,
    passo: 11,
    min: 13,
    max: 21,
  },
  // The western arc: north of the Chult…
  {
    linea: [
      [338, 416],
      [290, 401],
      [230, 389],
      [170, 383],
      [110, 387],
      [62, 402],
    ],
    largo: 16,
    passo: 11,
    min: 12,
    max: 19,
  },
  // …the Alte Montagne…
  {
    linea: [
      [38, 420],
      [30, 500],
      [26, 600],
      [30, 700],
      [36, 800],
      [44, 900],
      [54, 1000],
      [64, 1080],
      [58, 1160],
      [48, 1250],
    ],
    largo: 34,
    passo: 10,
    min: 20,
    max: 32,
  },
  // …and the mountains of the Reame dei Nani
  {
    linea: [
      [96, 1102],
      [150, 1124],
      [220, 1138],
      [290, 1146],
      [360, 1150],
      [420, 1148],
      [478, 1140],
    ],
    largo: 20,
    passo: 11,
    min: 13,
    max: 21,
  },
  {
    linea: [
      [24, 1200],
      [90, 1222],
      [150, 1250],
      [196, 1276],
    ],
    largo: 18,
    passo: 11,
    min: 14,
    max: 22,
  },
  {
    linea: [
      [590, 1238],
      [630, 1252],
      [672, 1268],
    ],
    largo: 8,
    passo: 11,
    min: 10,
    max: 14,
  },
  // Sassorosso and the hills of the great islands
  {
    linea: [
      [470, 188],
      [500, 182],
      [534, 192],
    ],
    largo: 5,
    passo: 9,
    min: 9,
    max: 12,
  },
  {
    linea: [
      [473, 408],
      [479, 438],
      [486, 462],
    ],
    largo: 4,
    passo: 9,
    min: 8,
    max: 10,
  },
  {
    linea: [
      [633, 592],
      [640, 630],
      [647, 676],
    ],
    largo: 6,
    passo: 9,
    min: 8,
    max: 11,
  },
  {
    linea: [
      [772, 776],
      [778, 806],
      [784, 834],
    ],
    largo: 5,
    passo: 9,
    min: 8,
    max: 10,
  },
]

/** Single peaks: x, y, size. */
const PICCHI: [number, number, number][] = [
  [266, 156, 18], // Monte Iridel, a dormant volcano
  [374, 284, 13], // Monte Lupo
  [484, 860, 10], // Monte Uru
]

/** Forests: centre, radii, kind of tree. */
const FORESTE: { c: Punto; r: Punto; tipo: 'latifoglie' | 'conifere' | 'cerulea' }[] = [
  { c: [165, 176], r: [56, 28], tipo: 'conifere' }, // Foresta delle Rocce
  { c: [86, 138], r: [40, 22], tipo: 'conifere' },
  { c: [418, 106], r: [28, 18], tipo: 'conifere' }, // Foresta del Sussurro
  { c: [92, 278], r: [48, 30], tipo: 'cerulea' }, // Foresta Cerulea
  { c: [360, 200], r: [42, 18], tipo: 'latifoglie' }, // woods of Ulia
  { c: [228, 238], r: [36, 18], tipo: 'latifoglie' },
  { c: [380, 330], r: [44, 22], tipo: 'latifoglie' }, // woods of Ilvia
  { c: [478, 258], r: [70, 50], tipo: 'latifoglie' }, // Foresta di Shandora
  { c: [812, 322], r: [62, 26], tipo: 'latifoglie' }, // Foresta di Tyr
  { c: [186, 690], r: [82, 128], tipo: 'latifoglie' }, // Foresta del Chult
  { c: [330, 1000], r: [36, 26], tipo: 'latifoglie' }, // the jungle at Xyla
  { c: [960, 820], r: [56, 44], tipo: 'latifoglie' }, // Terre Verdi di Jotai
  { c: [1000, 930], r: [28, 22], tipo: 'latifoglie' },
  { c: [1030, 1238], r: [62, 30], tipo: 'latifoglie' }, // Foresta di Sathros
]

/** Rivers, as SVG paths. */
export const MAPPA_FIUMI = [
  'M148 432C190 450 215 478 250 470S305 452 332 450', // Prabal
  'M108 768C150 756 180 770 220 772S280 780 304 778', // Shaane
  'M60 922C95 930 140 940 175 946S205 948 218 950', // into Lago Iveel
  'M258 950C300 940 340 935 370 944S394 954 404 958',
  'M790 205C795 240 790 270 795 300S792 335 790 354', // Tyr
  'M1092 300C1060 302 1030 300 1000 305S950 318 925 326C900 334 870 338 846 344S818 352 804 358', // Amdinare
  'M904 333C892 350 880 368 868 380S858 390 852 394', // its southern arm
  'M1032 900C1000 894 975 900 950 898S900 892 872 896', // Haku
]

/** The borders between North, East, South and West. */
export const MAPPA_CONFINI_MACRO = [
  'M14 372C100 360 200 370 260 382S320 400 345 418', // North / West
  'M1176 0C1140 60 1100 110 1070 165S1030 250 1000 280S975 300 950 320S896 342 862 360', // North / East
  'M852 928C900 950 960 975 1010 990S1100 1040 1150 1072S1232 1180 1280 1262', // East / South
  'M402 956C384 990 366 1020 346 1050S280 1100 232 1130S120 1200 64 1280', // South / West
]

/** Borders inside the North: its three regions and the seven kingdoms of the Rorish. */
export const MAPPA_CONFINI_REGNI = [
  'M393 0L398 60C400 110 400 150 402 175S425 255 440 290S470 335 478 345', // Qorish / Rorish
  'M48 78C120 90 180 110 240 125S340 140 402 148', // Terre del Nord / Qorish
  'M58 300C140 300 220 295 280 285S360 255 402 240', // Ulia / Ilvia
  'M505 0C505 50 506 100 512 150', // Iseldor / Erden
  'M402 152C450 156 490 157 512 153S570 146 600 143S630 120 640 105', // Iseldor and Erden / Shador and Estar
  'M625 0C630 40 635 80 640 105S690 140 720 150', // Erden / Ilshaka
  'M576 153C577 190 578 230 578 272', // Shador / Estar
  'M478 300C520 290 550 280 578 272S650 268 700 268S760 262 790 255', // Lungacosta
  'M640 105C660 150 680 200 700 268', // Estar / Ilshaka
  'M790 255C830 250 880 245 932 240', // Ilshaka / Foran
]

/** La Muraglia, from Lago Nerys to Argyreia, and its towers. */
export const MAPPA_MURAGLIA =
  'M462 1234C500 1222 530 1214 560 1206S620 1192 660 1188S730 1182 760 1177S792 1168 816 1158'

/** Lakes the tracing missed (too pale or too thin on the painted map). */
const LAGHI_A_MANO = [
  'M432 1186C452 1184 466 1198 464 1218S470 1250 458 1266S424 1276 414 1258S402 1222 410 1204S420 1188 432 1186Z', // Nerys
  'M126 600C136 594 152 594 160 600S154 610 140 610S118 606 126 600Z', // Ayiverre
]

// The painted map's sea and lakes, as SVG paths
export const MAPPA_MARE: string = coste.mare
export const MAPPA_ISOLE: string[] = coste.isole.map((i) => i.d)
export const MAPPA_LAGHI: string[] = [...coste.laghi.map((l) => l.d), ...LAGHI_A_MANO]
/** The nine seas (and the Mare delle Ossa), by id: the same ids as in content/mappa.yml */
export const MAPPA_MARI: Record<string, string> = coste.mari
export const MAPPA_CONFINI_MARI: string = coste.confiniMari

/** Areas with marsh tufts and dunes. */
const PALUDI: Punto[][] = [
  [
    [444, 1280],
    [470, 1240],
    [560, 1218],
    [650, 1200],
    [740, 1194],
    [810, 1178],
    [850, 1196],
    [900, 1236],
    [960, 1268],
    [990, 1280],
  ],
  [
    [176, 1186],
    [300, 1176],
    [400, 1180],
    [404, 1280],
    [190, 1280],
  ],
]
const DESERTI: Punto[][] = [
  [
    [1196, 452],
    [1280, 404],
    [1280, 840],
    [1238, 836],
    [1160, 700],
    [1128, 560],
  ],
  [
    [1112, 828],
    [1280, 862],
    [1280, 1110],
    [1236, 1110],
    [1110, 1010],
    [1104, 900],
  ],
]

// ---------- Scattering ----------

/** Small seeded random generator (mulberry32): the same numbers at every build. */
function casuale(seme: number) {
  let a = seme >>> 0
  return () => {
    a = (a + 0x6d2b79f5) >>> 0
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/** Points of an SVG path made only of M/L commands (the traced coast). */
function puntiDelPercorso(d: string): Punto[] {
  return [...d.matchAll(/(-?\d+(?:\.\d+)?) (-?\d+(?:\.\d+)?)/g)].map((m) => [Number(m[1]), Number(m[2])])
}

function dentro([x, y]: Punto, poligono: Punto[]) {
  let si = false
  for (let i = 0, j = poligono.length - 1; i < poligono.length; j = i++) {
    const [xi, yi] = poligono[i]!
    const [xj, yj] = poligono[j]!
    if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) si = !si
  }
  return si
}

const ACQUE: Punto[][] = [MAPPA_MARE, ...MAPPA_LAGHI].map(puntiDelPercorso)
const ISOLE: Punto[][] = MAPPA_ISOLE.map(puntiDelPercorso)
/** True on land: outside the sea and the lakes, or on an island. */
function suTerra(p: Punto) {
  if (ISOLE.some((isola) => dentro(p, isola))) return true
  return !ACQUE.some((acqua) => dentro(p, acqua))
}

export interface Simbolo {
  x: number
  y: number
  /** Size in map units */
  s: number
  /** Variant: which of the drawings to use */
  v: number
}

export interface Terreno {
  montagne: Simbolo[]
  alberi: (Simbolo & { tipo: 'latifoglie' | 'conifere' | 'cerulea' })[]
  /** Soft background under each forest */
  boschi: { d: string; tipo: 'latifoglie' | 'conifere' | 'cerulea' }[]
  ciuffi: Simbolo[]
  dune: Simbolo[]
}

/** Mountains, trees, marsh tufts and dunes, scattered over the hand-drawn shapes. */
export function terrenoMappa(): Terreno {
  const r = casuale(1712)
  const montagne: Simbolo[] = []
  for (const catena of CATENE) {
    for (let i = 0; i < catena.linea.length - 1; i++) {
      const [x1, y1] = catena.linea[i]!
      const [x2, y2] = catena.linea[i + 1]!
      const lungo = Math.hypot(x2 - x1, y2 - y1)
      const [nx, ny] = [-(y2 - y1) / lungo, (x2 - x1) / lungo]
      // Peaks fill a band around the crest: denser and taller near it, scattered and lower at the edges
      const quanti = Math.max(
        1,
        Math.round((lungo / catena.passo) * (catena.largo > 24 ? 4.2 : catena.largo > 12 ? 2.8 : 1.2)),
      )
      for (let n = 0; n < quanti; n++) {
        const k = r()
        // Distance from the crest: a bell curve, so the middle is fuller than the edges
        const d = (r() + r() + r() - 1.5) / 1.5
        const x = x1 + (x2 - x1) * k + nx * d * catena.largo
        const y = y1 + (y2 - y1) * k + ny * d * catena.largo
        const s = (catena.min + r() * (catena.max - catena.min)) * (1 - Math.abs(d) * 0.35)
        if (suTerra([x, y])) montagne.push({ x, y, s, v: Math.floor(r() * 3) })
      }
    }
  }
  for (const [x, y, s] of PICCHI) montagne.push({ x, y, s, v: 0 })
  // Painter's order: the peaks lower on the map cover the ones behind them
  montagne.sort((a, b) => a.y - b.y)

  const alberi: Terreno['alberi'] = []
  const boschi: Terreno['boschi'] = []
  for (const foresta of FORESTE) {
    const [cx, cy] = foresta.c
    const [rx, ry] = foresta.r
    // An irregular outline around the ellipse
    const bordo: Punto[] = []
    for (let i = 0; i < 28; i++) {
      const a = (i / 28) * Math.PI * 2
      const k = 0.85 + r() * 0.3
      bordo.push([cx + Math.cos(a) * rx * k, cy + Math.sin(a) * ry * k])
    }
    boschi.push({ d: percorsoMorbido(bordo), tipo: foresta.tipo })
    const passo = foresta.tipo === 'conifere' ? 8 : 9
    for (let y = cy - ry; y <= cy + ry; y += passo * 0.8) {
      for (let x = cx - rx; x <= cx + rx; x += passo) {
        const p: Punto = [x + (r() - 0.5) * passo * 0.8, y + (r() - 0.5) * passo * 0.6]
        if (dentro(p, bordo) && suTerra(p) && r() > 0.12) {
          alberi.push({ x: p[0], y: p[1], s: 6 + r() * 3, v: Math.floor(r() * 2), tipo: foresta.tipo })
        }
      }
    }
  }
  alberi.sort((a, b) => a.y - b.y)

  const sparsi = (aree: Punto[][], passo: number, seme: number) => {
    const rr = casuale(seme)
    const out: Simbolo[] = []
    for (const area of aree) {
      const xs = area.map((p) => p[0])
      const ys = area.map((p) => p[1])
      for (let y = Math.min(...ys); y <= Math.max(...ys); y += passo * 0.7) {
        for (let x = Math.min(...xs); x <= Math.max(...xs); x += passo) {
          const p: Punto = [x + (rr() - 0.5) * passo * 0.9, y + (rr() - 0.5) * passo * 0.5]
          if (dentro(p, area) && suTerra(p) && rr() > 0.35) out.push({ x: p[0], y: p[1], s: 0.8 + rr() * 0.5, v: 0 })
        }
      }
    }
    return out
  }
  const lontanoDaiMonti = (p: Simbolo) => !montagne.some((m) => Math.abs(m.x - p.x) < m.s && Math.abs(m.y - p.y) < m.s)

  return {
    montagne,
    alberi,
    boschi,
    ciuffi: sparsi(PALUDI, 20, 7).filter(lontanoDaiMonti),
    dune: sparsi(DESERTI, 30, 11).filter(lontanoDaiMonti),
  }
}

/** A closed, smooth path through the points (Catmull-Rom turned into Bézier curves). */
function percorsoMorbido(p: Punto[]) {
  const n = p.length
  const f = (v: number) => Math.round(v * 10) / 10
  let d = `M${f(p[0]![0])} ${f(p[0]![1])}`
  for (let i = 0; i < n; i++) {
    const [x0, y0] = p[(i - 1 + n) % n]!
    const [x1, y1] = p[i]!
    const [x2, y2] = p[(i + 1) % n]!
    const [x3, y3] = p[(i + 2) % n]!
    d += `C${f(x1 + (x2 - x0) / 6)} ${f(y1 + (y2 - y0) / 6)} ${f(x2 - (x3 - x1) / 6)} ${f(y2 - (y3 - y1) / 6)} ${f(x2)} ${f(y2)}`
  }
  return d + 'Z'
}
