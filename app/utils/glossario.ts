// The words of the game, explained once: the definitions come from the rulebook and the newcomers' page.
// They feed the ::glossario list (Inizia a giocare), the :termine[...] tooltips in Markdown and the terms recognised
// in FAQ answers and steps.

export interface VoceGlossario {
  /** Anchor in the glossary list: /inizia-a-giocare#termine-<id> */
  id: string
  /** As it is shown in the list */
  nome: string
  /** The ways it is written in the texts, recognised as whole words (case matters for acronyms) */
  forme: string[]
  definizione: string
}

export const GLOSSARIO: VoceGlossario[] = [
  {
    id: 'larp',
    nome: 'LARP',
    forme: ['LARP'],
    definizione:
      'Live Action Role Playing, il gioco di ruolo dal vivo: interpreti un personaggio in prima persona, in costume, insieme agli altri giocatori.',
  },
  {
    id: 'pg',
    nome: 'PG · Personaggio Giocante',
    forme: ['PG'],
    definizione:
      'Il tuo personaggio, creato da zero: ne scegli storia, abilità e obiettivi, e lo fai crescere evento dopo evento con i PAB.',
  },
  {
    id: 'png',
    nome: 'PNG · Personaggio Non Giocante',
    forme: ['PNG'],
    definizione:
      'Un personaggio scritto dai registi per creare gioco e ambientazione: chi lo interpreta riceve indicazioni precise su cosa fare durante la giornata.',
  },
  {
    id: 'pgos',
    nome: 'PGOS · Personaggio Giocante da One Shot',
    forme: ['PGOS'],
    definizione:
      'Un personaggio preparato dalla regia, con storia e obiettivi, che però gioca come tutti gli altri. Il modo più semplice per cominciare.',
  },
  {
    id: 'pab',
    nome: 'PAB · Punti Abilità',
    forme: ['PAB'],
    definizione:
      'La moneta con cui il personaggio impara nuove capacità: si parte con 130 PAB e se ne guadagnano almeno 10 per ogni giornata di gioco.',
  },
  {
    id: 'in-gioco',
    nome: 'In Gioco (IG)',
    forme: ['In Gioco', 'in gioco'],
    definizione: 'Tutto quello che riguarda il tuo personaggio: ciò che vede, sa, dice e fa nel mondo di gioco.',
  },
  {
    id: 'fuori-gioco',
    nome: 'Fuori Gioco (FG)',
    forme: ['Fuori Gioco', 'fuori gioco'],
    definizione:
      'Tutto quello che riguarda te come persona. Il tuo personaggio non sa le cose che sai tu, e viceversa.',
  },
  {
    id: 'time-in',
    nome: 'Time In',
    forme: ['Time In'],
    definizione: 'L’inizio del gioco: da quel momento sei il tuo personaggio.',
  },
  {
    id: 'time-off',
    nome: 'Time Off · Time Out',
    forme: ['Time Off', 'Time Out'],
    definizione: 'La fine del gioco: si torna a essere sé stessi.',
  },
  {
    id: 'workshop',
    nome: 'Workshop',
    forme: ['Workshop'],
    definizione:
      'L’incontro prima di ogni evento in cui si ripassa tutto quello che serve per giocare, per chi è nuovo e per chi gioca da anni.',
  },
  {
    id: 'vacci-piano',
    nome: '“Vacci piano”',
    forme: ['Vacci piano'],
    definizione:
      'La parola di sicurezza: chi gioca con te deve abbassare subito l’intensità della scena, e la tua scelta non si discute.',
  },
]

const escape = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
// Longest forms first, so "In Gioco" wins over a shorter overlapping form; \p{L} keeps "PG" out of "PGOS"
const FORME = GLOSSARIO.flatMap((voce) => voce.forme.map((forma) => ({ forma, voce }))).sort(
  (a, b) => b.forma.length - a.forma.length,
)
const CERCA = new RegExp(`(?<![\\p{L}\\p{N}])(${FORME.map((f) => escape(f.forma)).join('|')})(?![\\p{L}\\p{N}])`, 'gu')

/** The glossary entry for a word as written in a text, if there is one. */
export function voceGlossario(testo: string): VoceGlossario | undefined {
  // Quotes around the word are part of the text, not of the term: :termine[“Vacci piano”]
  const t = testo.trim().replace(/^[“"«‘]|[”"»’]$/g, '')
  return FORME.find((f) => f.forma === t)?.voce ?? GLOSSARIO.find((v) => v.id === t.toLowerCase())
}

export type PezzoTesto = { testo: string; voce?: VoceGlossario }

/** Splits a text around the glossary words it contains, marking only the first time each entry appears. */
export function dividiTermini(testo: string): PezzoTesto[] {
  const pezzi: PezzoTesto[] = []
  const visti = new Set<string>()
  let da = 0
  for (const m of testo.matchAll(CERCA)) {
    const voce = FORME.find((f) => f.forma === m[1])!.voce
    if (visti.has(voce.id)) continue
    visti.add(voce.id)
    if (m.index > da) pezzi.push({ testo: testo.slice(da, m.index) })
    pezzi.push({ testo: m[1]!, voce })
    da = m.index + m[1]!.length
  }
  if (da < testo.length) pezzi.push({ testo: testo.slice(da) })
  return pezzi
}
