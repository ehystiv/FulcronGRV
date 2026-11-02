export const NAV_LINKS = [
  { to: '/', label: 'Home' },
  { to: '/chi-siamo', label: 'Chi siamo' },
  { to: '/sinfonia/ambientazione', label: 'La Sinfonia dei Sette', match: '/sinfonia' },
  { to: '/oneshot', label: 'Oneshot' },
  { to: '/wiki', label: 'Wiki' },
]

export const SOCIAL_LINKS = [
  { name: 'facebook', label: 'Facebook', href: 'https://www.facebook.com/fulcrongrv' },
  { name: 'instagram', label: 'Instagram', href: 'https://www.instagram.com/fulcrongrv' },
  { name: 'youtube', label: 'YouTube', href: 'https://www.youtube.com/channel/UCcFUnolPnHeIUd8Heu-_kWA' },
  { name: 'telegram', label: 'Telegram', href: 'https://t.me/FulcronGRV' },
  { name: 'whatsapp', label: 'WhatsApp', href: 'https://chat.whatsapp.com/8PjZxAAbWXvAHVdMGpukLn' },
]

/** Official details of the association (privacy page). Empty fields are not shown. */
export const ASSOCIATION = {
  name: 'Associazione FulcronGRV',
  address: 'Via del Corso 107, Castiglione dei Pepoli (BO)',
  taxCode: '',
  email: '',
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
