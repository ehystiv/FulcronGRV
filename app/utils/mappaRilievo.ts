// Heights of the Ring for the 3D view of the map (components/mappa/MappaRilievo.vue).
// The shape of the land comes from the map (coasts, ranges, the Wall); how high and how rough each part is follows
// the wiki, which is the reliable source:
// - the Alte Montagne are the highest, "cime aguzze perennemente ricoperte di ghiaccio e neve";
// - the Monti Lerrnerum are a "grande catena montuosa", the Rocca Fantasma stands in the mountains;
// - the North is a frozen moor, the West "foreste e montagne impervie", the Piana di Wakan a flat sea of grass;
// - the South ends in a boundless marsh, below the Wall;
// - Eryma, inside the Wall, was replaced by a chasm on the Day of the Breach (3014);
// - Monte Iridel is a dormant volcano.
// Browser only: the coast is drawn on a canvas to tell land from water.
import { MAPPA_CATENE, MAPPA_ISOLE, MAPPA_LAGHI, MAPPA_LATO, MAPPA_MARE, MAPPA_PICCHI } from './mappa'

/** Height in map units of the tallest peaks; the board is 1280 wide */
export const RILIEVO_ALTEZZA = 78

export interface Rilievo {
  /** Points per side of the grid */
  lato: number
  /** Heights, row by row from the top of the map (north) */
  quote: Float32Array
}

type Punto = [number, number]

/** The cities of the Wall, west to east: the Wall runs through them */
const MURAGLIA: Punto[] = [
  [462, 1234],
  [520, 1216],
  [572, 1203],
  [640, 1188],
  [731, 1181],
  [801, 1164],
  [816, 1158],
]
const ERYMA: Punto = [731, 1181]

/** Land shapes and how they lie, by area: [centre, radii, how much higher (or lower), how rough] */
const CARATTERE: { c: Punto; r: Punto; quota: number; ruvido: number }[] = [
  { c: [210, 500], r: [170, 90], quota: -2, ruvido: 0.15 }, // Piana di Wakan: flat grass
  { c: [700, 1268], r: [440, 100], quota: -5, ruvido: 0.25 }, // the marsh past the Wall
  { c: [290, 1232], r: [175, 72], quota: -4, ruvido: 0.25 }, // Sabbie Mobili
  { c: [1180, 560], r: [250, 380], quota: 1, ruvido: 0.7 }, // dunes of the Great Desert
  { c: [190, 690], r: [160, 240], quota: 3, ruvido: 1.2 }, // the Chult: rough ground under the trees
  { c: [640, 90], r: [640, 110], quota: 1, ruvido: 0.6 }, // the frozen moor of the North
]

function distanzaDalSegmento([px, py]: Punto, [ax, ay]: Punto, [bx, by]: Punto) {
  const dx = bx - ax
  const dy = by - ay
  const t = Math.max(0, Math.min(1, ((px - ax) * dx + (py - ay) * dy) / (dx * dx + dy * dy)))
  return Math.hypot(px - ax - t * dx, py - ay - t * dy)
}
function distanzaDallaLinea(p: Punto, linea: Punto[]) {
  let d = Infinity
  for (let i = 0; i < linea.length - 1; i++) d = Math.min(d, distanzaDalSegmento(p, linea[i]!, linea[i + 1]!))
  return d
}

/** Smooth value noise in [-1, 1], the same at every build */
function rumore(seme: number) {
  const valore = (ix: number, iy: number) => {
    let h = Math.imul(ix, 374761393) + Math.imul(iy, 668265263) + seme * 144665
    h = Math.imul(h ^ (h >>> 13), 1274126177)
    return ((h ^ (h >>> 16)) >>> 0) / 2147483648 - 1
  }
  const liscio = (t: number) => t * t * (3 - 2 * t)
  return (x: number, y: number) => {
    const ix = Math.floor(x)
    const iy = Math.floor(y)
    const fx = liscio(x - ix)
    const fy = liscio(y - iy)
    const a = valore(ix, iy) + (valore(ix + 1, iy) - valore(ix, iy)) * fx
    const b = valore(ix, iy + 1) + (valore(ix + 1, iy + 1) - valore(ix, iy + 1)) * fx
    return a + (b - a) * fy
  }
}

/** Box blur of a square grid, in place, a few times over: close to a Gaussian */
function sfoca(v: Float32Array, lato: number, raggio: number, passate = 3) {
  const tmp = new Float32Array(v.length)
  for (let p = 0; p < passate; p++) {
    for (let y = 0; y < lato; y++) {
      for (let x = 0; x < lato; x++) {
        let s = 0
        let n = 0
        for (let k = -raggio; k <= raggio; k++) {
          const xx = x + k
          if (xx >= 0 && xx < lato) {
            s += v[y * lato + xx]!
            n++
          }
        }
        tmp[y * lato + x] = s / n
      }
    }
    for (let y = 0; y < lato; y++) {
      for (let x = 0; x < lato; x++) {
        let s = 0
        let n = 0
        for (let k = -raggio; k <= raggio; k++) {
          const yy = y + k
          if (yy >= 0 && yy < lato) {
            s += tmp[yy * lato + x]!
            n++
          }
        }
        v[y * lato + x] = s / n
      }
    }
  }
}

