<script setup lang="ts">
// Computed at build time and reused on the client: no hydration mismatch
const year = useState('footer-year', () => new Date().getFullYear())

const columns = [
  {
    title: 'Esplora',
    links: [...NAV_LINKS, { to: '/inizia-a-giocare', label: 'Inizia a giocare' }],
  },
  {
    title: 'La campagna',
    links: [
      { to: '/sinfonia/ambientazione', label: 'Ambientazione' },
      { to: '/sinfonia/regolamento', label: 'Regolamento e manuali' },
      { to: '/sinfonia/bacheca', label: 'Bacheca' },
      { to: '/wiki', label: 'Wiki di Fulcron' },
    ],
  },
]

const contacts = SOCIAL_LINKS.filter((s) => ['telegram', 'whatsapp', 'facebook'].includes(s.name)).map((s) => ({
  ...s,
  text: { telegram: 'Canale Telegram', whatsapp: 'Gruppo WhatsApp', facebook: 'Messaggio su Facebook' }[s.name],
}))

const linkClass = 'text-on-dark-muted no-underline hover:text-gold-soft'

// Legal line, split into pieces that never break in the middle (e.g. "C.F. 91407660371")
const legal = [
  { text: `© ${year.value} ${ASSOCIATION.name}`, after: ' · ' },
  { text: `${ASSOCIATION.street},`, after: ' ' },
  { text: `${ASSOCIATION.postalCode} ${ASSOCIATION.city} (${ASSOCIATION.province})`, after: ' · ' },
  { text: `C.F. ${ASSOCIATION.taxCode}`, after: '' },
]
</script>

<template>
  <footer class="on-dark mt-auto border-t border-gold-soft/25 bg-ink-deep text-[0.95rem] text-on-dark-muted">
    <div class="container-site grid gap-10 pt-14 pb-10 sm:grid-cols-2 lg:grid-cols-[1.6fr_1fr_1fr_1.2fr]">
      <div>
        <NuxtLink
          to="/"
          class="mb-4 inline-flex items-center gap-3 font-display text-2xl text-on-dark no-underline hover:text-gold-soft"
        >
          <NuxtImg
            src="/logos/logo_bianco_trim.png"
            alt=""
            width="40"
            height="40"
            densities="x1 x2"
            format="webp"
            loading="lazy"
          />
          <span>FulcronGRV</span>
        </NuxtLink>
        <p class="max-w-[38ch]">
          Associazione di gioco di ruolo dal vivo nata tra i boschi dell’Appennino Tosco-Emiliano.
        </p>
      </div>

      <nav v-for="col in columns" :key="col.title" :aria-label="col.title">
        <h2 class="mb-4 font-display text-base tracking-[0.12em] text-gold-soft">{{ col.title }}</h2>
        <ul class="space-y-1.5">
          <li v-for="link in col.links" :key="link.label">
            <NuxtLink :to="link.to" :class="linkClass">{{ link.label }}</NuxtLink>
          </li>
        </ul>
      </nav>

      <div>
        <h2 class="mb-4 font-display text-base tracking-[0.12em] text-gold-soft">Contatti</h2>
        <ul class="space-y-1.5">
          <li v-for="c in contacts" :key="c.name">
            <a :href="c.href" target="_blank" rel="noopener" :class="[linkClass, 'inline-flex items-center gap-2']">
              <AppIcon :name="c.name" :size="16" /> {{ c.text }}
            </a>
          </li>
        </ul>
        <ul class="mt-5 flex flex-wrap gap-2" aria-label="Social">
          <li v-for="s in SOCIAL_LINKS" :key="s.name">
            <a
              :href="s.href"
              target="_blank"
              rel="noopener"
              :aria-label="s.label"
              :title="s.label"
              class="grid size-10 place-items-center rounded-full border border-white/15 text-on-dark transition-colors hover:border-gold hover:bg-gold hover:text-ink-deep"
            >
              <AppIcon :name="s.name" :size="18" />
            </a>
          </li>
        </ul>
      </div>
    </div>

    <div class="container-site flex flex-wrap justify-between gap-x-6 gap-y-2 border-t border-white/10 py-5 text-sm">
      <p>
        <template v-for="part in legal" :key="part.text"
          ><span class="whitespace-nowrap">{{ part.text }}</span
          >{{ part.after }}</template
        >
      </p>
      <NuxtLink to="/privacy" :class="linkClass">Privacy</NuxtLink>
    </div>
  </footer>
</template>
