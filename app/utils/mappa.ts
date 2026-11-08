import coste from '~/assets/mappa/coste.json'

// Terrain of the interactive map of the Ring (/wiki/mappa), in map units: the map is 1280 × 1280, like the
// painted map it was traced from (public/mappa-fulcron.jpg).
// - Sea, islands and lakes come from the painted map (assets/mappa/coste.json, traced once from its colours).
// - Mountains, forests, rivers and borders are drawn by hand here, following the painted map and the wiki.
// Mountains and trees are scattered along these shapes with a fixed seed, so the map is the same at every build.

export const MAPPA_LATO = 1280

type Punto = [number, number]

/** Mountain ranges: the line of the crest, how far the peaks spread from it, and their size. */
/**
 * Mountain ranges: the line of the crest, how far the peaks spread from it, their size, and their height in the
 * 3D view (`quota`, 0 to 1). Heights follow the wiki: the Alte Montagne are the "altissima catena" that closes the
 * Ring, the Lerrnerum a "grande catena montuosa", Sassorosso and the hills of the islands are low.
 */
export const MAPPA_CATENE: {
  linea: Punto[]
  largo: number
  passo: number
  min: number
  max: number
  quota: number
}[] = [
  // Terre del Nord, above Casaroccia
  {
    linea: [
      [175, 10],
      [230, 32],
      [290, 56],
      [340, 78],
      [382, 98],
    ],
    quota: 0.55,
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
    quota: 0.7,
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
    quota: 0.6,
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
    quota: 0.55,
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
    quota: 0.7,
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
    quota: 0.8,
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
    quota: 0.4,
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
    quota: 0.5,
    largo: 18,
    passo: 11,
    min: 13,
    max: 21,
  },
  // Foothills where the Alte Montagne turn east. The painted map ran a whole range on to the coast here, but the wiki
  // puts the open Piana di Wakan on the border with the North (the altar of Tetrangelo stands in it)
  {
    linea: [
      [150, 386],
      [110, 389],
      [62, 402],
    ],
    quota: 0.4,
    largo: 12,
    passo: 11,
    min: 10,
    max: 15,
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
    quota: 1.0,
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
    quota: 0.65,
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
    quota: 0.75,
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
    quota: 0.3,
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
    quota: 0.35,
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
    quota: 0.25,
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
    quota: 0.3,
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
    quota: 0.25,
    largo: 5,
    passo: 9,
    min: 8,
    max: 10,
  },
]

/** Single peaks: x, y, size. */
export const MAPPA_PICCHI: [number, number, number][] = [
  [266, 156, 18], // Monte Iridel, a dormant volcano
  [374, 284, 13], // Monte Lupo
  [484, 860, 10], // Monte Uru
]

/** Forests: centre, radii, kind of tree. */
/**
 * Forests: centre, radii and kind of tree; a forest with an outline (`contorno`) follows it instead of an ellipse,
 * and `passo` spaces its trees wider.
 */
