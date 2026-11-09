// The calendar of Fulcron (wiki/storia/calendario): twelve months as long as ours, the year is ours + 1000, and seven
// weekdays named after the Seven Gods. Surana, the day of Surya the Sun, is taken as our Sunday.

export const MESI_FULCRON = [
  'Nevoso',
  'Piovoso',
  'Ventoso',
  'Germile',
  'Fiorile',
  'Pratile',
  'Messidoro',
  'Termidoro',
  'Fruttidoro',
  'Vendemmiaio',
  'Brumaio',
  'Frimaio',
] as const

/** From our Sunday (getDay() = 0) to Saturday */
export const GIORNI_FULCRON = ['Surana', 'Havana', 'Samuna', 'Yudana', 'Samana', 'Andana', 'Mausana'] as const

/** The main feasts of the North, by month (0 = Nevoso) and day */
const FESTE: { mese: number; giorno: number; nome: string }[] = [
  { mese: 0, giorno: 1, nome: 'Festa del Sole' },
  { mese: 2, giorno: 20, nome: 'Festa della Semina' },
  { mese: 5, giorno: 21, nome: 'Festa della Vita' },
  { mese: 8, giorno: 22, nome: 'Festa del Raccolto' },
  { mese: 11, giorno: 23, nome: 'Festa della Morte' },
  { mese: 11, giorno: 31, nome: 'Festa del Sole' },
]

export interface DataFulcron {
  settimana: (typeof GIORNI_FULCRON)[number]
  giorno: number
  mese: (typeof MESI_FULCRON)[number]
  anno: number
  festa?: string
  /** "Surana 9 Brumaio 3026" */
  testo: string
}

/** The date in the Ring for one of our dates (local time). */
export function dataFulcron(data: Date): DataFulcron {
  const m = data.getMonth()
  const giorno = data.getDate()
  const settimana = GIORNI_FULCRON[data.getDay()]!
  const mese = MESI_FULCRON[m]!
  const anno = data.getFullYear() + 1000
  const festa = FESTE.find((f) => f.mese === m && f.giorno === giorno)?.nome
  return { settimana, giorno, mese, anno, festa, testo: `${settimana} ${giorno} ${mese} ${anno}` }
}