/** Land (1) and water (0) on the grid: the sea and lakes from the map, with the islands back on top */
function terraferma(lato: number) {
  const tela = document.createElement('canvas')
  tela.width = tela.height = lato
  const ctx = tela.getContext('2d')!
  ctx.scale(lato / MAPPA_LATO, lato / MAPPA_LATO)
  ctx.fillStyle = '#fff'
  ctx.fillRect(0, 0, MAPPA_LATO, MAPPA_LATO)
  ctx.fillStyle = '#000'
  ctx.fill(new Path2D(MAPPA_MARE))
  for (const d of MAPPA_LAGHI) ctx.fill(new Path2D(d))
  ctx.fillStyle = '#fff'
  for (const d of MAPPA_ISOLE) ctx.fill(new Path2D(d))
  const pixel = ctx.getImageData(0, 0, lato, lato).data
  const terra = new Float32Array(lato * lato)
  for (let i = 0; i < terra.length; i++) terra[i] = pixel[i * 4]! / 255
  return terra
}

/** The heights of the whole Ring on a grid of `lato` × `lato` points. */
export function rilievoMappa(lato = 321): Rilievo {
  const passo = MAPPA_LATO / (lato - 1)
  const terra = terraferma(lato)
  // Soft coasts: the land rises gently from the beach, the sea floor sinks away from it
  const costa = terra.slice()
  sfoca(costa, lato, Math.max(1, Math.round(10 / passo)))
  const fondale = terra.slice()
  sfoca(fondale, lato, Math.max(2, Math.round(40 / passo)))

  const r1 = rumore(7)
  const r2 = rumore(31)
  const quote = new Float32Array(lato * lato)
  for (let iy = 0; iy < lato; iy++) {
    for (let ix = 0; ix < lato; ix++) {
      const i = iy * lato + ix
      const p: Punto = [ix * passo, iy * passo]
      const [x, y] = p

      // Character of the land here: higher or lower ground, smoother or rougher
      let base = 4
      let ruvido = 1
      for (const c of CARATTERE) {
        const k = Math.exp(-(((x - c.c[0]) / c.r[0]) ** 2 + ((y - c.c[1]) / c.r[1]) ** 2) * 1.6)
        base += c.quota * k
        ruvido += (c.ruvido - 1) * k
      }
      const colline = (r1(x / 70, y / 70) * 3 + r2(x / 22, y / 22) * 1.2) * ruvido

      // Mountain ranges: a ridge along each crest, broken up by noise so peaks rise and fall
      let monti = 0
      for (const catena of MAPPA_CATENE) {
        const d = distanzaDallaLinea(p, catena.linea)
        const largo = catena.largo * 1.35 + 6
        if (d > largo * 2.6) continue
        const cresta = Math.exp(-((d / largo) ** 2) * 1.4)
        const cime = 0.62 + 0.38 * Math.abs(r2(x / 15 + catena.quota * 9, y / 15))
        monti = Math.max(monti, RILIEVO_ALTEZZA * catena.quota * cresta * cime)
      }
      for (const [px, py, s] of MAPPA_PICCHI) {
        const d = Math.hypot(x - px, y - py)
        const alto = s * 2.4
        let picco = alto * Math.exp(-((d / (s * 1.4)) ** 2))
        // Monte Iridel, the dormant volcano: a crater on the top
        if (px === 266 && py === 156) picco -= alto * 0.35 * Math.exp(-((d / (s * 0.45)) ** 2))
        monti = Math.max(monti, picco)
      }

      // The Wall: a long straight rampart, broken at Eryma by the chasm of the Breach
      let muro = 0
      const dMuro = distanzaDallaLinea(p, MURAGLIA)
      const dEryma = Math.hypot(x - ERYMA[0], y - ERYMA[1])
      if (dMuro < 4 && dEryma > 14) muro = 9 * (1 - (dMuro / 4) ** 4)
      const voragine = -16 * Math.exp(-((dEryma / 13) ** 2))

      const suolo = (base + colline + monti + muro + voragine) * costa[i]!
      // Under water: from the beach down to the open sea
      const sotto = -2 - 16 * (1 - fondale[i]!)
      quote[i] = terra[i]! > 0.5 ? Math.max(suolo, 0.8) : Math.min(sotto, -1) * (1 - costa[i]!) + suolo * costa[i]!
    }
  }
  return { lato, quote }
}