const FORESTE: {
  c: Punto
  r: Punto
  tipo: 'latifoglie' | 'conifere' | 'cerulea'
  contorno?: Punto[]
  passo?: number
}[] = [
  { c: [165, 176], r: [56, 28], tipo: 'conifere' }, // Foresta delle Rocce
  { c: [86, 138], r: [40, 22], tipo: 'conifere' },
  { c: [418, 106], r: [28, 18], tipo: 'conifere' }, // Foresta del Sussurro
  { c: [92, 278], r: [48, 30], tipo: 'cerulea' }, // Foresta Cerulea
  { c: [360, 200], r: [42, 18], tipo: 'latifoglie' }, // woods of Ulia
  { c: [228, 238], r: [36, 18], tipo: 'latifoglie' },
  { c: [380, 330], r: [44, 22], tipo: 'latifoglie' }, // woods of Ilvia
  { c: [478, 258], r: [70, 50], tipo: 'latifoglie' }, // Foresta di Shandora
  // Foresta di Tyr: for the wiki one of the largest forests of Fulcron, on the border between North and East, reaching
  // the steppe to the east and the Inner Sea to the south; Bontor stays outside it, now that the forest is back within
  // its borders
  {
    c: [855, 335],
    r: [100, 45],
    tipo: 'latifoglie',
    contorno: [
      [760, 318],
      [792, 302],
      [826, 312],
      [862, 316],
      [896, 310],
      [930, 318],
      [956, 330],
      [946, 348],
      [916, 352],
      [888, 364],
      [856, 380],
      [822, 362],
      [792, 352],
      [770, 342],
    ],
  },
  // Foresta di Kalos, a sanctuary of the South: placed in the wild land between Stratos and the Reame dei Nani
  { c: [418, 1078], r: [40, 22], tipo: 'latifoglie' },
  // Foresta del Chult. The wiki: about two thirds of the West, as large as the whole Rorish, the largest forest of
  // the Ring, with the elven kingdom of Syndarra inside it. North of it the Piana di Wakan, between it and the sea a
  // strip of fields for the coastal cities; to the south-east it reaches Xyla, "at the edge of the jungles"
  {
    c: [180, 760],
    r: [190, 340],
    tipo: 'latifoglie',
    passo: 11,
    contorno: [
      [80, 445],
      [140, 430],
      [205, 426],
      [238, 450],
      [244, 505],
      [232, 560],
      [252, 605],
      [258, 660],
      [250, 720],
      [262, 780],
      [270, 840],
      [285, 890],
      [300, 940],
      [330, 975],
      [368, 1000],
      [372, 1040],
      [340, 1075],
      [280, 1090],
      [200, 1085],
      [130, 1075],
      [85, 1040],
      [72, 960],
      [70, 860],
      [68, 760],
      [68, 660],
      [70, 560],
      [72, 490],
    ],
  },
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
  // Amdinare: down from the mountains by Xerxes, with Nuova Theris on its eastern bank, then into two arms with
  // Partaros between them, on the sea
  'M985 188C975 230 958 265 955 300S945 328 935 336',
  'M935 336C915 352 895 372 878 386S862 398 855 403', // northern arm
  'M935 336C932 365 925 395 912 418S898 440 890 447', // southern arm
  'M1088 640C1060 628 1030 618 1005 612S980 606 964 603', // Cyrus, south of Cyr
  'M1032 900C1000 894 975 900 950 898S900 892 872 896', // Haku
]

