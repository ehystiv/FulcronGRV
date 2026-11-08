/** Default description and share image of the site, for pages that have none of their own. */
export const SITE_DESCRIPTION =
  'FulcronGRV è un’associazione di gioco di ruolo dal vivo (LARP) dell’Appennino Tosco-Emiliano: la campagna fantasy “La Sinfonia dei Sette”, oneshot e molto altro.'
export const SITE_IMAGE = '/backgrounds/forest_op_comp.jpg'

export const NAV_LINKS = [
  { to: '/', label: 'Home' },
  { to: '/chi-siamo', label: 'Chi siamo' },
  { to: '/sinfonia', label: 'La Sinfonia dei Sette' },
  { to: '/oneshot', label: 'Oneshot' },
  { to: '/gallery', label: 'Gallery' },
  { to: '/wiki', label: 'Wiki' },
]

/** The one contact channel of the association: dates, sign-ups and questions all go through Instagram. */
export const INSTAGRAM = { handle: '@fulcrongrv', href: 'https://www.instagram.com/fulcrongrv' }

/** Official details of the association (Agenzia delle Entrate certificate). */
export const ASSOCIATION = {
  name: 'Associazione FulcronGRV',
  street: 'Via del Corso 107',
  postalCode: '40035',
  city: 'Castiglione dei Pepoli',
  province: 'BO',
  taxCode: '91407660371',
}

const dateFormatter = new Intl.DateTimeFormat('it-IT', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
  timeZone: 'Europe/Rome',
})

/** "7 novembre 2020" */
export function formatDate(value?: string | Date | null) {
  if (!value) return ''
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? '' : dateFormatter.format(date)
}