/** The borders between North, East, South and West. */
export const MAPPA_CONFINI_MACRO = [
  'M14 372C100 360 200 370 260 382S320 400 345 418', // North / West
  // North / East: past the Rocca Fantasma, then along the Amdinare and its northern arm
  'M1176 0C1140 60 1100 110 1070 165S1000 182 985 188C975 230 958 265 955 300S945 328 935 336C915 352 895 372 878 386S862 398 855 403',
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

/**
 * The crater of the Great Cataclysm (3015): "a Nord una grande esplosione devasta tutto lasciando un enorme buco
 * nero". The wiki does not say where: placed in the empty Terre del Nord, between two forests.
 */
export const MAPPA_CRATERE: [number, number, number] = [72, 218, 22]

/** The colours of the land, softly blended: snow, steppe, sand, forest, stone, marsh. */
export const MAPPA_COLORI: Record<string, string> = {
  ghiaccio: '#d9e6ee',
  prato: '#d9d39c',
  erba: '#c4cc86',
  steppa: '#e2cf96',
  sabbia: '#ebc77a',
  ocra: '#d6a052',
  verde: '#9fb27a',
  bosco: '#7f9a62',
  pietra: '#a39d92',
  palude: '#7b8458',
  fango: '#8f8566',
}

/** Patches of colour: centre, radii, colour and how strong it is (0 to 1). */
export const MAPPA_BIOMI: { c: Punto; r: Punto; colore: string; forza: number }[] = [
  // North: ice and snow, then the temperate kingdoms
  { c: [160, 70], r: [280, 120], colore: 'ghiaccio', forza: 0.65 },
  { c: [720, 60], r: [440, 115], colore: 'ghiaccio', forza: 0.6 },
  { c: [1110, 90], r: [210, 160], colore: 'ghiaccio', forza: 0.55 },
  { c: [270, 275], r: [210, 110], colore: 'verde', forza: 0.45 },
  { c: [650, 245], r: [270, 85], colore: 'prato', forza: 0.4 },
  // East: the arid free cities, the Great Desert, the Aarak, the green lands of Jotai
  { c: [1000, 420], r: [210, 140], colore: 'steppa', forza: 0.55 },
  { c: [1180, 560], r: [250, 380], colore: 'sabbia', forza: 0.8 },
  { c: [1262, 600], r: [130, 320], colore: 'ocra', forza: 0.65 },
  { c: [1205, 960], r: [170, 160], colore: 'sabbia', forza: 0.75 },
  { c: [1060, 500], r: [90, 80], colore: 'ocra', forza: 0.3 },
  { c: [960, 840], r: [125, 145], colore: 'verde', forza: 0.65 },
  // South: the Old Kingdom, the Three Gems, the lawless lands, the marshes past the Wall
  { c: [620, 1060], r: [270, 110], colore: 'prato', forza: 0.4 },
  { c: [960, 1040], r: [150, 90], colore: 'steppa', forza: 0.45 },
  { c: [690, 1132], r: [180, 50], colore: 'fango', forza: 0.25 },
  { c: [700, 1268], r: [430, 100], colore: 'palude', forza: 0.8 },
  { c: [290, 1232], r: [175, 72], colore: 'fango', forza: 0.65 },
  { c: [960, 1262], r: [130, 52], colore: 'palude', forza: 0.5 },
  // West: the plain of Wakan, the Chult, the coast, the stone of the Dwarves
  { c: [262, 440], r: [120, 85], colore: 'erba', forza: 0.6 },
  { c: [1085, 262], r: [80, 60], colore: 'sabbia', forza: 0.45 }, // the Great Desert reaches Primafalia
  { c: [175, 760], r: [175, 360], colore: 'bosco', forza: 0.65 },
  { c: [320, 830], r: [60, 170], colore: 'prato', forza: 0.35 },
  { c: [290, 1150], r: [230, 55], colore: 'pietra', forza: 0.45 },
]

/** A tint for each of the seas, by id: the Mar Nero darker, the Mare delle Ossa the colour of bone. */
export const MAPPA_TINTE_MARI: Record<string, [string, number]> = {
  'mar-di-alboran': ['#6f98a8', 0.18],
  'mare-del-cielo': ['#e3f0f2', 0.35],
  'mar-dei-pirati': ['#5e8c88', 0.22],
  'mar-d-avoz': ['#7aa4b6', 0.18],
  'mare-di-parmore': ['#a8cabd', 0.25],
  'mar-nero': ['#38545e', 0.22],
  'mar-levante': ['#86b5a6', 0.25],
  'mare-orientale': ['#8db8cc', 0.22],
  'mare-centrale': ['#d3e6e2', 0.25],
}

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

/** One mountain or hill, drawn on its own: body, shaded side, snow and the ink lines (outline and hatching) */
export interface Monte {
  y: number
  corpo: string
  ombra: string
  neve?: string
  linee: string
}

export interface Terreno {
  montagne: Monte[]
  /** A soft band of colour under each mountain range, so a range reads as one relief */
  basi: { d: string; largo: number }[]
  /** Cracks in the ice of the far north */
  crepe: string
  alberi: (Simbolo & { tipo: 'latifoglie' | 'conifere' | 'cerulea'; chioma: string; ombra: string })[]
  /** Soft background under each forest */
  boschi: { d: string; tipo: 'latifoglie' | 'conifere' | 'cerulea' }[]
  ciuffi: Simbolo[]
  dune: Simbolo[]
}

/** Mountains, trees, marsh tufts and dunes, scattered over the hand-drawn shapes. */
export function terrenoMappa(): Terreno {
  const r = casuale(1712)
  const punti: { x: number; y: number; s: number; colle: boolean; neve: boolean }[] = []
  const basi: Terreno['basi'] = []
  for (const catena of MAPPA_CATENE) {
    basi.push({ d: lineaMorbida(catena.linea), largo: catena.largo })
    for (let i = 0; i < catena.linea.length - 1; i++) {
      const [x1, y1] = catena.linea[i]!
      const [x2, y2] = catena.linea[i + 1]!
      const lungo = Math.hypot(x2 - x1, y2 - y1)
      const [nx, ny] = [-(y2 - y1) / lungo, (x2 - x1) / lungo]
      // Peaks fill a band around the crest: denser and taller near it, scattered and lower at the edges
      const quanti = Math.max(
        1,
        Math.round((lungo / catena.passo) * (catena.largo > 24 ? 2.5 : catena.largo > 12 ? 1.7 : 1)),
      )
      for (let n = 0; n < quanti; n++) {
        const k = r()
        // Distance from the crest: a bell curve, so the middle is fuller than the edges
        const d = (r() + r() + r() - 1.5) / 1.5
        const x = x1 + (x2 - x1) * k + nx * d * catena.largo
        const y = y1 + (y2 - y1) * k + ny * d * catena.largo
        // Sizes vary a lot, so a range never looks like a row of equal teeth
        const s = (catena.min + r() * (catena.max - catena.min)) * (1 - Math.abs(d) * 0.4) * (0.7 + r() * 0.5)
        if (!suTerra([x, y])) continue
        // At the edges of a range the mountains turn into hills
        const colle = Math.abs(d) > 0.5 || (catena.largo > 12 && r() < 0.12)
        // Snow on the north, on the Alte Montagne and on the tallest peaks
        const neve = !colle && (y < 215 || x < 75 || s > catena.max * 0.85)
        punti.push({ x, y, s, colle, neve })
      }
    }
  }
  for (const [x, y, s] of MAPPA_PICCHI) punti.push({ x, y, s, colle: false, neve: false })
  // Painter's order: the peaks lower on the map cover the ones behind them
  punti.sort((a, b) => a.y - b.y)
  const montagne = punti.map((p) => (p.colle ? disegnaColle(p.x, p.y, p.s, r) : disegnaMonte(p.x, p.y, p.s, p.neve, r)))

  // Cracks in the ice: short broken lines in the far north, away from the mountains
  let crepe = ''
  for (let n = 0; n < 34; n++) {
    let x = 30 + r() * 1220
    let y = 22 + r() * 150
    if (!suTerra([x, y]) || punti.some((p) => Math.abs(p.x - x) < 26 && Math.abs(p.y - y) < 22)) continue
    let a = (r() - 0.5) * 1.2
    crepe += `M${f1(x)} ${f1(y)}`
    for (let k = 0, passi = 2 + Math.floor(r() * 3); k < passi; k++) {
      a += (r() - 0.5) * 1.4
      x += Math.cos(a) * (6 + r() * 9)
      y += Math.sin(a) * (4 + r() * 5)
      crepe += `L${f1(x)} ${f1(y)}`
    }
  }

  const alberi: Terreno['alberi'] = []
  const boschi: Terreno['boschi'] = []
  for (const foresta of FORESTE) {
    const [cx, cy] = foresta.c
    const [rx, ry] = foresta.r
    // The drawn outline, or an irregular one around the ellipse
    const bordo: Punto[] = foresta.contorno ? frastaglia(foresta.contorno, r) : []
    if (!foresta.contorno) {
      for (let i = 0; i < 28; i++) {
        const a = (i / 28) * Math.PI * 2
        const k = 0.85 + r() * 0.3
        bordo.push([cx + Math.cos(a) * rx * k, cy + Math.sin(a) * ry * k])
      }
    }
    boschi.push({ d: percorsoMorbido(bordo), tipo: foresta.tipo })
    const passo = foresta.passo ?? (foresta.tipo === 'conifere' ? 8 : 9)
    for (let y = cy - ry; y <= cy + ry; y += passo * 0.8) {
      for (let x = cx - rx; x <= cx + rx; x += passo) {
        const p: Punto = [x + (r() - 0.5) * passo * 0.8, y + (r() - 0.5) * passo * 0.6]
        if (dentro(p, bordo) && suTerra(p) && r() > 0.12) {
          const [chioma, ombra] = TONI[foresta.tipo][Math.floor(r() * 3)]!
          const v = foresta.tipo === 'conifere' ? Math.floor(r() * 2) : Math.floor(r() * 3)
          alberi.push({ x: p[0], y: p[1], s: 6 + r() * 3.5, v, tipo: foresta.tipo, chioma, ombra })
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
  const lontanoDaiMonti = (p: Simbolo) => !punti.some((m) => Math.abs(m.x - p.x) < m.s && Math.abs(m.y - p.y) < m.s)

  return {
    montagne,
    basi,
    crepe,
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

/** Three shades for each kind of tree, crown and shadow: a forest is never a single flat green */
const TONI: Record<'latifoglie' | 'conifere' | 'cerulea', [string, string][]> = {
  latifoglie: [
    ['#8a9b5d', '#5f7040'],
    ['#7d9256', '#566a3b'],
    ['#98a564', '#6b7746'],
  ],
  conifere: [
    ['#6a8360', '#445c40'],
    ['#5d7857', '#3c5338'],
    ['#748c66', '#4d6446'],
  ],
  cerulea: [
    ['#86adb4', '#557f8a'],
    ['#7aa3b0', '#4c7581'],
    ['#94b8bb', '#5f8890'],
  ],
}

const f1 = (v: number) => Math.round(v * 10) / 10
const pt = (x: number, y: number) => `${f1(x)} ${f1(y)}`

/** An open, smooth line through the points (Catmull-Rom turned into Bézier curves). */
function lineaMorbida(p: Punto[]) {
  let d = `M${pt(...p[0]!)}`
  for (let i = 0; i < p.length - 1; i++) {
    const [x0, y0] = p[Math.max(i - 1, 0)]!
    const [x1, y1] = p[i]!
    const [x2, y2] = p[i + 1]!
    const [x3, y3] = p[Math.min(i + 2, p.length - 1)]!
    d += `C${pt(x1 + (x2 - x0) / 6, y1 + (y2 - y0) / 6)} ${pt(x2 - (x3 - x1) / 6, y2 - (y3 - y1) / 6)} ${pt(x2, y2)}`
  }
  return d
}

/**
 * A mountain drawn by hand, every one different: a broken outline with a shoulder or a second peak,
 * the right side in shadow with a few hatching strokes, and snow on top when it is high or in the north.
 * (x, y) is the middle of its foot, s its size in map units.
 */
function disegnaMonte(x: number, y: number, s: number, neve: boolean, r: () => number): Monte {
  // Broad massifs rather than spikes
  const w = s * (1.25 + r() * 0.6)
  const h = s * (0.95 + r() * 0.35)
  const L: Punto = [x - w / 2, y]
  const R: Punto = [x + w / 2, y]
  const P: Punto = [x + (r() - 0.5) * 0.3 * w, y - h]
  const lungo = (a: Punto, b: Punto, t: number, scarto: number): Punto => [
    a[0] + (b[0] - a[0]) * t + (r() - 0.5) * scarto * w,
    a[1] + (b[1] - a[1]) * t + (r() - 0.5) * scarto * h,
  ]
  // Left slope: one or two kinks
  const sx1 = lungo(L, P, 0.35 + r() * 0.2, 0.12)
  const sx2 = r() < 0.5 ? lungo(L, P, 0.72 + r() * 0.1, 0.08) : null
  // Right slope: a shoulder, sometimes high enough to look like a second peak
  const doppio = r() < 0.3
  const spalla: Punto = [
    P[0] + (R[0] - P[0]) * (0.35 + r() * 0.15),
    P[1] + h * (doppio ? 0.12 + r() * 0.1 : 0.35 + r() * 0.15),
  ]
  const dx1 = lungo(spalla, R, 0.5 + r() * 0.15, 0.1)
  const sinistra = [L, sx1, ...(sx2 ? [sx2] : [])]
  const destra = doppio
    ? [
        [spalla[0] - w * 0.06, spalla[1] + h * 0.12] as Punto,
        [spalla[0] + w * 0.04, spalla[1] - h * 0.05] as Punto,
        dx1,
        R,
      ]
    : [spalla, dx1, R]
  const contorno = [...sinistra, P, ...destra]
  const corpo = `M${contorno.map((p) => pt(...p)).join('L')}Z`

  // The shaded side: from the peak along the right slope, back up a ridge that ends right of the middle
  const piede: Punto = [x + w * (0.05 + r() * 0.12), y]
  const cresta: Punto = [P[0] + (piede[0] - P[0]) * 0.45 + w * 0.05 * (r() - 0.3), P[1] + (piede[1] - P[1]) * 0.45]
  const ombra = `M${[P, ...destra, piede, cresta].map((p) => pt(...p)).join('L')}Z`

  // Ink: the outline (not the foot) and short strokes falling from the ridge
  let linee = `M${contorno.map((p) => pt(...p)).join('L')}`
  linee += `M${pt(...P)}L${pt(...cresta)}`
  const tratti = 2 + Math.floor(r() * 2)
  for (let i = 0; i < tratti; i++) {
    const t = 0.3 + (i / tratti) * 0.6 + r() * 0.06
    const a: Punto = [P[0] + (piede[0] - P[0]) * t, P[1] + (piede[1] - P[1]) * t]
    const lun = w * (0.1 + r() * 0.12)
    linee += `M${pt(...a)}l${pt(lun, lun * 0.55)}`
  }
  // A stroke or two on the lit side, for texture
  if (r() < 0.6) {
    const a: Punto = [L[0] + (P[0] - L[0]) * 0.55, L[1] + (P[1] - L[1]) * 0.55]
    linee += `M${pt(a[0] + w * 0.08, a[1] + h * 0.05)}l${pt(w * 0.06, h * 0.12)}`
  }

  let cappa: string | undefined
  if (neve) {
    // A jagged cap down to about a third of the height
    const k = 0.28 + r() * 0.1
    const a: Punto = [P[0] + (sinistra[sinistra.length - 1]![0] - P[0]) * k * 2.2, P[1] + h * k]
    const b: Punto = [P[0] + (R[0] - P[0]) * k * 1.1, P[1] + h * k * 1.05]
    cappa =
      `M${pt(...P)}L${pt(...b)}L${pt(b[0] - w * 0.08, b[1] - h * 0.04)}L${pt(P[0] + w * 0.04, P[1] + h * k * 1.25)}` +
      `L${pt(P[0] - w * 0.05, P[1] + h * k * 0.8)}L${pt(a[0] + w * 0.05, a[1] + h * 0.05)}L${pt(...a)}Z`
  }
  return { y, corpo, ombra, neve: cappa, linee }
}

/** A low, round hill at the edge of a range. */
function disegnaColle(x: number, y: number, s: number, r: () => number): Monte {
  const w = s * (1.4 + r() * 0.7)
  const h = s * (0.4 + r() * 0.2)
  const cx = x + (r() - 0.5) * w * 0.2
  const L = pt(x - w / 2, y)
  const R = pt(x + w / 2, y)
  const cima = pt(cx, y - h * 1.9)
  const corpo = `M${L}Q${cima} ${R}Z`
  const ombra = `M${pt(cx + w * 0.02, y - h * 0.95)}Q${pt(cx + w * 0.38, y - h * 0.9)} ${R}L${pt(cx + w * 0.12, y)}Z`
  let linee = `M${L}Q${cima} ${R}`
  for (let i = 0; i < 2; i++) {
    const t = 0.3 + i * 0.25
    linee += `M${pt(cx + w * t, y - h * (0.75 - i * 0.25))}l${pt(w * 0.07, h * 0.3)}`
  }
  return { y, corpo, ombra, linee }
}

/** A drawn outline made natural: every side split in three, the new points pushed in or out a little */
function frastaglia(contorno: Punto[], r: () => number): Punto[] {
  const out: Punto[] = []
  for (let i = 0; i < contorno.length; i++) {
    const [x1, y1] = contorno[i]!
    const [x2, y2] = contorno[(i + 1) % contorno.length]!
    const lungo = Math.hypot(x2 - x1, y2 - y1) || 1
    const [nx, ny] = [-(y2 - y1) / lungo, (x2 - x1) / lungo]
    out.push([x1, y1])
    for (const t of [1 / 3, 2 / 3]) {
      const scarto = (r() - 0.5) * Math.min(lungo * 0.5, 26)
      out.push([x1 + (x2 - x1) * t + nx * scarto, y1 + (y2 - y1) * t + ny * scarto])
    }
  }
  return out
}
